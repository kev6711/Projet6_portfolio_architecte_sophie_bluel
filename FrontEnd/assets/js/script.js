// ----- DONNEES D'ENTREES ----- //

/* Importation des fonctions et constantes de la modale */
import { openModal, deleteFigcaption, addTrashIconPhoto, addCrossIcon, modalPhotos } from './modal.js'

/* Récupération des données de l'API */
const responseWorks = await fetch("http://localhost:5678/api/works")
const works = await responseWorks.json()

const responseCategories = await fetch("http://localhost:5678/api/categories")
export const categories = await responseCategories.json()

/* Définition des constantes */
export const gallery = document.querySelector(".gallery")
const filters = document.querySelector(".filters")
const modalLink = document.querySelector(".modal-link")

// ----- CREATION DE LA GALERIE DE TRAVAUX ----- //

/* Fonction pour insérer les travaux */
function getWorks(works, insertTag) {
    if(!insertTag) return
    insertTag.innerHTML = ""
    for (let i = 0; i < works.length; i++) {
        const image = works[i].imageUrl
        const title = works[i].title
        const figure = `
        <figure data-id="${works[i].id}">
            <img src="${image}" alt="${title}">
            <figcaption>${title}</figcaption>
        </figure>
        `
        insertTag.insertAdjacentHTML("beforeend", figure)
    }
}

getWorks(works, gallery)

// ----- GESTION DES FILTRES ----- //

/* Fonction pour créer filtre par défaut ("Tous") */
function getFirstFilter () {
    const defaultButton = document.createElement("button")
    defaultButton.textContent = "Tous"
    defaultButton.classList.add("button-selected")
    filters.appendChild(defaultButton)
}

/* Fonction pour créer les autres filtres */
function getOtherFilters () {
    for (let i = 0; i < categories.length; i++) {
        const categoryButton = document.createElement("button")
        categoryButton.textContent = categories[i].name
        filters.appendChild(categoryButton)
    }
}

/* Regroupement des 2 fonctions pour créer tous les filtres */
function getFilters () {
    if (!filters) return
    getFirstFilter ()
    getOtherFilters()
}

getFilters ()

/* Fonction pour activer le style du bouton filtre sur lequel on clique */
const buttonFilters = document.querySelectorAll("button")
function activeButtonStyle(clickedButton) {
    buttonFilters.forEach(button => { 
        button.classList.remove("button-selected")
    })
    clickedButton.classList.add("button-selected")
}

/* Ajout EventListener sur les boutons filtres pour générer les travaux filtrés */
buttonFilters.forEach(button => {
    button.addEventListener("click", () => {
        const buttonName = button.textContent

        if (buttonName === "Tous") {
            getWorks(works, gallery)
        } else {
            const worksFilter = works.filter(function(work) {
                return work.category.name === buttonName
            })
            getWorks(worksFilter, gallery)
        }
        activeButtonStyle(button)
    })
})


// ----- FENETRE MODALE ----- //

/* Construction de la modale */
getWorks (works, modalPhotos)
deleteFigcaption ()
addTrashIconPhoto ()
addCrossIcon ()

/* Gestion du lien permettant d'ouvrir la modale */
if (modalLink) {
    modalLink.addEventListener("click", openModal)
}