/*Récupération des travaux via l'API en format json*/
const response = await fetch("http://localhost:5678/api/works")
const works = await response.json()

/*Récupération de la balise "div class gallery" du html*/
const gallery = document.querySelector(".gallery")

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