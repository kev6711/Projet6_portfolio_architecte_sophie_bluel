/* Récupération des données de l'API */
const responseWorks = await fetch("http://localhost:5678/api/works")
const works = await responseWorks.json()

const responseCategories = await fetch("http://localhost:5678/api/categories")
const categories = await responseCategories.json()

/* Définition des constantes */
const gallery = document.querySelector(".gallery")
const filters = document.querySelector(".filters")
const modalWrapper = document.querySelector(".modal-wrapper")
const modalPhotos = document.querySelector(".modal-photos")
const modalTitle = document.querySelector("#modal-title")
const addPhotoButton = document.querySelector(".add-photo-button")
const modalLink = document.querySelector(".modal-link")

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

/* Filtres */

/* Fonction pour créer filtre par défaut ("Tous")*/
function getFirstFilter () {
    const defaultButton = document.createElement("button")
    defaultButton.textContent = "Tous"
    defaultButton.classList.add("button-selected")
    filters.appendChild(defaultButton)
}

/* Fonction pour créer les autres filtres*/
function getOtherFilters () {
    for (let i = 0; i < categories.length; i++) {
        const categoryButton = document.createElement("button")
        categoryButton.textContent = categories[i].name
        filters.appendChild(categoryButton)
    }
}

/* Regroupement des 2 fonctions pour créer tous les filtres*/
function getFilters () {
    if (!filters) return;
    getFirstFilter()
    getOtherFilters()
}

getFilters ()

const buttonFilters = document.querySelectorAll("button")

/* Fonction pour activer le style du bouton filtre sur lequel on clique*/
function activeButtonStyle(clickedButton) {
    buttonFilters.forEach(button => { 
        button.classList.remove("button-selected")
    })
    clickedButton.classList.add("button-selected")
}

/* Ajout EventListener sur les boutons filtres pour générer les travaux filtrés*/
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


/* =========================
   Modale - Vue "Galerie photo"
   ========================= */
getWorks(works, modalPhotos)

// Retirer les figcaption dans la vue modale
if (modalPhotos) {
    const modalPhotosText = document.querySelectorAll(".modal-photos figcaption")
    modalPhotosText.forEach(photosText => {
    photosText.remove() 
})
}

// Fonction  pour ajouter icône de poubelle sur les photos de la modale
function addTrashIconPhoto() {
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
  });
}

addTrashIconPhoto()

/* Ajout icônes croix (fermeture) sur les photos */
if (!modalWrapper.querySelector(".modal-close")) {
    const modalWrapper = document.querySelector(".modal-wrapper")
    const crossIcon = `
        <button class="modal-close"> <i class="fa-solid fa-xmark"></i> </button>
    `
    modalWrapper.insertAdjacentHTML("beforeend", crossIcon)
}

/* =========================
   Ouverture / Fermeture modale
   ========================= */
let modal = null
const focusableSelector = "button, input, a, textarea, select"
let focusables = []

function resetModalToGalleryView() {
    // Définition constantes
    const currentModalPhotos = document.querySelector(".modal-photos")
    const modalFormElement = document.querySelector(".modal-wrapper form")
    const gobackArrow = document.querySelector(".goback-arrow")
    const errorMessage = document.querySelector(".form-Error")


    if (modalTitle) modalTitle.textContent = "Galerie photo"
    if (currentModalPhotos) currentModalPhotos.classList.remove("is-hidden")
    if (modalFormElement) modalFormElement.remove()
    if (gobackArrow) gobackArrow.remove()
    if (errorMessage) errorMessage.remove()
    modalWrapper.classList.remove("photo-view")

    // Bouton redevient "Ajouter une photo" et reprend son listener d'ouverture
    addPhotoButton.value = "Ajouter une photo";
    addPhotoButton.classList.remove("photo-view");
    addPhotoButton.removeEventListener("click", handleSubmitNewWork);
    addPhotoButton.addEventListener("click", handleOpenAddView);
}

/*Fonction pour l'ouverture de la modale*/
const openModal = function (e) {
    e.preventDefault()
    modal = document.querySelector(e.currentTarget.getAttribute("href"))
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    resetModalToGalleryView()
    modal.classList.add("modal-open")
    modal.removeAttribute("aria-hidden")
    modal.setAttribute("aria-modal", "true")
    modal.addEventListener("click", closeModal)
    modal.querySelector(".modal-close").addEventListener("click", closeModal)
    modal.querySelector(".modal-stop").addEventListener("click", stopPropagation)
}

