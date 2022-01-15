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
// @version     1.4.1
// @author      WiLuX & Wonfy
// ==/UserScript==
/* Styling */
const style = document.createElement("style")
let css = `
.accountbody {
  width: 480px;
  padding: 32px;
  font-size: 18px;
  box-shadow: 0 2px 10px 0 rgb(0 0 0 / 20%);
  border-radius: 5px;
  box-sizing: border-box;
  margin-left: 40px;
  justify-content: center;
  height: 408px;
  color: #72767d;
  background: var(--background-mobile-primary);
}
.title {
  font-weight: 600;
  color: var(--header-primary);
  margin-bottom: 8px;
  font-size: 24px;
  line-height: 30px;
  justify-content: center;
  display: flex;
}
.helptext {
  color: var(--header-secondary);
  display: flex;
  justify-content: center;
}
#accountlist::-webkit-scrollbar {
  display:none;
}
#accountlist {
    overflow-y: scroll;
    display: grid;
    height: 200px;
    justify-items: center;
    row-gap: 8px;
    grid-template-rows: 44px 44px 44px 44px;
    margin-top: 16px;
    border: 1px solid rgb(255 255 255 / 10%);
    padding: 12px 0 0 0;
}
.accountbutton {
  color: #fff;
  background-color: var(--brand-experiment);
  width: 170px;
  position: relative;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  box-sizing: border-box;
  border: none;
  border-radius: 3px;
  font-weight: 500;
  padding: 2px 16px;
  font-size: 16px;
  line-height: 24px;
  height: 44px;
  min-width: 130px;
  min-height: 44px;
  transition: background-color .17s ease,color .17s ease;
}
.accountbutton:hover {
  background-color: var(--brand-experiment-560);
}
.accountbutton:active {
  background-color: var(--brand-experiment-600);
}
.controls {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90px;
  column-gap: 8px;
}
`
style.appendChild(document.createTextNode(css))
document.getElementsByTagName("head")[0].append(style)
/* Element Creation */
function ElementCreation() {
const workspace = document.querySelector("#app-mount > div > div > div")
const accountbody = document.createElement("div")
const accounttextholder = document.createElement("div")
const helpfultext = document.createElement("div")
const h3 = document.createElement("h3")
const accountlist = document.createElement("div")
const addbtn = document.createElement("button")
const delbtn = document.createElement("button")
const controls = document.createElement("div")
let accounts = GM_listValues()
accountbody.className = "accountbody"
helpfultext.className = "helptext"
helpfultext.innerText = "You can scroll the list"
h3.className = "title"
h3.innerText = "ACCOUNT LIST"
accountlist.id = "accountlist"
accountbody.appendChild(accounttextholder)
accounttextholder.appendChild(h3)
accounttextholder.appendChild(helpfultext)
accountbody.appendChild(accountlist)
controls.className = "controls"
addbtn.className = "accountbutton";
addbtn.innerText = "Add Account"
addbtn.addEventListener("click",() => {
  let name = prompt("Account Name")
  let token = prompt("Account Token")
  GM_setValue(name,token)
  accounts = GM_listValues()
  renderaccounts()
})
delbtn.className = "accountbutton";
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
    accountbutton.className = "accountbutton";
    accountbutton.innerText = name;
    accountbutton.addEventListener("click", () => {
        login(GM_getValue(name))
    });
    accountlist.append(accountbutton);
}}
renderaccounts()
accountbody.appendChild(controls)
controls.appendChild(addbtn)
controls.appendChild(delbtn)
workspace.appendChild(accountbody)
}
setTimeout(() => { ElementCreation() }, 1000);
