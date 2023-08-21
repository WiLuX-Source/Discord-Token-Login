/* eslint-disable no-undef */
/* imports */
import css from "./style.css";
let accounts = GM_getValue("accountlist") || [];
const coord = GM_getValue("coord") || { top: "25px", left: "25px" };
/* imports */

/* Append Style */
const style = document.createElement("style");
style.appendChild(document.createTextNode(css));
document.getElementsByTagName("head")[0].append(style);
/* Append Style */

function login(token) {
	setInterval(() => {
		document.body.appendChild(
			document.createElement`iframe`,
		).contentWindow.localStorage.token = `"${token}"`;
	}, 50);
	setTimeout(() => {
		location.reload();
	}, 50);
}

function drag({ movementX: e, movementY: r }) {
	let t = window.getComputedStyle(accountbody),
		a = parseInt(t.left),
		o = parseInt(t.top);
	(accountbody.style.left = `${a + e}px`),
		(accountbody.style.top = `${o + r}px`);
}

function renderaccounts() {
	accountlist.innerHTML = "";
	accounts.map((account) => {
		return (
			// eslint-disable-next-line react/jsx-key
			accountlist.append(
				VM.m(
					<AccountCard
						name={account.name}
						img={account.img}
						token={account.token}
					/>,
				),
			)
		);
	});
}

function dragbtndown(a) {
	if (a.ctrlKey) accountbody.style.display = "none";
	accountbody.addEventListener("mousemove", drag);
}

function addaccount() {
	let name = prompt("Account Name");
	let img = prompt("Image Link");
	let token = prompt("Account Token");
	accounts.push({ name, img, token });
	GM_setValue("accountlist", accounts);
	renderaccounts();
}

function delaccount() {
	let name = prompt("Account Name");
	GM_setValue(
		"accountlist",
		accounts.filter((x) => x.name != name),
	);
	accounts = accounts.filter((x) => x.name != name);
	renderaccounts();
}

// eslint-disable-next-line react/prop-types
function AccountCard({ name, token, img }) {
	if (img === "" || img === undefined) {
		return (
			<button onClick={() => login(token)} className="userbutton">
				{name}
			</button>
		);
	} else {
		return (
			<button onClick={() => login(token)} className="userbutton">
				<img width="32px" height="32px" src={img} />
				{name}
			</button>
		);
	}
}

function AccountMenu() {
	return (
		<div className="accountbody">
			<div>
				<h3 className="title font-600 mb-8px text-24px justify-center flex leading-30px">
					ACCOUNT LIST
				</h3>
				<div className="flex justify-center helptext">
					You can scroll the list
				</div>
			</div>
			<div
				className="overflow-y-scroll grid h-200px justify-items-center gap-8px mt-16px pt-12px accountlist"
				id="accountlist"
			>
				{accounts.map((account) => {
					return (
						// eslint-disable-next-line react/jsx-key
						<AccountCard
							name={account.name}
							img={account.img}
							token={account.token}
						/>
					);
				})}
			</div>
			<div
				className="cursor-move h-32px w-32px absolute top-14px left-14px"
				id="dragbutton"
				onMouseDown={dragbtndown}
			>
				<svg
					width="32"
					height="32"
					viewBox="0 0 16 16"
					style="pointer-events: none;"
				>
					<path
						fillRule="evenodd"
						d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
					></path>
				</svg>
			</div>
			<span className="versionnumber absolute top-14px right-14px">1.5.0</span>
			<div className="flex justify-center items-center h-90px gap-8px">
				<button onClick={addaccount} className="accountbutton">
					Add Account
				</button>
				<button onClick={delaccount} className="accountbutton">
					Delete Account
				</button>
			</div>
		</div>
	);
}

document.body.appendChild(VM.m(<AccountMenu />));

const accountbody = document.querySelector(".accountbody");
const accountlist = document.querySelector("#accountlist");
accountbody.style.top = coord.top;
accountbody.style.left = coord.left;
document.addEventListener("mouseup", (a) => {
	accountbody.removeEventListener("mousemove", drag);
	if (!a.ctrlKey) {
		GM_setValue("coord", {
			top: accountbody.style.top,
			left: accountbody.style.left,
		});
	}
});
