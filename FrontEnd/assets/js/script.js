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


/*Modale*/


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
        <i class="fa-solid fa-trash-can"></i>
    `
    figure.innerHTML += trashIcon
})

/*Ajout icônes croix (fermeture) sur les photos*/
const modalWrapper = document.querySelector(".modal_wrapper")

const crossIcon = `
    <i class="fa-solid fa-xmark"></i>
`
modalWrapper.innerHTML += crossIcon
