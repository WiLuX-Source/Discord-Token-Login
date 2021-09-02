document.body.classList.remove('preload');
const openModalButtons = document.querySelectorAll('[data-modal-target]');
const closeModalButtons = document.querySelectorAll('[data-close-button]');
const confirmModalButtons = document.querySelectorAll('[data-confirm-button]');
const overlay = document.getElementById('overlay');
const account_body = document.getElementById('accountlist');
const group_body = document.getElementById('groupmodal');
const account_template = document.querySelector('[account-template]').content;
const group_template = document.querySelector('[group-template]').content;
const accountinput = document.querySelectorAll('.accountinput');
const quickaccess = document.querySelectorAll('.quickaccess');
const footerinput = document.querySelector('.footerinput');
const reader = new FileReader();
const fileinput = document.querySelector('input[type=file]');
let notifDisplayed = !1;
let groups;
let selectedgroup;

function clear(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function openModal(modal) {
    if (modal == null) return;
    modal.classList.add('active');
    modal.querySelector('input').focus()
    overlay.classList.add('active');
}

function closeModal(modal) {
    if (modal == null) return;
    modal.classList.remove('active');
    overlay.classList.remove('active');
}

function save() {
    chrome.storage.local.set({Group: groups, Selected: selectedgroup});
}

function messageContent(token,accountindex) {
    chrome.tabs.query({ active: true, currentWindow: true, url:['*://discord.com/*'] }, function(tabs) {
         if (tabs[0] == null) return showAlert('Login Error', 800)
         chrome.tabs.sendMessage(tabs[0].id, {message:'login', token: token });
         let currentgroup = groups.find((group) => selectedgroup == group.name);
		 currentgroup.accounts[accountindex].lastlogin = Date.now()
         save();
    });
}

function createGroup(groupname) {
    return { name: groupname, accounts: [] };
}

function createAccount(name,token) {
    return { name: name, token: token, lastlogin:null };
}

function updateAccount(base,name,token) {
    return (base.name = name, base.token = token)
}

function renderGroup() {
    groups.forEach((group) => {
        const group_clone = group_template.cloneNode(true);
        group_clone.querySelector('span').innerText = group.name;
        group_clone.querySelector('[total-account]').innerText = `${group.accounts.length} ${group.accounts.length > 1 ? 'Accounts' : 'Account'}`;
        if (group.name == selectedgroup) {
            group_clone.querySelector('div').classList.add('active');
            group_clone.querySelector('.holder-controls[delete]').classList.add('disable');
        }
        group_body.appendChild(group_clone);
    });
}

function render() {
    clear(group_body);
    renderGroup();
    if (selectedgroup != null) {
        clear(account_body);
        renderAccount(groups.find((group) => group.name == selectedgroup));
    }
    document.querySelectorAll('h4')[1].innerText = `GROUP LIST — ${groups.length}`
    renderTime()
}

function renderAccount(selectedgroup) {
    selectedgroup.accounts.forEach((account, index) => {
        const account_clone = account_template.cloneNode(true);
        let username = account_clone.querySelector('span.Header');
        let time = account_clone.querySelector('[time-span]');
        account_clone.querySelector('.accountholder').dataset.accountindex = index;
        username.innerText = account.name;
        time.innerText = `---`
        account_body.appendChild(account_clone);
    });
}

function calculateTime(accountTime) {
    let currentTime = Date.now()
    let delta = Math.round((currentTime - accountTime) / 1000);
    let minute = 60, hour = minute * 60, day = hour * 24, month = day * 30, year = month * 12;
    if (delta < 1) {
        return `Just now.`;
    } else if (delta < minute) {
        return `${delta} seconds ago.`;
    } else if (delta < 2 * minute) {
        return `1 minute ago.`;
    } else if (delta < hour) {
        return `${Math.floor(delta / minute)} minutes ago.`;
    } else if (delta < 2 * hour) {
        return `1 hour ago.`;
    } else if (delta < day) {
        return `${Math.floor(delta / hour)} hours ago.`;
    } else if (delta < 2 * day) {
        return `Yesterday.`;
    } else if (delta < month) {
        return `${Math.floor(delta / day)} days ago.`;
    } else if (delta < 2 * month) {
        return `1 month ago.`;
    } else if (delta < year) {
        return `${Math.floor(delta / month)} months ago.`;
    } else if (delta < 2 * year) {
        return `1 year ago.`;
    } else {
        return `${Math.floor(delta / year)} years ago.`;
    }
}

function renderTime() {
    let timeholder = document.querySelectorAll('[time-span]');
    let currentgroup = groups.find((group) => selectedgroup == group.name);
    timeholder.forEach((time,index) => {
        if (currentgroup.accounts[index].lastlogin != null && time.innerText != calculateTime(currentgroup.accounts[index].lastlogin)) {
            time.innerText = calculateTime(currentgroup.accounts[index].lastlogin);
        }
    })
}

function exportGroup(object,filename) {
    chrome.downloads.download({ url: `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(object))}`, filename: `${filename}.txt` });
}

function showAlert(e, t) {
    let o = setInterval((()=>{
        if (!notifDisplayed) {
            notifDisplayed = !0;
            let n = document.getElementById('notification');
            n.innerHTML = e, n.style.display = "block", n.style.animationName = "notifin",
            setTimeout((function() { n.style.animationName = "notifout" }), t + 400),
            setTimeout((function() { n.style.display = "none", notifDisplayed = !1}), t + 800),
            clearInterval(o)
        }
    }), 50)
}

chrome.storage.local.get(null, function(a) {
    groups = a.Group; 
    selectedgroup = a.Selected
    render();
    setInterval(() => {renderTime()}, 1e3);
});

quickaccess.forEach((quick) => {
	quick.addEventListener('click', () => {
		chrome.tabs.create({ url: quick.attributes.href.value });
	});
});

openModalButtons.forEach((button) => {
	button.addEventListener('click', () => {
		const modal = document.querySelector(button.dataset.modalTarget);
		openModal(modal);
	});
});

closeModalButtons.forEach((button) => {
	button.addEventListener('click', () => {
		const modal = button.closest('.modal');
		modal.querySelectorAll('input').forEach((input) => {
			input.value = null
		})
		closeModal(modal);
	});
});

confirmModalButtons[0].addEventListener('click', () => {
	if (groups.find((group) => group.name === footerinput.value)) return showAlert('Group Already Exist',800);
	else if (footerinput.value === '') return showAlert('Enter Group Name',800)
	groups.push(createGroup(footerinput.value));
	footerinput.value = null;
	save();
	render();
});

confirmModalButtons[1].addEventListener('click', () => {
	let name = accountinput[0];
	let token = accountinput[1];
	if (name.value == '' || token.value == '') return showAlert('Please Fill The Required Areas',800);
	const currentgroup = groups.find((group) => group.name == selectedgroup);
	currentgroup.accounts.push(createAccount(name.value,token.value));
	name.value = null, token.value = null;
	showAlert('Account Added',800)
	save();
	render();
});

confirmModalButtons[2].addEventListener('click', () => {
	let name = accountinput[2];
	let token = accountinput[3];
	if (name.value == '' || token.value == '') return showAlert('Please Fill The Required Areas',800);
	const currentgroup = groups.find((group) => group.name == selectedgroup);
	const currentindex = document.querySelector('#updatemodal').dataset.updateindex;
	updateAccount(currentgroup.accounts[currentindex],name.value,token.value);
	save();
	render();
	closeModal(document.querySelector('#updatemodal'));
});

group_body.addEventListener('click', (a) => {
	if (a.target.classList.contains('groupholder')) {
		selectedgroup = a.target.querySelector('span').innerText;
		save();
		render();
	} else if (a.target.hasAttribute('delete')) {
		groups = groups.filter((group) => group.name != a.target.closest('.groupholder').querySelector('span').innerText);
		save();
		render();
	} else if (a.target.hasAttribute('import')) {
		a.currentgroup = groups.find((group) => a.target.closest('.groupholder').querySelector('span').innerText == group.name);
		fileinput.click();
		fileinput.onchange = () => {reader.readAsText(fileinput.files[0])};
		reader.onloadend = () => {a.currentgroup.accounts = JSON.parse(reader.result);save();render();showAlert('Group Imported',800)};
	} else if (a.target.hasAttribute('export')) {
		a.currentgroup = groups.find((group) => a.target.closest('.groupholder').querySelector('span').innerText == group.name);
		exportGroup(a.currentgroup.accounts,a.currentgroup.name);
		showAlert('Group Exported',800);
	}
});

account_body.addEventListener('click', (a) => {
	if (a.target.classList.contains('holderlogo')) {
		a.selectedaccount = a.target.closest('.accountholder').dataset.accountindex;
		a.currentgroup = groups.find((group) => selectedgroup == group.name);
		messageContent(a.currentgroup.accounts[a.selectedaccount].token,a.selectedaccount);
	} else if (a.target.hasAttribute('token')) {
		a.selectedaccount = a.target.closest('.accountholder').dataset.accountindex;
		a.currentgroup = groups.find((group) => selectedgroup == group.name);
		navigator.clipboard.writeText(a.currentgroup.accounts[a.selectedaccount].token)
		showAlert('Account Token Copied',400)
	} else if (a.target.hasAttribute('configure')) {
		let editindex = document.querySelector('#updatemodal');
		a.selectedaccount = a.target.closest('.accountholder').dataset.accountindex;
		a.currentgroup = groups.find((group) => selectedgroup == group.name);
		editindex.dataset.updateindex = a.selectedaccount;
		accountinput[2].value = a.currentgroup.accounts[a.selectedaccount].name;
		accountinput[3].value = a.currentgroup.accounts[a.selectedaccount].token;
		openModal(editindex);
	} else if (a.target.hasAttribute('delete')) {
		a.selectedaccount = a.target.closest('.accountholder').dataset.accountindex;
		a.currentgroup = groups.find((group) => selectedgroup == group.name);
		a.currentgroup.accounts = a.currentgroup.accounts.filter((account, index) => index !== parseInt(a.selectedaccount));
		save();
		render();
	}
});

footerinput.addEventListener('keydown', (a) => {
	if (a.keyCode === 32) a.returnValue = false;
});

footerinput.addEventListener('keyup', (a) => {
	if (a.keyCode === 32) showAlert("You Can't Use Space Character",400);
	if (a.keyCode === 13) confirmModalButtons[0].click();
});

accountinput[1].addEventListener('keyup', (a) => {
	if (a.keyCode === 13) confirmModalButtons[1].click();
});

accountinput[3].addEventListener('keyup', (a) => {
	if (a.keyCode === 13) confirmModalButtons[2].click();
});
