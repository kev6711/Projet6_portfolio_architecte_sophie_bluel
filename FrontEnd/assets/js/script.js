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
        <figure data-id="${works[i].id}">
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
        defaultButton.classList.add("button-selected")
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
			button.classList.remove("button-selected")
		})
		clickedButton.classList.add("button-selected");
}

/*Ajout EventListener sur les boutons pour filtrer*/
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
const modalPhotos = document.querySelector(".modal-photos")
getWorks(works, modalPhotos)

/*Suppression description (texte) sous les photos*/
const modalPhotosText = document.querySelectorAll(".modal-photos figcaption")
modalPhotosText.forEach(photosText => {
    photosText.remove() 
})

/*Ajout icônes poubelles sur les photos*/
const modalFigures = document.querySelectorAll(".modal-photos figure")

modalFigures.forEach((figure, i) => {
    const trashIconInsert = `
        <button class="delete-photo" data-id="${works[i].id}"> <i class="fa-solid fa-trash-can" ></i> </button>
    `
    figure.insertAdjacentHTML("beforeend", trashIconInsert)
})


/*Ajout icônes croix (fermeture) sur les photos*/
const modalWrapper = document.querySelector(".modal-wrapper")

const crossIcon = `
    <button class="modal-close"> <i class="fa-solid fa-xmark"></i> </button>
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
    modal.classList.add('modal-open')
    modal.removeAttribute('aria-hidden')
    modal.setAttribute('aria-modal', 'true')
    modal.addEventListener("click", closeModal)
    modal.querySelector(".modal-close").addEventListener("click", closeModal)
    modal.querySelector(".modal-stop").addEventListener("click", stopPropagation)
}

/*Fonction pour la fermeture de la modale*/
const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault();
    modal.classList.remove('modal-open')
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal.removeEventListener("click", closeModal)
    modal.querySelector(".modal-close").removeEventListener("click", closeModal)
    modal.querySelector(".modal-stop").removeEventListener("click", stopPropagation)
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

const modalLink = document.querySelector(".modal-link")
modalLink.addEventListener("click", openModal)

/*Gestion de la fonctionnalité pour la suppression de travaux existant*/
const deletePhotosButtons = document.querySelectorAll(".delete-photo")
deletePhotosButtons.forEach(deletePhotoButton => {
    deletePhotoButton.addEventListener("click", async (e) => {
        e.preventDefault()
        const workId = deletePhotoButton.dataset.id
        const token = localStorage.getItem("token")
        const responseDelete = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method : "DELETE",
            headers : { "Authorization": `Bearer ${token}` }

        })
        deletePhotoButton.closest("figure").remove()
        const deleteFigure = document.querySelector(`.gallery figure[data-id="${workId}"`)
        deleteFigure.remove()
        
    })
})



/*Modale - Vue ajout photo*/

const modalTitle = document.querySelector("#modal-title")
const addPhotoButton = document.querySelector(".add-photo-button")


/*Ajout EventListener sur le bouton "Ajouter une photo*/ 
function openModalPhotoView () {

    addPhotoButton.removeEventListener("click", openModalPhotoView)

    modalTitle.textContent = "Ajout photo"
    const currentModalPhotos = document.querySelector(".modal-photos")
    currentModalPhotos.classList.add("is-hidden")
    const modalFormInsert = `
        <form action="#" method="post">
            <div class="upload-zone">
                <i class="fa-solid fa-image"></i>
                <label class="add-file-button" for="file" >+ Ajouter photo</label>
                <p>jpg, png : 4mo max</p>
                <input type="file" name="file" id="file" accept=".jpg,.png" required>
                <img id="previewImage" class="preview is-hidden" alt="Aperçu de l'image téléchargée">
            </div>
			<label for="title"> Titre </label>
			<input type="text" name="title" id="title">
			<label for="category"> Catégorie </label>
            <div class="select-container">
                <select name="category" id="category" placeholder="">
                    <option value="" selected disabled hidden></option>
                </select>
                <i class="fa-solid fa-chevron-down" id="chevron"></i>
            </div>
		</form>
    `
    modalTitle.insertAdjacentHTML("afterend", modalFormInsert);
    addPhotoButton.value = "Valider"
    addPhotoButton.classList.add("photo-view")
    modalWrapper.classList.add("photo-view")

    /*Ajout icône de retour vers boite modale préccédente (vue galerie)*/
    const gobackArrowInsert = `
    <button class="goback-arrow"> <i class="fa-solid fa-arrow-left"></i> </button>
    `
    modalWrapper.insertAdjacentHTML("beforeend", gobackArrowInsert)

    /*Ajout EventListener sur la flèche retour pour afficher modale vue galerie*/
    const gobackArrowElement = document.querySelector(".goback-arrow")
    gobackArrowElement.addEventListener("click", () => {
        modalTitle.textContent = "Galerie photo"
        currentModalPhotos.classList.remove("is-hidden")
        const modalFormElement = document.querySelector(".modal-wrapper form")
        modalFormElement.remove()
        addPhotoButton.value = "Ajouter une photo"
        addPhotoButton.classList.remove("photo-view")
        modalWrapper.classList.remove("photo-view")
        gobackArrowElement.remove()
        const errorMessage = document.querySelector(".form-Error")
        if(errorMessage) {
            errorMessage.remove()
        }
        addPhotoButton.addEventListener("click", openModalPhotoView)
    })

    /*Ajout liste déroulante des catégories depuis l'API*/
    const modalCategoryList = document.querySelector("#category")
    for(let i = 0; i < categories.length; i++) {
        const modalCategoryChoice = document.createElement("option")
        modalCategoryChoice.textContent = categories[i].name
        modalCategoryChoice.value = categories[i].id
        modalCategoryList.appendChild(modalCategoryChoice)
    }

    const chevronIcon = document.querySelector("#chevron")
    chevronIcon.addEventListener("click", (e) => {
        e.preventDefault()
        modalCategoryList.focus()
        modalCategoryList.click()
    })
    
    /*Récupération et affichage de l'aperçu de l'image chargée*/
    const fileInput = document.querySelector("#file")
    const previewImage = document.querySelector("#previewImage")
    const imageIcon = document.querySelector(".fa-image")
    const addFileButton = document.querySelector(".add-file-button")
    const imageType = document.querySelector(".upload-zone p")


    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0]
        const uploadImage = new FileReader ();
        uploadImage.onload = (e) => {
            previewImage.src = e.target.result;
            previewImage.classList.remove("is-hidden")
            imageIcon.classList.add("is-hidden")
            addFileButton.classList.add("is-hidden")
            imageType.classList.add("is-hidden")

        }
        uploadImage.readAsDataURL(file)
    })

    /*Gestion de la fonctionnalité pour ajouter un nouveau projet*/
    const modalPhotoTitle = document.querySelector("#title")

    /*Fonction pour afficher message d'erreur*/
    function ErrorMessage () {
        const formTitle = document.querySelector("h3")
        /* Permet de supprimer l'ancien message d'erreur si plusieurs tentatives de connexion infructueuses*/
        const oldErrorMessage = document.querySelector(".form-Error")
        if (oldErrorMessage) {
            oldErrorMessage.remove()
        }
        const errorMessage = `
            <p class="form-Error"> Il faut insérer une image, renseigner un titre et choisir une catégorie </p> 
        `
        formTitle.insertAdjacentHTML("afterend", errorMessage)
    }

    /*Gestion de la validation du formulaire*/
    function validForm () {
        const errorMessage = document.querySelector(".form-Error")
        if(fileInput.files.length !== 0 && modalPhotoTitle.value.length !== 0 && modalCategoryList.selectedIndex !== 0) {
            addPhotoButton.classList.remove("photo-view")
            if(errorMessage) {
            errorMessage.remove()
            }
            return true
        } else {
            ErrorMessage()

            if(!addPhotoButton.classList.contains("photo-view")) {
                addPhotoButton.classList.add("photo-view")
            }
            return false
        }
    }

    fileInput.addEventListener("input", () => {
        validForm()
    })
    modalPhotoTitle.addEventListener("change", () => {
        validForm()
    })
    modalCategoryList.addEventListener("change", () => {
        validForm()
    })

    addPhotoButton.addEventListener("click", async function (e) {
        e.preventDefault()
        if (validForm()) {
            console.log("validé")
            /*Envoi d'un nouveau projet à l'API*/
            const token = localStorage.getItem("token")
            console.log(fileInput.files[0])
            console.log(modalPhotoTitle.value)
            console.log(modalCategoryList.value)

            const workFormData = new FormData()
            workFormData.append("image", fileInput.files[0])
            workFormData.append("title", modalPhotoTitle.value)
            workFormData.append("category", modalCategoryList.value)

            const responsePostWorks = await fetch("http://localhost:5678/api/works", {
                method : "POST",
                headers : { "Authorization": `Bearer ${token}` },
                body: workFormData
            })

        }   else {
            console.log("invalidé")
        }
    })
}

addPhotoButton.addEventListener("click", openModalPhotoView)


