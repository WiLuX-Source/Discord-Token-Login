let switcher = !1
let webrequest = {
    header: (d) => {
        const responseHeaders = d.responseHeaders;
        responseHeaders.push({ name: "Content-Security-Policy", value: "script-src 'none'" });
        return { responseHeaders };
    },
    enable: () =>
        chrome.webRequest.onHeadersReceived.addListener(
            webrequest.header,
            { urls: ["*://*/*"], types: ["main_frame", "sub_frame"] },
            ["blocking", "responseHeaders"]
        ),
    disable: () => chrome.webRequest.onHeadersReceived.removeListener(webrequest.header),
};
function create() {
	chrome.contextMenus.removeAll(function() {
		if (!switcher) {
			chrome.contextMenus.create({id: 'js', title: 'Disable Javascript', type: 'normal', contexts: ['all'], documentUrlPatterns:['*://discord.com/*']});
		}
		else {
			chrome.contextMenus.create({id: 'token', title: 'Get Account Token', type: 'normal', contexts: ['all'], documentUrlPatterns:['*://discord.com/*']});
		}
	});
}
chrome.contextMenus.onClicked.addListener(function (info,tab) {
	if (info.menuItemId === 'js') {
		webrequest.enable()
		chrome.tabs.sendMessage(tab.id,{message: 'disablejs'});
		switcher = true
		create();
	}
	else if (info.menuItemId === 'token') {
		chrome.tabs.sendMessage(tab.id,{message: 'gettoken'});
		switcher = false
		webrequest.disable()
		create();
	}
});
chrome.runtime.onInstalled.addListener(function () {
	chrome.storage.local.get(null, function(a) {
		if (a.Group == null) chrome.storage.local.set({Group: [{ name: 'Default', accounts: [] }], Selected: 'Default'});
	});
});
create();