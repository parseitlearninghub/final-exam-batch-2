const parser_uid = localStorage.getItem("user-parser");
const isPortrait = window.innerHeight > window.innerWidth;
const isWideScreen = window.innerWidth > 1024; // You can adjust this width as needed
if (parser_uid == null) {
    if (isPortrait) {
        window.location.href = "login.html";
    } else if (isWideScreen) {
        window.location.href = "desktop/login.html";
    }
} else {
    if (isPortrait) {
        window.location.href = "homepage.html";
    } else if (isWideScreen) {
        window.location.href = "desktop/homepage.html";
    }

}
