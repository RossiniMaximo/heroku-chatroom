let admin = require("firebase-admin")
let serviceAccount = require("./key.json")


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
    databaseURL: "https://apx-dwf-m6-674e5-default-rtdb.firebaseio.com"
});

const firestore = admin.firestore();
const rtdb = admin.database();

export { firestore, rtdb };
