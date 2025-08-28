/* Récupération du formulaire*/
const loginForm = document.querySelector(".login-form")

/* Fonction pour afficher message d'erreur si email ou mot de passe incorrects*/
function displayErrorMessage () {
    const formTitle = document.querySelector("h2")

    /* Permet de supprimer l'ancien message d'erreur si plusieurs tentatives de connexion infructueuses*/
    const oldloginErrorMessage = document.querySelector(".login-Error")
    if (oldloginErrorMessage) {
        oldloginErrorMessage.remove()
    }
    
    const loginErrorMessage = `
        <p class="login-Error"> Erreur dans l’identifiant ou le mot de passe </p> 
    `
    formTitle.innerHTML += loginErrorMessage
}

/* Ajout EventListener sur le formulaire */
loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const loginInformations = {
        email : event.target.querySelector("[name=email]").value,
        password : event.target.querySelector("[name=password]").value
    }
    const logInUsefulInformations = JSON.stringify(loginInformations);

    const responseLogin = await fetch("http://localhost:5678/api/users/login", {
        method : "POST",
        headers : { "Content-Type": "application/json" },
        body : logInUsefulInformations
    })

    const responseLoginData = await responseLogin.json()

    if (responseLogin.ok) {
        localStorage.setItem("token", responseLoginData.token)
        window.location.href = "../html/accueil-mode-edition.html"
    } else {
        displayErrorMessage()
    }
})
