let switcher = !1;
let webrequest = {
	header: (d) => {
		const responseHeaders = d.responseHeaders;
		responseHeaders.push({ name: 'Content-Security-Policy', value: 'script-src \'none\'' });
		return { responseHeaders };
	},
	enable: () =>
		browser.webRequest.onHeadersReceived.addListener(
			webrequest.header,
			{ urls: ['*://*/*'], types: ['main_frame', 'sub_frame'] },
			['blocking', 'responseHeaders']
		),
	disable: () => browser.webRequest.onHeadersReceived.removeListener(webrequest.header),
};
function create() {
	browser.contextMenus.removeAll(function () {
		if (!switcher) {
			browser.contextMenus.create({ id: 'js', title: 'Disable Javascript', type: 'normal', contexts: ['all'], documentUrlPatterns: ['*://discord.com/*'] });
		}
		else {
			browser.contextMenus.create({ id: 'token', title: 'Get Account Token', type: 'normal', contexts: ['all'], documentUrlPatterns: ['*://discord.com/*'] });
		}
	});
}
browser.contextMenus.onClicked.addListener(function (info, tab) {
	if (info.menuItemId === 'js') {
		webrequest.enable();
		browser.tabs.sendMessage(tab.id, { message: 'disablejs' });
		switcher = true;
		create();
	}
	else if (info.menuItemId === 'token') {
		browser.tabs.sendMessage(tab.id, { message: 'gettoken' });
		switcher = false;
		webrequest.disable();
		create();
	}
});
browser.runtime.onInstalled.addListener(function () {
	browser.storage.local.get(null, function (a) {
		if (a.Group == null) browser.storage.local.set({ Group: [{ name: 'Default', accounts: [] }], Selected: 'Default' });
	});
});
create();