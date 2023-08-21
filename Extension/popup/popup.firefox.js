document.body.classList.remove("preload");
const openModalButtons = document.querySelectorAll("[data-modal-target]");
const closeModalButtons = document.querySelectorAll("[data-close-button]");
const confirmModalButtons = document.querySelectorAll("[data-confirm-button]");
const overlay = document.querySelector("#overlay");
const account_body = document.querySelector("#accountlist");
const account_rightclick = document.querySelector("#accrightclick");
const group_rightclick = document.querySelector("#grouprightclick");
const groupinput = document.querySelector(".groupinput");
const group_body = document.querySelector("#group_body");
const account_template = document.querySelector("[account-template]").content;
const group_template = document.querySelector("[group-template]").content;
const accountinput = document.querySelectorAll(".accountinput");
const quickaccess = document.querySelectorAll("[href]");
const hidebtns = document.querySelectorAll(".button-hide");
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
	modal.classList.add("active");
	overlay.classList.add("active");
	try {
		modal.querySelector("input").focus();
	} catch (err) {
		/* empty */
	}
}

function closeModal(modal) {
	if (modal == null) return;
	modal.classList.remove("active");
	overlay.classList.remove("active");
}

function save() {
	browser.storage.local.set({ Group: groups, Selected: selectedgroup });
}

function mouseX(evt) {
	if (evt.pageX) {
		return evt.pageX;
	} else if (evt.clientX) {
		return (
			evt.clientX +
			(document.documentElement.scrollLeft
				? document.documentElement.scrollLeft
				: document.body.scrollLeft)
		);
	} else {
		return null;
	}
}

function mouseY(evt) {
	if (evt.pageY) {
		return evt.pageY;
	} else if (evt.clientY) {
		return (
			evt.clientY +
			(document.documentElement.scrollTop
				? document.documentElement.scrollTop
				: document.body.scrollTop)
		);
	} else {
		return null;
	}
}

function messageContent(token, accountindex) {
	browser.tabs.query(
		{ active: true, currentWindow: true, url: ["*://discord.com/*"] },
		function (tabs) {
			if (tabs[0] == null) return showAlert("Login Error", 800);
			browser.tabs.sendMessage(tabs[0].id, { message: "login", token: token });
			let currentgroup = groups.find((group) => selectedgroup == group.name);
			currentgroup.accounts[accountindex].lastlogin = Date.now();
			save();
		},
	);
}

function createGroup(groupname) {
	return { name: groupname, accounts: [] };
}

function createAccount(name, image, token) {
	return { name: name, image: image, token: token, lastlogin: null };
}

function updateAccount(base, name, image, token) {
	return (base.name = name), (base.image = image), (base.token = token);
}

function renderGroup() {
	groups.forEach((group) => {
		const group_clone = group_template.cloneNode(true);
		group_clone.querySelector("span").innerText = group.name.substring(0, 1);
		group_clone.querySelector(".server").dataset.group = group.name;
		group_clone.querySelector("[group-name]").innerHTML =
			group.name + " - " + group.accounts.length;
		if (group.name == selectedgroup) {
			group_clone.querySelector("div").classList.add("active");
		}
		group_body.appendChild(group_clone);
	});
}

function render() {
	clear(group_body);
	renderGroup();
	if (selectedgroup != null) {
		clear(account_body);
		renderAccount(
			groups.find((group) => group.name == selectedgroup),
			"",
		);
	}
	renderTime();
}

function renderAccount(selectedgroup) {
	selectedgroup.accounts.forEach((account, index) => {
		const account_clone = account_template.cloneNode(true);
		let username = account_clone.querySelector("span.header");
		let time = account_clone.querySelector("[time-span]");
		let icon = account_clone.querySelector("svg");
		let img = account_clone.querySelector("img");
		if (account.image != undefined && account.image != "") {
			img.src = account.image;
			img.className = "holderlogo";
			img.style.display = "block";
			icon.remove();
		}
		account_clone.querySelector(".accountholder").dataset.accountindex = index;
		username.innerText = account.name;
		time.innerText = "---";
		account_body.appendChild(account_clone);
	});
}

