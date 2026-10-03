const DROPBOX_API = 'https://api.dropboxapi.com/2';
const DROPBOX_CONTENT = 'https://content.dropboxapi.com/2';
const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'tif', 'tiff', 'ppm', 'bmp']);

let cachedAccessToken = '';
let accessTokenExpiresAt = 0;

async function getAccessToken(env) {
    if (cachedAccessToken && Date.now() < accessTokenExpiresAt) {
        return cachedAccessToken;
    }

    const credentials = btoa(`${env.DROPBOX_APP_KEY}:${env.DROPBOX_APP_SECRET}`);
    const body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: env.DROPBOX_REFRESH_TOKEN
    });
    const response = await fetch('https://api.dropbox.com/oauth2/token', {
        method: 'POST',
        headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
    });

    if (!response.ok) throw new Error(`Dropbox token request failed (${response.status})`);
    const result = await response.json();
    cachedAccessToken = result.access_token;
    accessTokenExpiresAt = Date.now() + Math.max(60, result.expires_in - 60) * 1000;
    return cachedAccessToken;
}

function isImageFile(entry) {
    if (entry['.tag'] !== 'file') return false;
    return IMAGE_EXTENSIONS.has(entry.name.split('.').pop()?.toLowerCase());
}

async function listImages(token, sharedFolderUrl) {
    const images = [];
    let response = await fetch(`${DROPBOX_API}/files/list_folder`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            path: '',
            recursive: false,
            shared_link: { url: sharedFolderUrl },
            limit: 1000
        })
    });

    if (!response.ok) throw new Error(`Dropbox folder request failed (${response.status})`);
    let result = await response.json();
    images.push(...result.entries.filter(isImageFile));

    while (result.has_more) {
        response = await fetch(`${DROPBOX_API}/files/list_folder/continue`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cursor: result.cursor })
        });
        if (!response.ok) throw new Error(`Dropbox folder request failed (${response.status})`);
        result = await response.json();
        images.push(...result.entries.filter(isImageFile));
    }

    return images.sort((left, right) => right.server_modified.localeCompare(left.server_modified));
}

function jsonResponse(body, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-store',
            'X-Content-Type-Options': 'nosniff'
        }
    });
}

export async function onRequestGet({ request, env }) {
    try {
        const sharedFolderUrl = env.DROPBOX_SHARED_FOLDER_URL;
        if (!env.DROPBOX_APP_KEY || !env.DROPBOX_APP_SECRET || !env.DROPBOX_REFRESH_TOKEN || !sharedFolderUrl) {
            return jsonResponse({ error: 'Dropbox gallery is not configured.' }, 503);
        }

        const token = await getAccessToken(env);
        const url = new URL(request.url);
        const imagePath = url.searchParams.get('path');

        if (imagePath === null) {
            const images = await listImages(token, sharedFolderUrl);
            return jsonResponse({
                images: images.map(image => {
                    const path = image.path_display || image.path_lower;
                    return {
                        name: image.name,
                        src: `/api/gallery?path=${encodeURIComponent(path)}`
                    };
                })
            });
        }

        const extension = imagePath.split('.').pop()?.toLowerCase();
        if (!imagePath.startsWith('/') || imagePath.split('/').includes('..') || !IMAGE_EXTENSIONS.has(extension)) {
            return jsonResponse({ error: 'Invalid image.' }, 400);
        }

        const thumbnailResponse = await fetch(`${DROPBOX_CONTENT}/files/get_thumbnail_v2`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Dropbox-API-Arg': JSON.stringify({
                    resource: { '.tag': 'link', url: sharedFolderUrl, path: imagePath },
                    format: { '.tag': 'jpeg' },
                    size: { '.tag': 'w640h480' }
                })
            }
        });
        if (!thumbnailResponse.ok) return new Response('Image unavailable', { status: 404 });

        return new Response(thumbnailResponse.body, {
            headers: {
                'Content-Type': 'image/jpeg',
                'Cache-Control': 'public, max-age=300',
                'X-Content-Type-Options': 'nosniff'
            }
        });
    } catch (error) {
        console.error('Dropbox gallery request failed:', error.message);
        return jsonResponse({ error: 'The photo gallery is temporarily unavailable.' }, 502);
    }
}
