// =============================================================
//  WEDDING CONFIGURATION — edit this file with your details.
//  Everything on the website comes from this single file.
// =============================================================

const WEDDING = {

    // ── Names & Introduction ──────────────────────────────────
    couple: {
        partner1: "Χάρις",
        partner2: "Τάσος",
        fullNames: "Χάρις & Τάσος"
    },

    // ── Wedding Date ──────────────────────────────────────────
    //    Summer Athens = UTC+3 → +03:00  |  Winter = +02:00
    date: {
        iso: "2026-12-19T19:45:00+03:00",  // ← UPDATE THIS (only field needed)
        timezone: "Europe/Athens"
    },

    // ── RSVP Deadline ────────────────────────────────────────
    rsvpDeadline: {
        iso: "2026-12-09"                        // ← UPDATE THIS (only field needed)
    },

    // ── Hero Photograph ──────────────────────────────────────
    //    Replace with your own photo: "images/hero.jpg"
    hero: {
        image: "https://i.pinimg.com/1200x/d1/75/c8/d175c847d83c697d9daafbeaafa46fcd.jpg",
        imageAlt: "Xaris and Tasos"
    },

    // ── Couple portrait (full-width section) ─────────────────
    //    Replace with your own photo: "images/couple.jpg"
    couplePhoto: {
        image: "images/IMG_20260914_163132.jpg",
        alt: "Χάρις και Τάσος"
    },

    // ── Save the Date photo ───────────────────────────────────
    //    Replace with your own photo: "images/savedate.jpg"
    saveDatePhoto: {
        image: "https://i.pinimg.com/1200x/d1/75/c8/d175c847d83c697d9daafbeaafa46fcd.jpg",
        alt: "Χάρις και Τάσος"
    },

    // ── Events ───────────────────────────────────────────────
    //    Add or remove objects to add/remove events on the site
    events: [
        {
            type: "ceremony",
            label: "ΤΕΛΕΤΗ",
            venue: "ΔΗΜΑΡΧΕΙΟ ΠΕΙΡΑΙΑ",              // ← UPDATE
            // dateIso: omit to use the wedding date; set only if ceremony is on a different day
            startTime: "19:45",
            endTime: "-",
            address: "Πλατεία Κοραή 1, 185 35 Πειραιάς",  // ← UPDATE
            mapUrl: "https://maps.app.goo.gl/5d34Wj4d9uzv8nPh6",  // ← UPDATE
            description: "Join us for our wedding ceremony."
        },
        {
            type: "reception",
            label: "ΤΑΒΕΡΝΑ ΜΟΥΡΙΕΣ",
            venue: "ΤΑΒΕΡΝΑ ΜΟΥΡΙΕΣ",             // ← UPDATE
            // dateIso: omit to use the wedding date; set only if reception is on a different day
            startTime: "21:00",
            endTime: "-",
            address: "Γιαννιτσών 101, Περιστέρι 121 31",  // ← UPDATE
            mapUrl: "https://maps.app.goo.gl/oKqe49hCPFZzJS4N9",  // ← UPDATE
            description: "Dinner, dancing, and celebration with family and friends."
        }
    ],

    // ── Gallery photo ─────────────────────────────────────────
    //    One photo shown full-width. Replace with: "images/gallery.jpg"
    gallery: [
        { src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80", alt: "Χάρις και Τάσος" }
    ],

    // ── Travel Information ───────────────────────────────────
    travel: {
        enabled: true,
        items: [
            { icon: "✈", title: "By Air", text: "Athens International Airport (ATH) is served by most major carriers. The city centre is approximately 40 minutes by express train or taxi." },
            { icon: "🚕", title: "By Taxi", text: "Taxis are easy to find across Athens. The BEAT app offers reliable metered rides. Uber also operates in the city." },
            { icon: "🚇", title: "By Metro", text: "Athens Metro Line 3 (Blue) connects the airport to Syntagma Square and other central stations — fast and affordable." },
            { icon: "🚗", title: "By Car", text: "Parking is available at the venue. Allow extra time for Athens traffic, particularly in the early evening." }
        ]
    },

    // ── Witnesses / Μάρτυρες ─────────────────────────────────
    witnesses: [
        {
            name: "Ελένη Γκότζια",     // ← UPDATE
            role: "Μάρτυρας",            // ← UPDATE e.g. Κουμπάρος / Κουμπάρα / Παράνυμφος
            image: "images/IMG_20260908_021716.jpg",
            alt: "Μάρτυρας 1"
        },
        {
            name: "Δήμητρα Γκότζια",     // ← UPDATE
            role: "Μάρτυρας",             // ← UPDATE
            image: "images/dimitra.jpg",
            alt: "Μάρτυρας 2"
        }
    ],

    // ── Contact ──────────────────────────────────────────────
    contact: {
        enabled: true,
        bride: { name: "Χάρις Γκότζια", phone: "6987099853" },   // ← UPDATE
        groom: { name: "Τάσος Αθανασόπουλος", phone: "6955190409" },   // ← UPDATE
        note: "Για οποιαδήποτε ερώτηση σχετικά με την ημέρα, επικοινωνήστε μαζί μας."
    },

    // ── Guest Photo Upload ───────────────────────────────────
    //    Create a Google Form with a File Upload question, then paste
    //    its share URL here. Photos land directly in your Google Drive.
    //    How to set up: forms.google.com → New Form → Add question →
    //    File upload → Share → Copy link → paste below.
    photoUpload: {
        enabled: true,
        driveUrl: "https://www.dropbox.com/request/gikx637z5t5l8x78bjnq",
        viewUrl: "https://www.dropbox.com/scl/fo/rlflhjo010sijedict46p/AAI1qNg1v1xUxmgANFtu7Kw?rlkey=5nbboqrs19b6du203ajlnh2xw&st=itqdox3v&dl=0"
    },

    // ── Supabase (RSVP Backend) ──────────────────────────────
    //    Setup instructions in README.md and supabase-schema.sql
    //    IMPORTANT: Only ever use the anon/public key here — never service_role
    supabase: {
        url: "https://fepltanqlzrahktwdbkq.supabase.co",
        anonKey: "sb_publishable_r5NiAU3houMtG3vGTv3skA_oqbxgo5t"
    },

    // ── SEO & Social Sharing ─────────────────────────────────
    seo: {
        // title and description are auto-generated from couple names + date at runtime
        ogImage: "images/og-image.jpg",
        canonicalUrl: "https://yourdomain.com"  // ← UPDATE with your domain
    }

};

// =============================================================
//  TRANSLATIONS — all UI text in Greek
// =============================================================
const TRANSLATIONS = {
    el: {
        nav: {
            details: 'Λεπτομέρειες', gallery: 'Φωτογραφίες', rsvp: 'RSVP',
            openMenu: 'Άνοιγμα μενού πλοήγησης'
        },
        hero: { eyebrow: 'Παντρευόμαστε' },
        countdown: {
            intro: 'Αντίστροφη μέτρηση',
            days: 'Μέρες', hours: 'Ώρες', minutes: 'Λεπτά', seconds: 'Δευτερόλεπτα',
            married: 'παντρεμένοι'
        },
        events: {
            tag: 'Save the Date', heading: 'Κρατήστε την Ημερομηνία',
            subtitle: 'Θα είναι χαρά και τιμή μας να σας έχουμε κοντά μας στην ομορφότερη στιγμή της ζωής μας.',
            dateKey: 'Ημερομηνία', timeKey: 'Ώρα', venueKey: 'Χώρος',
            mapBtn: '↗ Άνοιγμα Χάρτη', calBtn: '+ Προσθήκη στο Ημερολόγιο',
            labels: { ceremony: 'Τελετή', reception: 'Δεξίωση' }
        },
        venues: { heading: 'Λεπτομέρειες Τελετής & Δεξίωσης', subtitle: 'Τα ακριβή στοιχεία για κάθε χώρο.' },
        witnesses: { tag: 'Μάρτυρες', heading: 'Οι Μάρτυρές μας' },
        gallery: { tag: 'Φωτογραφίες', heading: 'Στιγμές μαζί' },
        rsvp: {
            tag: 'RSVP', heading: 'Θα έρθετε;', deadlinePrefix: 'Απαντήστε μέχρι',
            nameLbl: 'Ονοματεπώνυμο', namePlaceholder: 'Το ονοματεπώνυμό σας',
            emailLbl: 'Διεύθυνση Email', emailPlaceholder: 'email@παράδειγμα.com',
            attendanceLbl: 'Θα παραστείτε;',
            yes: 'Με χαρά αποδέχομαι', no: 'Δυστυχώς αδυνατώ',
            guestsLbl: 'Αριθμός ατόμων (συμπεριλαμβανομένου εαυτού)',
            guestOptions: ['1 άτομο', '2 άτομα', '3 άτομα', '4 άτομα', '5 άτομα', '6 άτομα'],
            dietaryLbl: 'Διατροφικές ανάγκες',
            dietaryPlaceholder: 'Χορτοφαγία, vegan, αλλεργία… (προαιρετικό)',
            messageLbl: 'Μήνυμα για το ζευγάρι',
            messagePlaceholder: 'Πείτε μας δυο λόγια… (προαιρετικό)',
            submitBtn: 'Αποστολή RSVP', sendingBtn: 'Αποστολή…',
            successYesH: 'Ανυπομονούμε να σας δούμε!',
            successYesP: 'Λάβαμε το RSVP σας, {name}. Τα λέμε στις {date} — θα είναι μια όμορφη μέρα.',
            successNoH: 'Σας ευχαριστούμε που μας ενημερώσατε',
            successNoP: 'Θα μας λείψετε, {name}, αλλά εκτιμούμε που μας απαντήσατε.',
            errName: 'Παρακαλώ εισάγετε το ονοματεπώνυμό σας.',
            errEmail: 'Παρακαλώ εισάγετε έγκυρη διεύθυνση email.',
            errAttendance: 'Παρακαλώ επιλέξτε αν θα παραστείτε.',
            errGuests: 'Παρακαλώ επιλέξτε έγκυρο αριθμό ατόμων.',
            errGeneric: 'Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά ή επικοινωνήστε μαζί μας.',
            demoNote: '<strong>Σημείωση:</strong> Η φόρμα RSVP είναι σε λειτουργία επίδειξης — οι απαντήσεις δεν αποθηκεύονται μέχρι να συνδεθεί το Supabase.'
        },
        travel: {
            tag: 'Πώς να φτάσετε', heading: 'Μεταφορά',
            items: [
                { title: 'Αεροπορικώς', text: 'Το Διεθνές Αεροδρόμιο Αθηνών (ATH) εξυπηρετείται από τις περισσότερες μεγάλες αεροπορικές εταιρείες. Το κέντρο της πόλης απέχει περίπου 40 λεπτά με εξπρές τρένο ή ταξί.' },
                { title: 'Ταξί', text: 'Τα ταξί είναι εύκολο να βρεθούν σε όλη την Αθήνα. Η εφαρμογή BEAT προσφέρει αξιόπιστες μετρητικές διαδρομές. Το Uber λειτουργεί επίσης στην πόλη.' },
                { title: 'Μετρό', text: 'Η Γραμμή 3 (Μπλε) του Μετρό Αθηνών συνδέει το αεροδρόμιο με το Σύνταγμα και άλλους κεντρικούς σταθμούς — γρήγορα και οικονομικά.' },
                { title: 'Αυτοκίνητο', text: 'Διατίθεται χώρος στάθμευσης στον χώρο. Αφήστε επιπλέον χρόνο για την κίνηση της Αθήνας, ιδιαίτερα νωρίς το βράδυ.' }
            ]
        },
        contact: { tag: 'Επικοινωνία', heading: 'Επικοινωνήστε μαζί μας', note: 'Για οποιαδήποτε ερώτηση σχετικά με την ημέρα, επικοινωνήστε μαζί μας.' },
        photos: {
            tag: 'Φωτογραφία Γάμου',
            heading: 'Μοιραστείτε τις Στιγμές σας',
            subtitle: 'Τραβήξατε φωτογραφίες από την ημέρα; Θέλουμε να τις δούμε όλες!',
            note: 'Ανεβάστε τις φωτογραφίες σας απευθείας στο κοινό μας άλμπουμ. Τιποτα δεν χρειάζεται εγγραφή ή λογαριασμός.',
            btn: 'Ανέβασμα Φωτογραφίες ↗',
            viewBtn: 'Δείτε όλες τις Φωτογραφίες ↗'
        },
        footer: { madeWith: 'Φτιαγμένο με αγάπη' }
    },
};
