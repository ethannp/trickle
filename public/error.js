let queryS = window.location.search;
const urlParam = new URLSearchParams(queryS);
let errorcode = urlParam.get("e");
if (errorcode == "overflow") {
    err = "This lobby is already full!";
} else if (errorcode == "invalidid") {
    err = "This game code is invalid!"
} else {
    window.location.replace("index.html");
}

document.getElementById("errorinfo").textContent = err;