function calculateTime(accountTime) {
	let currentTime = Date.now();
	let delta = Math.round((currentTime - accountTime) / 1000);
	let minute = 60,
		hour = minute * 60,
		day = hour * 24,
		month = day * 30,
		year = month * 12;
	if (delta < 1) {
		return "Just now.";
	} else if (delta < minute) {
		return `${delta} seconds ago.`;
	} else if (delta < 2 * minute) {
		return "1 minute ago.";
	} else if (delta < hour) {
		return `${Math.floor(delta / minute)} minutes ago.`;
	} else if (delta < 2 * hour) {
		return "1 hour ago.";
	} else if (delta < day) {
		return `${Math.floor(delta / hour)} hours ago.`;
	} else if (delta < 2 * day) {
		return "Yesterday.";
	} else if (delta < month) {
		return `${Math.floor(delta / day)} days ago.`;
	} else if (delta < 2 * month) {
		return "1 month ago.";
	} else if (delta < year) {
		return `${Math.floor(delta / month)} months ago.`;
	} else if (delta < 2 * year) {
		return "1 year ago.";
	} else {
		return `${Math.floor(delta / year)} years ago.`;
	}
}

function renderTime() {
	let timeholder = document.querySelectorAll("[time-span]");
	let currentgroup = groups.find((group) => selectedgroup == group.name);
	timeholder.forEach((time, index) => {
		if (
			currentgroup.accounts[index].lastlogin != null &&
			time.innerText != calculateTime(currentgroup.accounts[index].lastlogin)
		) {
			time.innerText = calculateTime(currentgroup.accounts[index].lastlogin);
		}
	});
}

function exportGroup(object, filename) {
	let blob = new Blob([JSON.stringify(object)], {
		type: "text/json;charset=utf-8",
	});
	browser.downloads.download({
		url: URL.createObjectURL(blob),
		filename: `${filename}.txt`,
	});
}

function showAlert(e, t) {
	let o = setInterval(() => {
		if (!notifDisplayed) {
			notifDisplayed = !0;
			let n = document.getElementById("notification");
			(n.innerHTML = e),
				(n.style.display = "block"),
				(n.style.animationName = "notifin"),
				setTimeout(function () {
					n.style.animationName = "notifout";
				}, t + 400),
				setTimeout(function () {
					(n.style.display = "none"), (notifDisplayed = !1);
				}, t + 800),
				clearInterval(o);
		}
	}, 50);
}

browser.storage.local.get(null, function (a) {
	groups = a.Group;
	selectedgroup = a.Selected;
	render();
	setInterval(() => {
		renderTime();
	}, 1e3);
});

quickaccess.forEach((quick) => {
	quick.addEventListener("click", () => {
		browser.tabs.create({ url: quick.attributes.href.value });
	});
});

openModalButtons.forEach((button) => {
	button.addEventListener("click", () => {
		const modal = document.querySelector(button.dataset.modalTarget);
		openModal(modal);
	});
});

closeModalButtons.forEach((button) => {
	button.addEventListener("click", () => {
		const modal = button.closest(".modal");
		modal.querySelectorAll("input").forEach((input) => {
			input.value = null;
		});
		closeModal(modal);
	});
});

hidebtns.forEach((button) => {
	button.addEventListener("click", () => {
		const inputs = document.querySelectorAll(".hideable");
		inputs.forEach((input) => {
			input.type = input.type == "password" ? "text" : "password";
		});
	});
});

confirmModalButtons[0].addEventListener("click", () => {
	if (groups.find((group) => group.name === groupinput.value))
		return showAlert("Group Already Exist", 800);
	else if (groupinput.value === "") return showAlert("Enter Group Name", 800);
	groups.push(createGroup(groupinput.value));
	groupinput.value = null;
	save();
	render();
});

