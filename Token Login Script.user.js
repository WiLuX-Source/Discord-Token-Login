// ==UserScript==
// @name        Token Login Script
// @match       https://discord.com/login
// @include     https://discord.com/login?*
// @description  Allows You To Login Your Account Without Inputting Your E-mail And Password.
// @grant       none
// @run-at      document-end
// @version     1.3
// @author      WiLuX & Wonfy
// ==/UserScript==
/* Styling */
var style = document.createElement("style");
let css = ".accountbody {margin-left: 40px;display: grid;grid-template-rows: 26px 1fr;grid-gap: 37px;justify-content: center;height: 323px;}";
css += ".helptext {margin-left: 10px;}";
css += "#accountlist::-webkit-scrollbar {display:none;}";
css += "#accountlist {overflow-y: scroll;display: grid;grid-gap: 5px;height: 170px;}";
css += ".accountbutton {width: 170px!important;}";
if (style.styleSheet) {
    style.styleSheet.cssText = css;
} else {
    style.appendChild(document.createTextNode(css));
}
document.getElementsByTagName("head")[0].append(style);
/* Element Creation */
window.addEventListener('load', () => {
const workspace = document.querySelector(".wrapper-6URcxg")
const accountbody = document.createElement("div")
const accounttextholder = document.createElement("div")
const helpfultext = document.createElement("div")
const h3 = document.createElement("h3")
const accountlist = document.createElement("div")
accountbody.className = "authBox-hW6HRx theme-dark accountbody"
helpfultext.className = "colorHeaderSecondary-3Sp3Ft size16-1P40sf helptext"
helpfultext.innerText = "You can scroll the list"
h3.className = "title-jXR8lp marginBottom8-AtZOdT base-1x0h_U size24-RIRrxO"
h3.innerText = "ACCOUNT LIST"
accountlist.id = "accountlist"
accountbody.appendChild(accounttextholder)
accounttextholder.appendChild(h3)
accounttextholder.appendChild(helpfultext)
accountbody.appendChild(accountlist)
/* Button Creation */
const accounts = {
    'Token1': "Account #1",
    'Token2': "Account #2",
    'Token3': "Account #3",
    'Token4': "Account #4",
    'Token5': "Account #5",
    'Token6': "Account #6",
    'Token7': "Account #7",
    'Token8': "Account #8",
    'Token9': "Account #9",
    'Token10': "Account #10"
}
/* Actual Code */
function login(token) {
    setInterval(() => {
        document.body.appendChild(document.createElement `iframe`).contentWindow.localStorage.token = `"${token}"`
    }, 50);
    setTimeout(() => {
        location.reload();
    }, 50);
}

for (const [token, name] of Object.entries(accounts)) {
    let accountbutton = document.createElement("button")
    accountbutton.className = "lookFilled-1Gx00P colorBrand-3pXr91 button-3k0cO7 sizeLarge-1vSeWK button-38aScr marginBottom8-AtZOdT accountbutton";
    accountbutton.innerText = name;
    accountbutton.addEventListener("click", () => {
        login(token)
    });
    accountlist.append(accountbutton);
}
workspace.appendChild(accountbody)
})
