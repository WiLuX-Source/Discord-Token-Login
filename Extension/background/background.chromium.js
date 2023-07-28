let switcher = !1;

function toggleJS(call) {
	chrome.contentSettings["javascript"].get(
		{ primaryUrl: "https://discord.com/" },
		function () {
			chrome.contentSettings["javascript"].set({
				primaryPattern: "*://discord.com/*",
				setting: call,
			});
		},
	);
}
function create() {
	chrome.contextMenus.removeAll(function () {
		if (!switcher) {
			chrome.contextMenus.create({
				id: "js",
				title: "Disable Javascript",
				type: "normal",
				contexts: ["all"],
				documentUrlPatterns: ["*://discord.com/*"],
			});
		} else {
			chrome.contextMenus.create({
				id: "token",
				title: "Get Account Token",
				type: "normal",
				contexts: ["all"],
				documentUrlPatterns: ["*://discord.com/*"],
			});
		}
	});
}

chrome.contextMenus.onClicked.addListener(function (info, tab) {
	if (info.menuItemId === "js") {
		toggleJS("block");
		chrome.tabs.sendMessage(tab.id, { message: "disablejs" });
		switcher = true;
		create();
	} else if (info.menuItemId === "token") {
		chrome.tabs.sendMessage(tab.id, { message: "gettoken" });
		switcher = false;
		toggleJS("allow");
		create();
	}
});
chrome.runtime.onInstalled.addListener(function () {
	chrome.storage.local.get(null, function (a) {
		if (a.Group == null)
			chrome.storage.local.set({
				Group: [{ name: "Default", accounts: [] }],
				Selected: "Default",
			});
	});
});
create();
