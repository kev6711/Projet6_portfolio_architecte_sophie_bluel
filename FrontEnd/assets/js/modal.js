// ----- DONNEES D'ENTREES ----- //

/* Importations constantes utiles depuis le fichier script.js */
import { categories, gallery } from './script.js'

/* Constantes et variables */
export const modalPhotos = document.querySelector(".modal-photos")
const modalWrapper = document.querySelector(".modal-wrapper")
const addPhotoButton = document.querySelector(".add-photo-button")
const modalTitle = document.querySelector("#modal-title")
let modal = null


// ----- GESTION OUVERTURE ET FERMETURE DE LA MODALE ----- //

/* Fonction pour l'ouverture de la modale */
export const openModal = function (e) {
    e.preventDefault ()
    modal = document.querySelector(e.currentTarget.getAttribute("href"))
    resetModalToGalleryView ()
    modal.classList.add("modal-open")
    modal.removeAttribute("aria-hidden")
    modal.setAttribute("aria-modal", "true")
    modal.addEventListener("click", closeModal)
    modal.querySelector(".modal-close").addEventListener("click", closeModal)
    modal.querySelector(".modal-stop").addEventListener("click", stopPropagation)
}

/* Fonction pour la fermeture de la modale */
const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault ()
    resetModalToGalleryView ()
    modal.classList.remove("modal-open")
    modal.setAttribute("aria-hidden", "true")
    modal.removeAttribute("aria-modal")
    modal.removeEventListener("click", closeModal)
    modal.querySelector(".modal-close").removeEventListener("click", closeModal)
    modal.querySelector(".modal-stop").removeEventListener("click", stopPropagation)
    modal = null
}

/* Gestion de la fermeture de la modale avec la touche Echap */
window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
})

/* Fonction pour empêcher que la modale se ferme quand on clique à l'intérieur de la fenêtre modale */
const stopPropagation = function (e) {
    e.stopPropagation ()
}

// ----- GESTION DU VISUEL DE LA MODALE ----- //

/* Fonction pour retirer les figcaption dans la vue modale */
export function deleteFigcaption ()  {
    if (modalPhotos) {
        const modalPhotosText = document.querySelectorAll(".modal-photos figcaption")
        modalPhotosText.forEach(photosText => {
            photosText.remove () 
        })
    }
}

/* Fonction  pour ajouter icône de poubelle sur les photos de la modale */
export function addTrashIconPhoto () {
    if (!modalPhotos) return
    const modalFigures = modalPhotos.querySelectorAll("figure")
    modalFigures.forEach((figure) => {
    if (!figure.querySelector(".delete-photo")) {
      const workId = figure.getAttribute("data-id")
      const trashIconInsert = `
        <button class="delete-photo" data-id="${workId}">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      `
      figure.insertAdjacentHTML("beforeend", trashIconInsert)
    }
  })
}

/* Fonction pour ajouter les icônes croix (fermeture) sur la modale */
export function addCrossIcon () {
    if (modalWrapper && !modalWrapper.querySelector(".modal-close")) {
        const modalWrapper = document.querySelector(".modal-wrapper")
        const crossIcon = `
            <button class="modal-close"> <i class="fa-solid fa-xmark"></i> </button>
        `
        modalWrapper.insertAdjacentHTML("beforeend", crossIcon)
    }
}

// ----- CONSTRUCTION DE LA MODALE (VUE AJOUT PHOTO) ----- //

