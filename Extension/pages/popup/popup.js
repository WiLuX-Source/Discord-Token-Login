document.body.classList.remove("preload");
const openModalButtons = document.querySelectorAll("[data-modal-target]");
const closeModalButtons = document.querySelectorAll("[data-close-button");
const confirmModalButtons = document.querySelectorAll("[data-confirm-button");
const overlay = document.getElementById("overlay");
const account_body = document.getElementById("accountlist");
const group_body = document.getElementById("groupmodal");
const account_template = document.querySelector("[account-template]").content;
const group_template = document.querySelector("[group-template]").content;
const accountinput = document.querySelectorAll(".accountinput");
const account_total = document.querySelector("[total-account]");
const group_total = document.querySelector("[total-group]");
const LOCAL_STORAGE_GROUP_KEY = "groups";
const LOCAL_STORAGE_SELECTED_GROUP_KEY = "groups.selected";
let groups = JSON.parse(localStorage.getItem(LOCAL_STORAGE_GROUP_KEY)) || [];
let selectedgroup = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SELECTED_GROUP_KEY));
let selectedaccount = null;

openModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = document.querySelector(button.dataset.modalTarget);
    openModal(modal);
  });
});

closeModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal");
    closeModal(modal);
  });
});

function openModal(modal) {
  if (modal == null) return;
  modal.classList.add("active");
  overlay.classList.add("active");
}

function closeModal(modal) {
  if (modal == null) return;
  modal.classList.remove("active");
  overlay.classList.remove("active");
}

group_body.addEventListener("click", (a) => {
  if (
    a.target.tagName.toLowerCase() === "svg" &&
    a.target.classList.contains("holderlogo")
  ) {
    selectedgroup = a.target.parentNode.dataset.groupid;
    saveandrender();
  }
  if (
    a.target.tagName.toLowerCase() === "svg" &&
    a.target.classList.contains("holder-controls")
  ) {
    groups = groups.filter(
      (group) => group.id != a.target.closest(".groupholder").dataset.groupid
    );
    saveandrender();
  }
});

account_body.addEventListener("click", (a) => {
  if (
    a.target.tagName.toLowerCase() === "svg" &&
    a.target.classList.contains("holderlogo")
  ) {
    selectedaccount = a.target.parentNode.dataset.accountid;
    selectedaccounttoken = groups.find((group) => selectedgroup == group.id).accounts.find((account) => selectedaccount == account.id).token
    messagecontent(selectedaccounttoken)
  }
  if (
    a.target.tagName.toLowerCase() === "svg" &&
    a.target.classList.contains("delete")
  ) {
    let b = groups.find((group) => selectedgroup == group.id);
    let c = b.accounts.find(
      (account) =>
        a.target.closest(".accountholder").dataset.accountid == account.id
    );
    b.accounts = b.accounts.filter((account) => account.id != c.id);
    saveandrender();
  }
});

confirmModalButtons[0].addEventListener("click", () => {
  const input = document.querySelector(".footerinput");
  if (input.value == null || input.value === "") return;
  const group = createGroup(input.value);
  groups.push(group);
  input.value = null;
  saveandrender();
});

confirmModalButtons[1].addEventListener("click", () => {
  let name = accountinput[0];
  let note = accountinput[1];
  let token = accountinput[2];
  if (
    name.value == null ||
    (name.value === "" && token.value == null) ||
    token.value === ""
  )
    return;
  const account = createAccount(name.value, note.value, token.value);
  const selectedgroupid = groups.find((group) => group.id == selectedgroup);
  selectedgroupid.accounts.push(account);
  (name.value = null), (note.value = null), (token.value = null);
  saveandrender();
});
function firsttime() {
  if(selectedgroup == null) {
    defaultgroup = {id: Date.now().toString(), name: "Main", accounts: []};
    groups.push(defaultgroup)
    selectedgroup = groups[0].id
    save()
  }
}
function messagecontent(token) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0].url.startsWith('https://discord.com')) {
         chrome.tabs.sendMessage(tabs[0].id, {token: token});
    }});
}

function createGroup(groupname) {
  return { id: Date.now().toString(), name: groupname, accounts: [] };
}

function createAccount(accname, accnote, acctoken) {
  return {
    id: Date.now().toString(),
    name: accname,
    note: accnote,
    token: acctoken,
  };
}

function saveandrender() {
  save();
  uirender();
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_GROUP_KEY, JSON.stringify(groups));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_GROUP_KEY, selectedgroup);
}

function uirender() {
  clearui(group_body);
  grouprender();
  const selectedgroupid = groups.find((group) => group.id == selectedgroup);
  if (selectedgroup == null) {
    clearui(account_body);
  } else {
    clearui(account_body);
    renderAccount(selectedgroupid);
  }
}

function renderAccount(selectedgroupid) {
  selectedgroupid.accounts.forEach((account) => {
    const account_clone = account_template.cloneNode(true);
    let userid = account_clone.querySelector("div");
    let username = account_clone.querySelector("span.Header");
    let usernote = account_clone.querySelectorAll("span")[1];
    userid.dataset.accountid = account.id;
    username.innerText = account.name;
    usernote.innerText = account.note;
    account_body.appendChild(account_clone);
  });
  const totalaccount = selectedgroupid.accounts.length.toString();
  account_total.innerText = totalaccount;
}

function grouprender() {
  groups.forEach((group) => {
    const group_clone = group_template.cloneNode(true);
    group_clone.querySelector("div").dataset.groupid = group.id;
    group_clone.querySelector("span").innerText = group.name;
    if (group.id == selectedgroup) {
      group_clone.querySelector("div").classList.add("active");
      group_clone.querySelector(".holder-controls").classList.add("disable");
    }
    group_body.appendChild(group_clone);
  });
  group_total.innerText = groups.length;
  const check = document.querySelector(".groupholder.active span");
  if (check != null) {
    document.querySelector("button").innerText = check.innerText;
  }
}

function clearui(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
firsttime();
uirender();