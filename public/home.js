let playMode = "DEPLOY";
let created = false;
document.addEventListener("DOMContentLoaded", () => {

    const firebaseConfig = {
        apiKey: "AIzaSyBGQa_ydjMu_RwnyXXvg3hcHJBFtv-HxFg",
        authDomain: "trick-le.firebaseapp.com",
        databaseURL: "https://trick-le-default-rtdb.firebaseio.com",
        projectId: "trick-le",
        storageBucket: "trick-le.appspot.com",
        messagingSenderId: "13846787083",
        appId: "1:13846787083:web:2890d8e75b0e15b887030e",
        measurementId: "G-6BFTZX44QE"
    };
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    let uid = localStorage.getItem("uid");
    if (uid == null || uid == "") {
        uid = genUUID(20);
        localStorage.setItem("uid", uid);
    }
    let db = firebase.database();
    let newGameID;
    document.getElementById("create").addEventListener("click", e => {

        if (!created) {
            created = true;
            newGameID = genUUID(10);
            let data = {
                id: newGameID
            }
            db.ref('/games/' + newGameID).set(data);
            console.log(newGameID);
        }

        let server = (playMode == "DEPLOY") ? "https://trick-le.web.app/" : "http://localhost:5000/"; // https://trick-le.web.app/
        document.getElementById("copylink").innerHTML = `${server}play.html?gameid=${newGameID}`;
        document.getElementById("cont-over").hidden = false;
        return;
    });

    document.getElementById("close").onclick = function() {
        document.getElementById("cont-over").hidden = true;
    }
    document.getElementById("copylink").onclick = function() {

    }

    function genUUID(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }

    console.log(makeid(5));

});