/*Fonction pour la fermeture de la modale*/
const closeModal = function (e) {
    if (modal === null) return;
    e.preventDefault();
    resetModalToGalleryView()
    modal.classList.remove("modal-open")
    modal.setAttribute("aria-hidden", "true")
    modal.removeAttribute("aria-modal")
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".modal-close").removeEventListener("click", closeModal)
    modal.querySelector(".modal-stop").removeEventListener("click", stopPropagation)
    modal = null
}

/*Fonction pour empêcher que la modale se ferme quand on clique à l'intérieur de la fenêtre modale*/
const stopPropagation = function (e) {
    e.stopPropagation()
}

// Gestion focus
const focusInModal = function (e) {
    e.preventDefault();
    let index = focusables.findIndex((f) => f === modal.querySelector(":focus"))
    if (e.shiftKey === true) index--
    else index++
    if (index >= focusables.length) index = 0
    if (index < 0) index = focusables.length - 1
    focusables[index].focus()
}

/*Gestion de la fermeture de la modale avec la touche Echap*/
window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e)
    }
    if (e.key === "Tab" && modal !== null) {
    focusInModal(e)
    }
})

// Lien qui ouvre la modale
modalLink.addEventListener("click", openModal)

/*Gestion de la fonctionnalité pour la suppression de travaux existant*/
function deleteWorks() {
    const deletePhotosButtons = document.querySelectorAll(".delete-photo")
    deletePhotosButtons.forEach((deletePhotoButton) => {
    deletePhotoButton.addEventListener("click", async (e) => {
        e.preventDefault();
        const workId = deletePhotoButton.dataset.id
        const token = localStorage.getItem("token")
        await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
            })

            // Remove dans modale
            deletePhotoButton.closest("figure").remove()
            // Remove dans galerie principale
            const deleteFigure = document.querySelector(`.gallery figure[data-id="${workId}"]`);
            deleteFigure?.remove()
        })
    })
}

deleteWorks();

/* =========================
   Vue "Ajout photo"
   ========================= */

// 1) Fonction pour ouvrir la modale en vue Ajout photo
function handleOpenAddView(e) {
    e.preventDefault()
    openModalPhotoView()
}

// 2) Fonction pour soumettre le formulaire
async function handleSubmitNewWork(e) {
    e.preventDefault()

    // Récup des éléments du formulaire
    const fileInput = document.querySelector("#file")
    const modalPhotoTitle = document.querySelector("#title")
    const modalCategoryList = document.querySelector("#category")

    // Validation formulaire ?
    if (!validForm()) {
        showErrorMessage()
        return
    }

    /*Envoi d'un nouveau projet à l'API*/
    const token = localStorage.getItem("token")
    const workFormData = new FormData()
    workFormData.append("image", fileInput.files[0])
    workFormData.append("title", modalPhotoTitle.value)
    workFormData.append("category", modalCategoryList.value)

    const responsePostWorks = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: workFormData
    })

    const newWork = await responsePostWorks.json()

    // Insérer nouveau projet dans la galerie principale
    const galleryFigure = `
        <figure data-id="${newWork.id}">
        <img src="${newWork.imageUrl}" alt="${newWork.title}">
        <figcaption>${newWork.title}</figcaption>
        </figure>
    `
    gallery.insertAdjacentHTML("beforeend", galleryFigure)

    // Insérer nouveau projet dans la galerie modale
    const modalFigure = `
        <figure data-id="${newWork.id}">
        <img src="${newWork.imageUrl}" alt="${newWork.title}">
        </figure>
    `
    modalPhotos.insertAdjacentHTML("beforeend", modalFigure)

    // Ajout de l'icône poubelle sur le travail ajouté
    const lastFigure = modalPhotos.querySelector(`figure[data-id="${newWork.id}"]`);
    if (lastFigure && !lastFigure.querySelector(".delete-photo")) {
            const addTrashIconToLastWork = `
                <button class="delete-photo" data-id="${newWork.id}">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `
            lastFigure.insertAdjacentHTML("beforeend", addTrashIconToLastWork)
    }

  // Ajout de l'EventListener sur l'icône poubelle du travail ajouté
  deleteWorks()

  closeModal(e);
}

