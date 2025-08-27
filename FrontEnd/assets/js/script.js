/*Récupération des travaux via l'API en format json*/
const responseWorks = await fetch("http://localhost:5678/api/works")
const works = await responseWorks.json()

/*Récupération des catégories via l'API en format json*/
const responseCategories = await fetch("http://localhost:5678/api/categories")
const categories = await responseCategories.json()

/*Récupération de la balise "div class gallery du html"*/
const gallery = document.querySelector(".gallery")

/*Récupération de la balise "div class filters du html"*/
const filters = document.querySelector(".filters")


/*Fonction pour insérer travaux dans le html*/
function getWorks(works, gallery) {
    gallery.innerHTML = ""

    for(let i = 0; i < works.length; i++ ) {
        const image = works[i].imageUrl
        const title = works[i].title
        const figure = `
        <figure>
            <img src="${image}" alt="${title}">
            <figcaption>${title}</figcaption>
        </figure>
        `
        gallery.innerHTML += figure
    }
}

getWorks(works, gallery)

/*Fonction pour insérer filtres dans le html*/
function getFilters() {
    if(filters) {
        const defaultButton = document.createElement("button")
        defaultButton.textContent = "Tous"
        defaultButton.classList.add("button_selected")
            filters.appendChild(defaultButton)

        for(let i = 0; i < categories.length; i++) {
            const categoryButton = document.createElement("button")
            categoryButton.textContent = categories[i].name
            filters.appendChild(categoryButton)
        }
    }
}

getFilters()

/*Récupération des balises button*/
const buttonFilters = document.querySelectorAll("button")

/*Fonction pour appliquer le style du bouton sur lequel on a cliqué*/
function activeButtonStyle(clickedButton) {
	buttonFilters.forEach(button => {
			button.classList.remove("button_selected")
		})
		clickedButton.classList.add("button_selected");
}

/*Ajout EventListener sur les boutons*/
buttonFilters.forEach(button => {
    button.addEventListener("click", () => {
        const buttonName = button.textContent;

        if (buttonName === "Tous") {
            getWorks(works, gallery)
        } else {
            const worksFilter = works.filter(function(work) {
                return work.category.name === buttonName;
            });
            getWorks(worksFilter, gallery)
        }
        activeButtonStyle(button)
    })
})


/*Modale - Vue galerie photo*/


/*Ajout photos dans la modale*/
const modalPhotos = document.querySelector(".modal_photos")
getWorks(works, modalPhotos)

/*Suppression description (texte) sous les photos*/
const modalPhotosText = document.querySelectorAll(".modal_photos figcaption")
modalPhotosText.forEach(photosText => {
    photosText.remove() 
})

/*Ajout icônes poubelles sur les photos*/
const modalFigures = document.querySelectorAll(".modal_photos figure")

modalFigures.forEach(figure => {
    const trashIcon = `
        <button class="delete_photo"> <i class="fa-solid fa-trash-can"></i> </button>
    `
    figure.innerHTML += trashIcon
})

/*Ajout icônes croix (fermeture) sur les photos*/
const modalWrapper = document.querySelector(".modal_wrapper")

const crossIcon = `
    <button class="modal_close"> <i class="fa-solid fa-xmark"></i> </button>
`
modalWrapper.innerHTML += crossIcon


/*Ajout Event Listener sur lien vers modale*/
let modal = null
const focusableSelector = "button, input, a, textarea" 
let focusables = []

/*Fonction pour l'ouverture de la modale*/
const openModal = function (e) {
    e.preventDefault();
    modal = document.querySelector(e.currentTarget.getAttribute('href'))
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    modal.classList.add('modal_open')
    modal.removeAttribute('aria-hidden')
    modal.setAttribute('aria-modal', 'true')
    modal.addEventListener("click", closeModal)
    modal.querySelector(".modal_close").addEventListener("click", closeModal)
    modal.querySelector(".modal_stop").addEventListener("click", stopPropagation)
}

/*Fonction pour la fermeture de la modale*/
const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault();
    modal.classList.remove('modal_open')
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal.removeEventListener("click", closeModal)
    modal.querySelector(".modal_close").removeEventListener("click", closeModal)
    modal.querySelector(".modal_stop").removeEventListener("click", stopPropagation)
    modal = null

}

/*Fonction pour empêcher que la modale se ferme quand on clique à l'intérieur de la fenêtre modale*/
const stopPropagation = function (e) {
    e.stopPropagation()
}

/*Gestion du focus dans la boîte modale*/
const focusInModal = function (e) {
    e.preventDefault()
    let index = focusables.findIndex(f => f === modal.querySelector(":focus"))
    if (e.shiftKey === true) {
        index--
    } else {
        index++
    }
    if (index >= focusables.length) {
        index = 0
    }
    if (index < 0) {
        index = focusables.length - 1
    }
    focusables[index].focus()
}

/*Gestion de la fermeture de la modale avec la touche Echap*/
window.addEventListener("keydown", function(e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
    if (e.key === "Tab" && modal !== null) {
        focusInModal(e)
    }
})

const modalLink = document.querySelector(".modal_link")
modalLink.addEventListener("click", openModal)