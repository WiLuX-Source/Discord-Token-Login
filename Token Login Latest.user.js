// ==UserScript==
// @name         DC Token Login
// @version      1.2
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
    const target = document.querySelectorAll("div")[7]
    const accounts = {
        'Token1': "1",
        'Token2': "2",
        'Token3': "3",
        'Token4': "4",
        'Token5': "5",
        'Token6': "6",
        'Token7': "7",
        'Token8': "8",
        'Token9': "9",
        'Token10': "10"
    };
    const showButton = document.createElement("button");
    var container = document.createElement("div");
    var hidden = false;
    container.style = "display : none;";
    showButton.innerText = "Show Accounts";
    showButton.className = "showybutton"
    var style = document.createElement("style");
    let css = ".showybutton{position:absolute;top:180px;background-color: #7289DA; width:167.812px; border: none; color: #FFF; padding: 16px 32px; text-align: center; display: inline-block; font-size: 16px; line-height: 24px; margin-bottom: 0px; margin-top: 20px; border-radius: 10px; transition: background-color .17s ease,color .17s ease;}";
    css += ".showybutton:hover{background-color: #677bc4;}";
    css += ".showybutton:active{background-color: #5b6eae;}";
    css += ".accounts{background-color: #7289DA; height: 50px; width: 50px; border: none; color: #FFF; padding: 0px; text-align: center; display: inline-block; font-size: 16px; line-height: 24px; transition: background-color .17s ease,color .17s ease;}";
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
        container.style = hidden ? "display : none; width : min-content" : "display : block; width : min-content;";
        hidden = !hidden;
    })

    target.append(showButton);

    for (const [token, name] of Object.entries(accounts)) {
        var button = document.createElement("button");
        button.className = "accounts";
        button.innerText = name;
        button.addEventListener("click", () => {
            login(token)
        });
        container.append(button);
    }
    target.append(container);

}, false);
