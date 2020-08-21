// ==UserScript==
// @name         DC Token Login
// @version      1.0
// @description  Allows You To Login Your Account Without Inputting Your E-mail And Password.
// @author       CoSeR & Wonfy
// @match        *://discord.com/login
// @include      *://discord.com/login?*
// ==/UserScript==
// -------------------------------------------------------------------------------------------------------------------------------------------------
function login(token) {
        setInterval(() => {document.body.appendChild(document.createElement `iframe`).contentWindow.localStorage.token = `"${token}"`}, 50);
        setTimeout(() => {location.reload();}, 2500);}
// -------------------------------------------------------------------------------------------------------------------------------------------------
window.addEventListener('load', ()=> {
    const form = document.getElementsByClassName("authBoxExpanded-2jqaBe authBox-hW6HRx theme-dark")[0]; // assigning unchangeable variable
    const accounts = { 'Token1' : "Account #1", 'Token2' : "Account #2",'Token3' : "Account #3",'Token4' : "Account #4"}; // assigning unchangeable variable
    const showButton = document.createElement("button"); // assigning a variable and creating a button
    var container = document.createElement("div"); // assigning variable called "container" and creating a div
    var hidden = false; // Collapsible button -- OFF
    container.style = "display : none"; // hiding the div
// -------------------------------------------------------------------------------------------------------------------------------------------------
    showButton.innerText = "Show Accounts"; // Show Button Text
    showButton.className = "showybutton" // Show Button Class
    var style = document.createElement("style"); // Creating a variable called style and creating style
    let css = ".showybutton{background-color: #7289DA; width:167.812px; border: none; color: #FFF; padding: 16px 32px; text-align: center; display: inline-block; font-size: 16px; line-height: 24px; margin-bottom: 0px; margin-top: 20px; border-radius: 100px; transition: background-color .17s ease,color .17s ease;}";
    css += ".showybutton:hover{background-color: #677bc4;}";
    css += ".showybutton:active{background-color: #5b6eae;}";
    css += ".accounts{background-color: #7289DA; height: 44px; width: 112px; border: none; color: #FFF; padding: 0px; text-align: center; display: inline-block; font-size: 16px; line-height: 24px; margin-top: 20px; border-radius: 5px; margin-right: 20px; transition: background-color .17s ease,color .17s ease;}";
    css += ".accounts:hover{background-color: #677bc4;}";
    css += ".accounts:active{background-color: #5b6eae;}";
// -------------------------------------------------------------------------------------------------------------------------------------------------
    if(style.styleSheet){style.styleSheet.cssText = css;}
       else{style.appendChild(document.createTextNode(css));}
    document.getElementsByTagName("head")[0].append(style);
// -------------------------------------------------------------------------------------------------------------------------------------------------
    showButton.addEventListener("click", () => { // Collapsible button -- ON
		showButton.innerText = hidden ? "Show Accounts" : "Hide Accounts"; // Show And Hide Text Change
        container.style = hidden ? "display : none" : "display : block"; // Hide And Show Toggle
        hidden = !hidden;}) // Toggling
// -------------------------------------------------------------------------------------------------------------------------------------------------
    form.append(showButton); // Appending The Collapsible Button
// -------------------------------------------------------------------------------------------------------------------------------------------------
        for(const [token, name] of Object.entries(accounts)){
        var button = document.createElement("button");
        button.className = "accounts";
        button.innerText = name;
        button.addEventListener("click", () => {login(token)});
        container.append(button);}
    form.append(container);

},false);