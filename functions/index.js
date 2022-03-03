const functions = require("firebase-functions");
const admin = require("firebase-admin");

var serviceAccount = require("./trick-le-f8bd38039302.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://trick-le-default-rtdb.firebaseio.com"
});
/*admin.initializeApp({
    credential: applicationDefault(),
    databaseURL: "https://trick-le-default-rtdb.firebaseio.com"
});*/

exports.onGameCreate = functions.database.ref("/games/{gameid}")
    .onCreate((snapshot, context) => {
        let gameid = context.params.gameid;
        console.log("Game ID: " + gameid);
        let data = {
            p1: "false",
            p2: "false"
        };
        let db = admin.database();
        let ref = db.ref("/gamedata/" + gameid);
        return ref.set(data);
    });

exports.login = functions.https.onRequest(async(request, response) => {
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Methods', 'GET, POST');
    const user = request.query.user;
    const gameid = request.query.gameid;
    let db = admin.database();
    let ref = db.ref(`/gamedata/${gameid}/`);
    ref.once('value').then((snapshot) => {
        if (snapshot.exists()) {
            let u1 = snapshot.child("p1").val();
            let u2 = snapshot.child("p2").val();
            console.log(user);
            if (u1 == "false") {
                db.ref(`/gamedata/${gameid}/p1`).set(user.substring(0, 10));
                db.ref(`/secrets/${gameid}/p1`).set(user);
                response.send("P1");
            } else if (u2 == "false" && !user.startsWith(u1)) {
                db.ref(`/gamedata/${gameid}/p2`).set(user.substring(0, 10));
                db.ref(`/secrets/${gameid}/p2`).set(user);
                response.send("P2");
            } else {
                response.send("FULL");
            }
        } else {
            response.send("INVALID");
        }
    });
});

exports.logoff = functions.https.onRequest(async(request, response) => {
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Methods', 'GET, POST');
    const user = request.query.user;
    const gameid = request.query.gameid;
    let db = admin.database();
    let ref = db.ref(`/gamedata/${gameid}/`);
    ref.once('value').then((snapshot => {
        if (snapshot.exists()) {
            db.ref(`/secrets/${gameid}/p1`).on('value', (snap) => {
                if (snap.val() == user) { // delete room when p1 leaves
                    db.ref(`/gamedata/${gameid}/`).remove()
                        .then((e) => {
                            db.ref(`/games/${gameid}/`).remove()
                                .then((ev) => {
                                    db.ref(`/secrets/${gameid}`).remove()
                                        .then((eve) => {
                                            return; //response.send("Deleted everything.");
                                        })
                                        .catch((eve) => {
                                            return; //response.send("Failed to delete from secrets.")
                                        });
                                })
                                .catch((ev) => {
                                    return; //response.send("Failed to delete from games");
                                })
                        })
                        .catch((e) => {
                            return response.send("Failed to delete from gamedata");
                        })
                } else {
                    return response.send("Insufficient permissions to delete room.")
                }
            })
        } else {
            return response.send("INVALID");
        }
    }))
});

exports.hiddenWord = functions.https.onRequest(async(request, response) => {
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Methods', 'GET, POST');
    const user = request.query.user;
    const gameid = request.query.gameid;
    const word = request.query.word;
    let db = admin.database();
})