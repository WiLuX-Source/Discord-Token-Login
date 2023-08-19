// ==UserScript==
// @name        Discord Token Login
// @description Allows You To Login Your Account Without Inputting Your E-mail And Password.
// @match       https://discord.com/login
// @include     https://discord.com/channels/*
// @include     https://discord.com/login?*
// @version     1.5.0
// @author      Wilux
// @require     https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@2,npm/@violentmonkey/ui@0.7
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==
/*
----How To Use----
- Click top left button to drag menu.
- Click top left button with CTRL(Control) key to close it.
- Refresh to open menu again.
- Click "Add Account" button to add new accounts.
- Click "Delete Account" button to delete accounts.
----How To Use----
*/
(function () {
  function _taggedTemplateLiteralLoose(strings, raw) {
    if (!raw) {
      raw = strings.slice(0);
    }
    strings.raw = raw;
    return strings;
  }

  var css_248z =
    ".absolute{position:absolute}.left-14px{left:14px}.right-14px{right:14px}.top-14px{top:14px}.grid{display:grid}.mb-8px{margin-bottom:8px}.mt-16px{margin-top:16px}.h-200px{height:200px}.h-32px{height:32px}.h-90px{height:90px}.w-32px{width:32px}.flex{display:flex}.cursor-move{cursor:move}.items-center{align-items:center}.justify-center{justify-content:center}.justify-items-center{justify-items:center}.gap-8px{gap:8px}.overflow-y-scroll{overflow-y:scroll}.px{padding-left:1rem;padding-right:1rem}.pt-12px{padding-top:12px}.text-24px{font-size:24px}.font-600{font-weight:600}.leading-30px{line-height:30px}.accountbody{--un-text-opacity:1;background:var(--background-mobile-secondary);border-radius:5px;box-sizing:border-box;color:rgba(114,118,125,var(--un-text-opacity));font-size:18px;height:400px;padding:32px;position:absolute;width:472px;z-index:9999}.title{color:var(--header-primary)}.helptext{color:var(--header-secondary)}.accountlist{border:1px solid hsla(0,0%,100%,.1);grid-template-rows:44px 44px 44px 44px;scrollbar-width:none}.accountlist::-webkit-scrollbar{display:none}#dragbutton>svg{fill:var(--header-secondary)}.versionnumber{color:var(--header-secondary)}.accountbutton{-webkit-box-pack:center;-webkit-box-align:center;align-items:center;background-color:var(--brand-experiment);border:none;border-radius:3px;box-sizing:border-box;color:#fff;display:flex;font-size:16px;font-weight:500;height:44px;justify-content:center;line-height:24px;min-height:44px;min-width:130px;padding:2px 16px;position:relative;transition:background-color .17s ease,color .17s ease;width:170px}.accountbutton:hover{background-color:var(--brand-experiment-560)}.accountbutton:active{background-color:var(--brand-experiment-600)}.userbutton{align-items:center;background-color:var(--background-tertiary);border-radius:3px;color:#fff;display:flex;font-size:16px;font-weight:500;height:44px;justify-content:space-between;line-height:24px;padding:2px 16px;transition:background-color .17s ease;width:170px}.userbutton:hover{background-color:var(--background-accent)}";

  var _templateObject;
  var accounts = GM_getValue("accountlist") || [];
  var coord = GM_getValue("coord") || {
    top: "25px",
    left: "25px",
  };

  var style = document.createElement("style");
  style.appendChild(document.createTextNode(css_248z));
  document.getElementsByTagName("head")[0].append(style);

  function login(token) {
    setInterval(function () {
      document.body.appendChild(
        document.createElement(
          _templateObject ||
            (_templateObject = _taggedTemplateLiteralLoose(["iframe"]))
        )
      ).contentWindow.localStorage.token = '"' + token + '"';
    }, 50);
    setTimeout(function () {
      location.reload();
    }, 50);
  }
  function drag(_ref) {
    var e = _ref.movementX,
      r = _ref.movementY;
    var t = window.getComputedStyle(accountbody),
      a = parseInt(t.left),
      o = parseInt(t.top);
    (accountbody.style.left = a + e + "px"),
      (accountbody.style.top = o + r + "px");
  }
  function renderaccounts() {
    accountlist.innerHTML = "";
    accounts.map(function (account) {
      return (
        // eslint-disable-next-line react/jsx-key
        accountlist.append(
          VM.m(
            VM.h(AccountCard, {
              name: account.name,
              img: account.img,
              token: account.token,
            })
          )
        )
      );
    });
  }
  function dragbtndown(a) {
    if (a.ctrlKey) accountbody.style.display = "none";
    accountbody.addEventListener("mousemove", drag);
  }
  function addaccount() {
    var name = prompt("Account Name");
    var img = prompt("Image Link");
    var token = prompt("Account Token");
    accounts.push({
      name: name,
      img: img,
      token: token,
    });
    GM_setValue("accountlist", accounts);
    renderaccounts();
  }
  function delaccount() {
    var name = prompt("Account Name");
    GM_setValue(
      "accountlist",
      accounts.filter(function (x) {
        return x.name != name;
      })
    );
    accounts = accounts.filter(function (x) {
      return x.name != name;
    });
    renderaccounts();
  }

  // eslint-disable-next-line react/prop-types
  function AccountCard(_ref2) {
    var name = _ref2.name,
      token = _ref2.token,
      img = _ref2.img;
    if (img === "" || img === undefined) {
      return VM.h(
        "button",
        {
          onClick: function onClick() {
            return login(token);
          },
          className: "userbutton",
        },
        name
      );
    } else {
      return VM.h(
        "button",
        {
          onClick: function onClick() {
            return login(token);
          },
          className: "userbutton",
        },
        VM.h("img", {
          width: "32px",
          height: "32px",
          src: img,
        }),
        name
      );
    }
  }
  function AccountMenu() {
    return VM.h(
      "div",
      {
        className: "accountbody",
      },
      VM.h(
        "div",
        null,
        VM.h(
          "h3",
          {
            className:
              "title font-600 mb-8px text-24px justify-center flex leading-30px",
          },
          "ACCOUNT LIST"
        ),
        VM.h(
          "div",
          {
            className: "flex justify-center helptext",
          },
          "You can scroll the list"
        )
      ),
      VM.h(
        "div",
        {
          className:
            "overflow-y-scroll grid h-200px justify-items-center gap-8px mt-16px pt-12px accountlist",
          id: "accountlist",
        },
        accounts.map(function (account) {
          return (
            // eslint-disable-next-line react/jsx-key
            VM.h(AccountCard, {
              name: account.name,
              img: account.img,
              token: account.token,
            })
          );
        })
      ),
      VM.h(
        "div",
        {
          className: "cursor-move h-32px w-32px absolute top-14px left-14px",
          id: "dragbutton",
          onMouseDown: dragbtndown,
        },
        VM.h(
          "svg",
          {
            width: "32",
            height: "32",
            viewBox: "0 0 16 16",
            style: "pointer-events: none;",
          },
          VM.h("path", {
            fillRule: "evenodd",
            d: "M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z",
          })
        )
      ),
      VM.h(
        "span",
        {
          className: "versionnumber absolute top-14px right-14px",
        },
        "1.5.0"
      ),
      VM.h(
        "div",
        {
          className: "flex justify-center items-center h-90px gap-8px",
        },
        VM.h(
          "button",
          {
            onClick: addaccount,
            className: "accountbutton",
          },
          "Add Account"
        ),
        VM.h(
          "button",
          {
            onClick: delaccount,
            className: "accountbutton",
          },
          "Delete Account"
        )
      )
    );
  }
  document.body.appendChild(VM.m(VM.h(AccountMenu, null)));
  var accountbody = document.querySelector(".accountbody");
  var accountlist = document.querySelector("#accountlist");
  accountbody.style.top = coord.top;
  accountbody.style.left = coord.left;
  document.addEventListener("mouseup", function (a) {
    accountbody.removeEventListener("mousemove", drag);
    if (!a.ctrlKey) {
      GM_setValue("coord", {
        top: accountbody.style.top,
        left: accountbody.style.left,
      });
    }
  });
})();
