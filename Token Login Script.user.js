// ==UserScript==
// @name        Discord Token Login
// @match       https://discord.com/login
// @include     https://discord.com/login?*
// @homepageURL https://github.com/WiLuX-Source/Discord-Token-Login
// @description Allows You To Login Your Account Without Inputting Your E-mail And Password.
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @run-at      document-end
// @version     1.4
// @author      WiLuX & Wonfy
// ==/UserScript==
/* Styling */
const style = document.createElement("style")
let css = ".accountbody {margin-left: 40px;display: grid;grid-template-rows: 26px 1fr;grid-gap: 37px;justify-content: center;height: 323px;}"
css += ".helptext {margin-left: 10px;}"
css += "#accountlist::-webkit-scrollbar {display:none;}"
css += "#accountlist {overflow-y: scroll;display: grid;grid-gap: 5px;height: 170px;}"
css += ".accountbutton {width: 170px!important;}"
style.appendChild(document.createTextNode(css))
document.getElementsByTagName("head")[0].append(style)
/* Element Creation */
function ElementCreation() {
const workspace = document.querySelector(".wrapper-6URcxg")
const accountbody = document.createElement("div")
const accounttextholder = document.createElement("div")
const helpfultext = document.createElement("div")
const h3 = document.createElement("h3")
const accountlist = document.createElement("div")
const addbtn = document.createElement("button")
const delbtn = document.createElement("button")
let accounts = GM_listValues()
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
addbtn.className = "lookFilled-1Gx00P colorBrand-3pXr91 button-3k0cO7 sizeLarge-1vSeWK button-38aScr marginBottom8-AtZOdT accountbutton";
addbtn.style.cssText = "position:relative;top:-33px;right:142px;"
addbtn.innerText = "Add Account"
addbtn.addEventListener("click",() => {
  let name = prompt("Account Name")
  let token = prompt("Account Token")
  GM_setValue(name,token)
  accounts = GM_listValues()
  renderaccounts()
})
delbtn.className = "lookFilled-1Gx00P colorBrand-3pXr91 button-3k0cO7 sizeLarge-1vSeWK button-38aScr marginBottom8-AtZOdT accountbutton";
delbtn.style.cssText = "position:relative;top:-122px;right:-142px;"
delbtn.innerText = "Delete Account"
delbtn.addEventListener("click",() => {
  let name = prompt("Account Name")
  GM_deleteValue(name)
  accounts = GM_listValues()
  renderaccounts()
})
/* Actual Code */
function login(token) {
    setInterval(() => {
        document.body.appendChild(document.createElement `iframe`).contentWindow.localStorage.token = `"${token}"`
    }, 50);
    setTimeout(() => {
        location.reload();
    }, 50);
}
function renderaccounts() {
accountlist.innerHTML = ""
for (let [length,name] of Object.entries(accounts)) {
    let accountbutton = document.createElement("button")
    accountbutton.className = "lookFilled-1Gx00P colorBrand-3pXr91 button-3k0cO7 sizeLarge-1vSeWK button-38aScr marginBottom8-AtZOdT accountbutton";
    accountbutton.innerText = name;
    accountbutton.addEventListener("click", () => {
        login(GM_getValue(name))
    });
    accountlist.append(accountbutton);
}}
renderaccounts()
accountbody.appendChild(addbtn)
accountbody.appendChild(delbtn)
workspace.appendChild(accountbody)
}
setTimeout(() => { ElementCreation() }, 1000);