// 3) Construction de la vue Ajout (formulaire)
function openModalPhotoView() {
    // Nettoyer un éventuel message d’erreur résiduel
    document.querySelector(".form-Error")?.remove()

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

    // Ajout des styles
    addPhotoButton.value = "Valider"
    addPhotoButton.classList.add("photo-view")
    modalWrapper.classList.add("photo-view")

    // Ajout icône de retour vers boite modale préccédente (vue galerie)
    if (!modalWrapper.querySelector(".goback-arrow")) {
        const gobackArrowInsert = `
            <button class="goback-arrow"> <i class="fa-solid fa-arrow-left"></i> </button>
        `
        modalWrapper.insertAdjacentHTML("beforeend", gobackArrowInsert)
    }

    // Ajout liste déroulante des catégories depuis l'API
    const modalCategoryList = document.querySelector("#category")
    for (let i = 0; i < categories.length; i++) {
        const modalCategoryChoice = document.createElement("option")
        modalCategoryChoice.textContent = categories[i].name
        modalCategoryChoice.value = categories[i].id
        modalCategoryList.appendChild(modalCategoryChoice)
    }

    // Ajout EventListener sur chevron pour défilement de la liste - A CORRIGER
    const chevronIcon = document.querySelector("#chevron")
    chevronIcon.addEventListener("click", (e) => {
        e.preventDefault()
        modalCategoryList.focus()
        modalCategoryList.click()
    })

    // Récupération et affichage de l'aperçu de l'image chargée
    const fileInput = document.querySelector("#file")
    const previewImage = document.querySelector("#previewImage")
    const imageIcon = document.querySelector(".fa-image")
    const addFileButton = document.querySelector(".add-file-button")
    const imageType = document.querySelector(".upload-zone p")

    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0]
        const uploadImage = new FileReader()
        uploadImage.onload = (e) => {
            previewImage.src = e.target.result
            previewImage.classList.remove("is-hidden")
            imageIcon.classList.add("is-hidden")
            addFileButton.classList.add("is-hidden")
            imageType.classList.add("is-hidden")
        }
        if (file) uploadImage.readAsDataURL(file)
    })

    // Validation live
    const modalPhotoTitle = document.querySelector("#title");
    function showErrorMessage() {
        const formTitle = document.querySelector("h3")
        // Permet de supprimer l'ancien message d'erreur si plusieurs tentatives de connexion infructueuses
        const oldErrorMessage = document.querySelector(".form-Error")
        if (oldErrorMessage) {
            oldErrorMessage.remove()
        }

        const errorMessage = `
            <p class="form-Error"> Il faut insérer une image, renseigner un titre et choisir une catégorie </p> 
        `
        formTitle.insertAdjacentHTML("afterend", errorMessage)
    }

  function validForm() {
        const errorMessage = document.querySelector(".form-Error")
        if (fileInput.files.length !== 0 && modalPhotoTitle.value.length !== 0 && modalCategoryList.selectedIndex !== 0) {
            addPhotoButton.classList.remove("photo-view")
            if(errorMessage) {
                errorMessage.remove()
            }
            return true
        } else {
            if (!addPhotoButton.classList.contains("photo-view")) {
                addPhotoButton.classList.add("photo-view")
            }
            return false
        }
    }

    fileInput.addEventListener("input",  validForm)
    modalPhotoTitle.addEventListener("input", validForm)
    modalCategoryList.addEventListener("change", validForm)

    window.showErrorMessage = showErrorMessage  
    window.validForm = validForm

    // Ajout EventListener sur flèche pour revenir à la vue modale galerie
    const gobackArrowElement = document.querySelector(".goback-arrow")
    gobackArrowElement.addEventListener("click", (e) => {
        e.preventDefault();
        resetModalToGalleryView();
    })

    // SWAP des listeners du bouton principal :
    addPhotoButton.removeEventListener("click", handleOpenAddView)
    addPhotoButton.addEventListener("click", handleSubmitNewWork)
}

// Attacher UNE SEULE FOIS le listener d’ouverture sur le bouton principal
addPhotoButton.addEventListener("click", handleOpenAddView)