confirmModalButtons[1].addEventListener("click", () => {
	let name = accountinput[0];
	let image = accountinput[1];
	let token = accountinput[2];
	if (name.value == "" || token.value == "")
		return showAlert("Please Fill The Required Areas", 800);
	const currentgroup = groups.find((group) => group.name == selectedgroup);
	currentgroup.accounts.push(
		createAccount(name.value, image.value, token.value),
	);
	(name.value = null), (image.value = null), (token.value = null);
	showAlert("Account Added", 800);
	save();
	render();
});

confirmModalButtons[2].addEventListener("click", () => {
	let name = accountinput[3];
	let image = accountinput[4];
	let token = accountinput[5];
	if (name.value == "" || token.value == "")
		return showAlert("Please Fill The Required Areas", 800);
	const currentgroup = groups.find((group) => group.name == selectedgroup);
	const currentindex =
		document.querySelector("#updatemodal").dataset.updateindex;
	updateAccount(
		currentgroup.accounts[currentindex],
		name.value,
		image.value,
		token.value,
	);
	save();
	render();
	closeModal(document.querySelector("#updatemodal"));
});

account_rightclick.addEventListener("click", (a) => {
	const action = a.target.dataset.action;
	const accountindex = a.target.closest(".rightclickmenu").dataset.accountindex;
	const currentgroup = groups.filter((group) => selectedgroup == group.name)[0];
	const editmodal = document.querySelector("#updatemodal");
	switch (action) {
		case "update":
			editmodal.dataset.updateindex = accountindex;
			accountinput[3].value = currentgroup.accounts[accountindex].name;
			accountinput[4].value = currentgroup.accounts[accountindex].image;
			accountinput[5].value = currentgroup.accounts[accountindex].token;
			openModal(editmodal);
			break;
		case "delete":
			currentgroup.accounts = currentgroup.accounts.filter(
				(account, index) => index !== parseInt(accountindex),
			);
			save();
			render();
			break;
	}
});

group_rightclick.addEventListener("click", (a) => {
	const action = a.target.dataset.action;
	const groupname = a.target.closest(".rightclickmenu").dataset.group;
	const currentgroup = groups.filter((group) => groupname == group.name)[0];
	switch (action) {
		case "import":
			currentgroup.accounts = JSON.parse(
				prompt("Enter the exported file code."),
			);
			save();
			render();
			showAlert("Group Imported", 800);
			break;
		case "export":
			exportGroup(currentgroup.accounts, currentgroup.name);
			showAlert("Group Exported", 800);
			break;
		case "delete":
			if (currentgroup.name == selectedgroup)
				return showAlert("You can't delete active group.", 800);
			groups = groups.filter((group) => group.name != currentgroup.name);
			save();
			render();
			break;
	}
});

document.body.addEventListener("click", () => {
	account_rightclick.style.display = "none";
	group_rightclick.style.display = "none";
});

account_body.addEventListener("click", (a) => {
	if (a.target.classList.contains("accountholder")) {
		const accountindex = a.target.dataset.accountindex;
		const currentgroup = groups.find((group) => selectedgroup == group.name);
		messageContent(currentgroup.accounts[accountindex].token, accountindex);
	}
});

account_body.addEventListener("contextmenu", (a) => {
	a.preventDefault();
	if (a.target.classList.contains("accountholder")) {
		let accountindex = a.target.dataset.accountindex;
		account_rightclick.dataset.accountindex = accountindex;
		account_rightclick.style.display = "block";
		account_rightclick.style.top = mouseY(a) + "px";
		account_rightclick.style.left = mouseX(a) + "px";
	}
});

group_body.addEventListener("contextmenu", (a) => {
	a.preventDefault();
	if (a.target.classList.contains("server")) {
		let groupname = a.target.dataset.group;
		group_rightclick.dataset.group = groupname;
		group_rightclick.style.display = "block";
		group_rightclick.style.top = mouseY(a) + "px";
		group_rightclick.style.left = mouseX(a) + "px";
	}
});

group_body.addEventListener("click", (a) => {
	let currentgroup = a.target.dataset.group;
	if (currentgroup !== undefined) {
		selectedgroup = a.target.dataset.group;
		save();
		render();
	}
});