/* Fonction permettant d'avoir le visuel et les fonctionnalités de la modale en vue "ajout photo" */
function openModalPhotoView () {
    /* Nettoyer un éventuel message d’erreur résiduel */
    document.querySelector(".form-Error")?.remove ()

    /* Ajout des éléments */
    modalTitle.textContent = "Ajout photo"
    const currentModalPhotos = document.querySelector(".modal-photos")
    currentModalPhotos.classList.add("is-hidden")
    const modalFormInsert = `
        <form action="#" method="post" class="modal-stop">
        <div class="upload-zone">
            <i class="fa-solid fa-image"></i>
            <label class="add-file-button" for="file">+ Ajouter photo</label>
            <p>jpg, png : 4mo max</p>
            <input type="file" name="file" id="file" accept=".jpg,.png" required>
            <img id="previewImage" class="preview is-hidden" alt="Aperçu de l'image téléchargée">
        </div>
        <label for="title">Titre</label>
        <input type="text" name="title" id="title">
        <label for="category">Catégorie</label>
        <div class="select-container">
            <select name="category" id="category" placeholder="">
            <option value="" selected disabled hidden></option>
            </select>
            <i class="fa-solid fa-chevron-down" id="chevron"></i>
        </div>
        </form>
    `
    modalTitle.insertAdjacentHTML("afterend", modalFormInsert)

    /* Ajout des styles */
    addPhotoButton.value = "Valider"
    addPhotoButton.classList.add("photo-view")
    modalWrapper.classList.add("photo-view")

    /* Ajout icône de retour vers boite modale préccédente (vue galerie) */
    if (!modalWrapper.querySelector(".goback-arrow")) {
        const gobackArrowInsert = `
            <button class="goback-arrow"> <i class="fa-solid fa-arrow-left"></i> </button>
        `
        modalWrapper.insertAdjacentHTML("beforeend", gobackArrowInsert)
    }

    /* Ajout liste déroulante des catégories depuis l'API */
    const modalCategoryList = document.querySelector("#category")
    for (let i = 0; i < categories.length; i++) {
        const modalCategoryChoice = document.createElement("option")
        modalCategoryChoice.textContent = categories[i].name
        modalCategoryChoice.value = categories[i].id
        modalCategoryList.appendChild(modalCategoryChoice)
    }

    /* Récupération et affichage de l'aperçu de l'image chargée */
    const fileInput = document.querySelector("#file")
    const previewImage = document.querySelector("#previewImage")
    const imageIcon = document.querySelector(".fa-image")
    const addFileButton = document.querySelector(".add-file-button")
    const imageType = document.querySelector(".upload-zone p")

    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0]
        const uploadImage = new FileReader ()
        uploadImage.onload = (e) => {
            previewImage.src = e.target.result
            previewImage.classList.remove("is-hidden")
            imageIcon.classList.add("is-hidden")
            addFileButton.classList.add("is-hidden")
            imageType.classList.add("is-hidden")
        }
        if (file) uploadImage.readAsDataURL(file)
    })

    /* Fonction pour afficher message d'erreur si le formulaire n'est pas rempli */
    const modalPhotoTitle = document.querySelector("#title")
    function showErrorMessage () {
        const formTitle = document.querySelector("h3")
        /* Permet de supprimer l'ancien message d'erreur si plusieurs tentatives de connexion infructueuses */
        const oldErrorMessage = document.querySelector(".form-Error")
        if (oldErrorMessage) {
            oldErrorMessage.remove ()
        }
        const errorMessage = `
            <p class="form-Error"> Il faut insérer une image, renseigner un titre et choisir une catégorie </p> 
        `
        formTitle.insertAdjacentHTML("afterend", errorMessage)
    }

    /* Fonction pour tester la validation du formulaire */
    function validForm () {
        const errorMessage = document.querySelector(".form-Error")
        const modalPhotoTitleValue = modalPhotoTitle.value.trim()
        if (fileInput.files.length !== 0 && modalPhotoTitleValue.length !== 0 && modalCategoryList.selectedIndex !== 0) {
            addPhotoButton.classList.remove("photo-view")
            if(errorMessage) {
                errorMessage.remove ()
            }
            return true
        } else {
            if (!addPhotoButton.classList.contains("photo-view")) {
                addPhotoButton.classList.add("photo-view")
            }
            return false
        }
    }

    /* Permet de tester la validité de tous les champs du formulaire */
    fileInput.addEventListener("input",  validForm)
    modalPhotoTitle.addEventListener("input", validForm)
    modalCategoryList.addEventListener("change", validForm)

    // Permet de rendre les fonctions disponibles pour handleSubmitNewWork()
    window.showErrorMessage = showErrorMessage  
    window.validForm = validForm

    /* Ajout EventListener sur flèche pour revenir à la vue modale galerie */
    const gobackArrowElement = document.querySelector(".goback-arrow")
    gobackArrowElement.addEventListener("click", (e) => {
        e.preventDefault ()
        resetModalToGalleryView ()
    })

    /* SWAP des listeners du bouton principal : */
    addPhotoButton.removeEventListener("click", handleOpenAddView)
    addPhotoButton.addEventListener("click", handleSubmitNewWork)
}

/* Fonction pour ouvrir la modale en vue Ajout photo */
function handleOpenAddView(e) {
    e.preventDefault ()
    openModalPhotoView ()
}

// ----- GESTION DE L'ENVOI DU FORMULAIRE ET DE L'AJOUT D'UN NOUVEAU PROJET ----- //

