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
function getWorks() {
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

getWorks()

/*Fonction pour insérer filtres dans le html*/
function getFilters() {
    const defaultButton = document.createElement("button")
    defaultButton.textContent = "Tous"
    filters.appendChild(defaultButton)

    for(let i = 0; i < categories.length; i++) {
        const categoryButton = document.createElement("button")
        categoryButton.textContent = categories[i].name
        filters.appendChild(categoryButton)
    }
}

getFilters()