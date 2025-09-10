// ----- GESTION DU MESSAGE D'ERREUR ----- //

/* Fonction pour afficher message d'erreur si email ou mot de passe incorrect */
function displayErrorMessage () {
    const formTitle = document.querySelector("h2")
    /* Permet de supprimer l'ancien message d'erreur si plusieurs tentatives de connexion infructueuses */
    const oldloginErrorMessage = document.querySelector(".login-Error")
    if (oldloginErrorMessage) {
        oldloginErrorMessage.remove ()
    }
    const loginErrorMessage = `
        <p class="login-Error"> Erreur dans l’identifiant ou le mot de passe </p> 
    `
    formTitle.insertAdjacentHTML("beforeend", loginErrorMessage)
}

// ----- GESTION DU FORMULAIRE ----- //

const loginForm = document.querySelector(".login-form")
/* Ajout EventListener sur le formulaire */
loginForm.addEventListener("submit", async function (event) {
    event.preventDefault ()
    /* Récupérations des informations de connexion */
    const loginInformations = {
        email : event.target.querySelector("[name=email]").value,
        password : event.target.querySelector("[name=password]").value
    }
    const logInUsefulInformations = JSON.stringify(loginInformations)
    /* Validation de la syntaxe de l'email */
    let emailRegExp = new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\\.[a-z]{2,}$")
    if (!emailRegExp.test(loginInformations.email)) {
        displayErrorMessage ()
        loginForm.reset()
        return
    }
    /* Envoi à l'API */
    const responseLogin = await fetch("http://localhost:5678/api/users/login", {
        method : "POST",
        headers : { "Content-Type": "application/json" },
        body : logInUsefulInformations
    })
    const responseLoginData = await responseLogin.json()
    /* Validation des informations de connexion */
    if (responseLogin.ok) {
        localStorage.setItem("token", responseLoginData.token)
        window.location.href = "../html/accueil_mode_edition.html"
    } else {
        displayErrorMessage ()
        loginForm.reset()
    }
})
