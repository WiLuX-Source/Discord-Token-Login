// ==UserScript==
// @name         DC Token Login
// @version      1.1
// @description  Allows You To Login Your Account Without Inputting Your E-mail And Password.
// @author       WiLuX & Wonfy
// @match        *://discord.com/login
// @include      *://discord.com/login?*
// ==/UserScript==
function login(token) {
    setInterval(() => {
        document.body.appendChild(document.createElement `iframe`).contentWindow.localStorage.token = `"${token}"`
    }, 50);
    setTimeout(() => {
        location.reload();
    }, 50);
}

window.addEventListener('load', () => {
    const form = document.getElementsByClassName("authBoxExpanded-2jqaBe authBox-hW6HRx theme-dark")[0];
    const accounts = {
        'Token1': "Account #1",
        'Token2': "Account #2",
        'Token3': "Account #3",
        'Token4': "Account #4",
        'Token5': "Account #5",
        'Token6': "Account #6",
        'Token7': "Account #7",
        'Token8': "Account #8",
        'Token9': "Account #9",
        'Token10': "Account #10"
    };
    const showButton = document.createElement("button");
    var container = document.createElement("div");
    var hidden = false;
    container.style = "display : none";

    showButton.innerText = "Show Accounts";
    showButton.className = "showybutton"
    var style = document.createElement("style");
    let css = ".showybutton{background-color: #7289DA; width:167.812px; border: none; color: #FFF; padding: 16px 32px; text-align: center; display: inline-block; font-size: 16px; line-height: 24px; margin-bottom: 0px; margin-top: 20px; border-radius: 100px; transition: background-color .17s ease,color .17s ease;}";
    css += ".showybutton:hover{background-color: #677bc4;}";
    css += ".showybutton:active{background-color: #5b6eae;}";
    css += ".accounts{background-color: #7289DA; height: 44px; width: 112px; border: none; color: #FFF; padding: 0px; text-align: center; display: inline-block; font-size: 16px; line-height: 24px; margin-top: 20px; border-radius: 5px; margin-right: 20px; transition: background-color .17s ease,color .17s ease;}";
    css += ".accounts:hover{background-color: #677bc4;}";
    css += ".accounts:active{background-color: #5b6eae;}";

    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    document.getElementsByTagName("head")[0].append(style);

    showButton.addEventListener("click", () => {
        showButton.innerText = hidden ? "Show Accounts" : "Hide Accounts";
        container.style = hidden ? "display : none" : "display : block";
        hidden = !hidden;
    })

    form.append(showButton);

    for (const [token, name] of Object.entries(accounts)) {
        var button = document.createElement("button");
        button.className = "accounts";
        button.innerText = name;
        button.addEventListener("click", () => {
            login(token)
        });
        container.append(button);
    }
    form.append(container);

}, false);
