import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCvL2pqeiDkIruGEoi7LPnv5IhsjpxXkOE",
    authDomain: "sabores-da-juju.firebaseapp.com",
    projectId: "sabores-da-juju",
    storageBucket: "sabores-da-juju.firebasestorage.app",
    messagingSenderId: "592049657336",
    appId: "1:592049657336:web:d90bf88dfe3f04f466b20d"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
