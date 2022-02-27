const functions = require("firebase-functions");
const admin = require("firebase-admin");

var serviceAccount = require("../trick-le-f8bd38039302.json") // add path to trick-le-nums.json
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://trick-le-default-rtdb.firebaseio.com"
});

exports.onGameCreate = functions.database.ref("/games/{gameid}")
    .onCreate((snapshot, context) => {
        var gameid = context.params.gameid;
        console.log("Game ID: " + gameid);
        let data = {
            p1: "false",
            p2: "false",
        }
        var db = admin.database();
        let ref = db.ref("/gamedata/" + gameid);
        return ref.set(data);
    });

exports.login = functions.https.onRequest(async(request, response) => {
    response.set('Access-Control-Allow-Origin', '*');
    const user = request.query.user; // either p1 or p2
    const gameid = request.query.gameid;
    var db = admin.database();
    let ref = db.ref(`/gamedata/${gameid}/`)
    ref.once('value').then((snapshot) => {
        let field = snapshot.child(user).val();
        console.log(user);
        if (field == "false") {
            db.ref(`/gamedata/${gameid}/${user}`).set("true");
            response.send("valid");
        } else {
            response.send("taken");
        }
    })

})