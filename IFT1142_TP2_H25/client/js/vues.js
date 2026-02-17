let livres = []; // Variable globale pour stocker la liste des livres récupérés du serveur

// Fonction pour afficher les livres
const afficherLivres = async () => {
    try {
        const response = await fetch('/livres'); // Requête GET vers le serveur
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        livres = await response.json(); // Stocker les livres dans la variable globale
        console.log(livres); // Debug : affiche les livres dans la console

        let liste = `<div class="row">`;
        livres.forEach((livre, index) => {
            liste += creerCardLivre(livre, index); // Créer la carte de chaque livre
        });
        liste += `</div>`;

        document.getElementById("contenuLivres").innerHTML = liste; // Affiche les cartes dans la page
    } catch (error) {
        console.error("Erreur lors du chargement des livres :", error);
        alert("Erreur lors du chargement des livres.");
    }
};

// Fonction pour créer une carte de livre
const creerCardLivre = (livre, index) => {
    return `
        <div class="col-md-3">
            <div class="card mb-3">
                <img src="images/pochettes/${livre.pochette}" class="card-img-top" alt="Image de ${livre.titre}">
                <div class="card-body">
                    <h5 class="card-title">${livre.titre}</h5>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">ID Livre: ${livre.id}</li>
                    <li class="list-group-item">ID Auteur: ${livre.idAuteur}</li>
                    <li class="list-group-item">Année: ${livre.annee}</li>
                    <li class="list-group-item">Nombre de pages: ${livre.pages}</li>
                    <li class="list-group-item">Catégorie: ${livre.categorie.charAt(0).toUpperCase() + livre.categorie.slice(1).toLowerCase()}</li>
                </ul>
                <div class="card-body text-center">
                    <button class="btn btn-sm btn-warning" onclick="modifierLivre(${index});"><i class="bi bi-pencil-square"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="afficherToast(${index});"><i class="bi bi-trash"></i></button>
                </div>
            </div>
        </div>
    `;
};

// Fonction pour afficher ou cacher le champ "Autre" selon la catégorie choisie lors de l'ajout
function verifierAutreCategorie() {
    var categorieSelect = document.getElementById("categorie");
    var categorieAutreInput = document.getElementById("categorieAutre");

    if (categorieSelect && categorieAutreInput) {
        // Vérifier si "Autre" a été sélectionné
        if (categorieSelect.value === "autre") {
            // Afficher le champ de saisie pour la catégorie "Autre"
            document.getElementById("champCategorieAutre").style.display = "block"; // Affiche champ personnalisé
        } else {
            // Cacher le champ de saisie si une autre catégorie est choisie
            document.getElementById("champCategorieAutre").style.display = "none"; // Cache le champ
        }
    } else {
        console.error("Les éléments 'categorie' ou 'categorieAutre' n'ont pas été trouvés.");
    }
}

// Fonction similaire pour l'affichage du champ "Autre" lors de la modification
function verifierAutreCategorieModif() {
    var categorieSelect = document.getElementById("categorieModif");
    var categorieAutreInput = document.getElementById("champCategorieAutreModif");
  
    if (categorieSelect.value === "autre") {
      categorieAutreInput.style.display = "block";
    } else {
      categorieAutreInput.style.display = "none";
    }
  }

// Fonction pour filtrer les livres par catégorie
const filtrerParCategorie = () => {
    const categorieFiltree = prompt("Entrez la catégorie à filtrer :");
    if (categorieFiltree) {
        const livresFiltres = livres.filter(livre => 
            livre.categorie.toLowerCase().includes(categorieFiltree.toLowerCase())
        );
        afficherLivresFiltres(livresFiltres);
    }
};

// Fonction pour filtrer les livres publiés après une certaine année
const filtrerParAnnee = () => {
    const anneeFiltree = prompt("Entrez l'année à partir de laquelle filtrer les livres :");
    if (anneeFiltree) {
        const livresFiltres = livres.filter(livre => livre.annee > parseInt(anneeFiltree));
        afficherLivresFiltres(livresFiltres);
    }
};

// Fonction pour filtrer les livres par ID d'auteur
const filtrerParAuteur = () => {
    const auteurFiltre = prompt("Entrez l'ID de l'auteur à filtrer :");
    if (auteurFiltre) {
        const livresFiltres = livres.filter(livre => livre.idAuteur === parseInt(auteurFiltre));
        afficherLivresFiltres(livresFiltres);
    }
};

// Fonction pour afficher une liste de livres donnée (filtrée ou triée)
const afficherLivresFiltres = (livresFiltres) => {
    if (livresFiltres.length === 0) {
        document.getElementById("contenuLivres").innerHTML = `<p class="text-center">Aucun livre trouvé.</p>`;
        return;
    }

    let liste = `<div class="row">`;
    livresFiltres.forEach((livre, index) => {
        liste += creerCardLivre(livre, index);
    });
    liste += `</div>`;
    document.getElementById("contenuLivres").innerHTML = liste;
};

// Fonction pour trier les livres selon un critère donné (ex: année, pages, titre)
function trierLivres(critere, croissant) {
    const livresFiltres = [...livres].sort((a, b) => {
         // Comparaison avec localeCompare pour les chaînes de caractères
         if (typeof a[critere] === 'string' && typeof b[critere] === 'string') {
            return a[critere].localeCompare(b[critere]);
        }
        // Comparaison numérique pour les autres critères (par exemple, année, pages)
        if (a[critere] < b[critere]) return -1;
        if (a[critere] > b[critere]) return 1;
        return 0;
    });

    // Si l'ordre est décroissant, inverser l'ordre trié
    if (!croissant) {
        livresFiltres.reverse();
    }

    // Afficher les livres triés
    afficherLivresFiltres(livresFiltres);
}

// Fonction pour initialiser la page
function init() {
    verifierAutreCategorie(); // Vérifier la sélection
}

// Appeler la fonction init directement à la fin du script
init();
