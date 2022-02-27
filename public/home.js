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

    let db = firebase.database();
    let newGameID;
    document.getElementById("create").addEventListener("click", e => {

        if (!created) {
            created = true;
            newGameID = genUUID();
            let data = {
                id: newGameID
            }
            db.ref('/games/' + newGameID).set(data);
            console.log(newGameID);
        }

        let server = "http://localhost:5000/"; // https://trick-le.web.app/
        document.getElementById("copylink").innerHTML = `${server}play.html?gameid=${newGameID}`;
        document.getElementById("cont-over").hidden = false;
        return;
    });

    document.getElementById("close").onclick = function() {
        document.getElementById("cont-over").hidden = true;
    }
    document.getElementById("copylink").onclick = function() {

    }

    function genUUID() {
        return '' + Math.random().toString(36).substring(2, 12);
    };

});