/* Fonction pour soumettre le formulaire */
async function handleSubmitNewWork(e) {
    e.preventDefault ()

    /* Récupération des éléments du formulaire */
    const fileInput = document.querySelector("#file")
    const modalPhotoTitle = document.querySelector("#title")
    const modalCategoryList = document.querySelector("#category")

    /* Validation du formulaire */
    if (!validForm ()) {
        showErrorMessage ()
        return
    }

    /* Envoi d'un nouveau projet à l'API */
    const token = localStorage.getItem("token")
    const workFormData = new FormData ()
    workFormData.append("image", fileInput.files[0])
    workFormData.append("title", modalPhotoTitle.value)
    workFormData.append("category", modalCategoryList.value)

    const responsePostWorks = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: workFormData
    })

    const newWork = await responsePostWorks.json ()

    /* Insérer nouveau projet dans la galerie principale */
    const galleryFigure = `
        <figure data-id="${newWork.id}">
        <img src="${newWork.imageUrl}" alt="${newWork.title}">
        <figcaption>${newWork.title}</figcaption>
        </figure>
    `
    gallery.insertAdjacentHTML("beforeend", galleryFigure)

    /* Insérer nouveau projet dans la galerie modale */
    const modalFigure = `
        <figure data-id="${newWork.id}">
        <img src="${newWork.imageUrl}" alt="${newWork.title}">
        </figure>
    `
    modalPhotos.insertAdjacentHTML("beforeend", modalFigure)

    /* Ajout de l'icône poubelle sur le travail ajouté */
    const lastFigure = modalPhotos.querySelector(`figure[data-id="${newWork.id}"]`)
    if (lastFigure && !lastFigure.querySelector(".delete-photo")) {
            const addTrashIconToLastWork = `
                <button class="delete-photo" data-id="${newWork.id}">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `
            lastFigure.insertAdjacentHTML("beforeend", addTrashIconToLastWork)
    }

  /* Ajout de l'EventListener "suppression" sur l'icône poubelle du travail ajouté */
  deleteWorks ()

  /* Fermeture de la modale en vue "ajout photo" lorsque l'on a ajouté un nouveau projet */
  closeModal (e)
}

// ----- GESTION DE LA FONCTIONNALITE POUR LA SUPPRESSION DE TRAVAUX EXISTANTS ----- //

/* Fonction permettant la suppression d'un projet */
function deleteWorks () {
    const deletePhotosButtons = document.querySelectorAll(".delete-photo")
    deletePhotosButtons.forEach((deletePhotoButton) => {
    deletePhotoButton.addEventListener("click", async (e) => {
        e.preventDefault ()
        const workId = deletePhotoButton.dataset.id
        const token = localStorage.getItem("token")
        await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
            })

            /* Suppression dans modale */
            deletePhotoButton.closest("figure").remove ()
            /* Suppression dans galerie principale */
            const deleteFigure = document.querySelector(`.gallery figure[data-id="${workId}"]`)
            deleteFigure?.remove ()
        })
    })
}

deleteWorks ()

// ----- GESTION DU RETOUR A LA MODALE EN VUE GALERIE ----- //

/* Fonction permettant de passer à la vue galerie */
function resetModalToGalleryView () {
    /* Définition constantes */
    const currentModalPhotos = document.querySelector(".modal-photos")
    const modalFormElement = document.querySelector(".modal-wrapper form")
    const gobackArrow = document.querySelector(".goback-arrow")
    const errorMessage = document.querySelector(".form-Error")

    /* Modifications styles */
    if (modalTitle) modalTitle.textContent = "Galerie photo"
    if (currentModalPhotos) currentModalPhotos.classList.remove("is-hidden")
    if (modalFormElement) modalFormElement.remove ()
    if (gobackArrow) gobackArrow.remove ()
    if (errorMessage) errorMessage.remove ()
    modalWrapper.classList.remove("photo-view")

    /* Bouton redevient "Ajouter une photo" et reprend son listener d'ouverture de la modale en vue "ajout photo" */
    addPhotoButton.value = "Ajouter une photo"
    addPhotoButton.classList.remove("photo-view")
    addPhotoButton.removeEventListener("click", handleSubmitNewWork)
    addPhotoButton.addEventListener("click", handleOpenAddView)
}

// ----- GESTION DE L'EVENT LISTENER SUR LE BOUTON PRINCIPAL DE LA MODALE ----- //

if (addPhotoButton) {
    addPhotoButton.addEventListener("click", handleOpenAddView)
}