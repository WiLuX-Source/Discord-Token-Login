// ==UserScript==
// @name        Discord Token Login
// @match       https://discord.com/login
// @include     https://discord.com/channels/*
// @include     https://discord.com/login?*
// @homepageURL https://github.com/WiLuX-Source/Discord-Token-Login
// @updateURL   https://github.com/WiLuX-Source/Discord-Token-Login/raw/master/Token%20Login%20Script.user.js
// @description Allows You To Login Your Account Without Inputting Your E-mail And Password.
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-end
// @version     1.4.3
// @author      WiLuX & Wonfy
// ==/UserScript==
/*
----How To Use----
- Click top left button to drag menu.
- Click top left button with CTRL(Control) key to close it.
- Refresh to open menu again.
- Click "Add Account" button to add new accounts.
- Click "Delete Account" button to add new accounts.
----How To Use----
/* Styling */
const style = document.createElement('style');
const coord = GM_getValue('coord') ||{ top:'25px',left:'25px' };
let css = `
.accountbody {
  width: 480px;
  padding: 32px;
  font-size: 18px;
  box-shadow: 0 2px 10px 0 rgb(0 0 0 / 20%);
  border-radius: 5px;
  box-sizing: border-box;
  justify-content: center;
  height: 408px;
  color: #72767d;
  background: var(--background-mobile-secondary);
  position: absolute;
  z-index: 9999;
  top:${coord.top};
  left:${coord.left};
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
.versionnumber {
  color: var(--header-secondary);
  position: absolute;
  top: 14px;
  right: 14px;
}
#dragbutton {
    cursor: move;
    fill: var(--header-secondary);
    height: 32px;
    width: 32px;
    position: absolute;
    top: 14px;
    left: 14px;
}
`;
style.appendChild(document.createTextNode(css));
document.getElementsByTagName('head')[0].append(style);
/* Element Creation */
const workspace = document.querySelector('body');
const accountbody = document.createElement('div');
const accounttextholder = document.createElement('div');
const helpfultext = document.createElement('div');
const h3 = document.createElement('h3');
const accountlist = document.createElement('div');
const addbtn = document.createElement('button');
const delbtn = document.createElement('button');
const controls = document.createElement('div');
const versiontext = document.createElement('span');
const dragbutton = document.createElement('div');
let accounts = GM_getValue('accountlist') || [];
accountbody.className = 'accountbody';
helpfultext.className = 'helptext';
helpfultext.innerText = 'You can scroll the list';
h3.className = 'title';
h3.innerText = 'ACCOUNT LIST';
accountlist.id = 'accountlist';
accountbody.appendChild(accounttextholder);
accounttextholder.appendChild(h3);
accounttextholder.appendChild(helpfultext);
accountbody.appendChild(accountlist);
controls.className = 'controls';
dragbutton.id = 'dragbutton';
dragbutton.innerHTML = `
<svg width="32" height="32" viewBox="0 0 16 16" style="pointer-events: none;">
  <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"></path>
</svg>
`;
versiontext.className = 'versionnumber';
versiontext.innerText = 'v1.4.3';
addbtn.className = 'accountbutton';
addbtn.innerText = 'Add Account';
addbtn.addEventListener('click',() => {
  let name = prompt('Account Name');
  let token = prompt('Account Token');
  accounts.push({ name,token });
  GM_setValue('accountlist',accounts);
  renderaccounts();
});
delbtn.className = 'accountbutton';
delbtn.innerText = 'Delete Account';
delbtn.addEventListener('click',() => {
  let name = prompt('Account Name');
  GM_setValue('accountlist', accounts.filter(x => x.name != name));
  accounts = GM_getValue('accountlist');
  renderaccounts();
});
dragbutton.addEventListener('mousedown', (a) => {
  if (a.ctrlKey) accountbody.style.display = 'none';
  accountbody.addEventListener('mousemove', drag);
});
document.addEventListener('mouseup', (a) => {
  accountbody.removeEventListener('mousemove', drag);
  if (!a.ctrlKey) GM_setValue('coord',{ top : accountbody.style.top, left : accountbody.style.left });
});
/* Actual Code */
function login(token) {
    setInterval(() => {
        document.body.appendChild(document.createElement `iframe`).contentWindow.localStorage.token = `"${token}"`;
    }, 50);
    setTimeout(() => {
        location.reload();
    }, 50);
}
function drag({ movementX: e, movementY: r }) {
    let t = window.getComputedStyle(accountbody)
    , a = parseInt(t.left)
    , o = parseInt(t.top);
    accountbody.style.left = `${a + e}px`,
    accountbody.style.top = `${o + r}px`;
}
function renderaccounts() {
accountlist.innerHTML = '';
for (let [length,object] of Object.entries(accounts)) {
    let accountbutton = document.createElement('button');
    accountbutton.className = 'accountbutton';
    accountbutton.innerText = object.name;
    accountbutton.addEventListener('click', () => {
        login(object.token);
    });
    accountlist.append(accountbutton);
}}
renderaccounts();
accountbody.appendChild(dragbutton);
accountbody.appendChild(versiontext);
accountbody.appendChild(controls);
controls.appendChild(addbtn);
controls.appendChild(delbtn);
workspace.appendChild(accountbody);
