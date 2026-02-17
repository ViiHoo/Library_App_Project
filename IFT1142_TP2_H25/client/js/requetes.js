// Variable pour vérifier si on est en mode modification (true = modification, false = ajout)
let modeModification = false;

// Fonction pour ajouter un livre
async function ajouterLivre() {
    // Récupérer la catégorie sélectionnée
    let categorieSelectionnee = document.getElementById('categorie').value;

    // Si l'utilisateur a sélectionné "autre", vérifier l'entrée personnalisée
    if (categorieSelectionnee === 'autre') {
        const inputAutre = document.getElementById('categorieAutre').value.trim();
        if (!inputAutre) {
            alert("Veuillez spécifier une catégorie.");
            return;
        }
        categorieSelectionnee = inputAutre; // Remplacer par la valeur saisie
    }

    // Récupération des valeurs du formulaire
    const id = parseInt(document.getElementById('idLivre').value);
    const titre = document.getElementById('titre').value.trim();
    const idAuteur = parseInt(document.getElementById('idAuteur').value);
    const annee = parseInt(document.getElementById('annee').value);
    const pages = parseInt(document.getElementById('pages').value);

    // Création de l'objet livre à envoyer au serveur
    const livre = {
        id: id,
        titre: titre,
        idAuteur: idAuteur,
        annee: annee,
        pages: pages,
        categorie: categorieSelectionnee,
        pochette: `Pochette_${idAuteur}_${id}.jpg` // Nom de fichier basé sur l'auteur et l'id
    };

    // Vérification de la validité des champs
    if (
        titre === '' ||
        isNaN(id) || id < 0 ||
        isNaN(idAuteur) || idAuteur < 0 ||
        isNaN(annee) || annee < 0 ||
        isNaN(pages) || pages < 0
    ) {
        alert("Tous les champs doivent être remplis correctement avec des valeurs valides (≥ 0).");
        return;
    }

    // Envoi de la requête d'ajout au serveur via POST
    try {
        const response = await fetch('/livres', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(livre)
        });

        const data = await response.json();

        if (data.success) {
            afficherLivres(); // Actualiser l'affichage des livres
            $('#idModalAjouterLivre').modal('hide'); // Fermer le modal d'ajout
            document.getElementById("formAjoutLivre").reset(); // Réinitialiser les champs du formulaire
            document.getElementById("champCategorieAutre").style.display = "none"; // Cacher le champ "autre"

            // Afficher un toast de succès
            const toast = new bootstrap.Toast(document.getElementById('toastSuccès'));
            toast.show(); // Afficher un message de succès
        } else {
            alert("Erreur lors de l'ajout du livre.");
        }

    } catch (error) {
        console.error('Erreur d\'ajout :', error);
        alert("Erreur lors de l'ajout du livre.");
    }
}


// Fonction pour supprimer un livre
async function supprimerLivre(id) {
    try {
        const response = await fetch(`/livres/${id}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            afficherLivres(); // Actualiser l'affichage après suppression
        } else {
            alert("Erreur lors de la suppression du livre.");
        }
    } catch (error) {
        console.error('Erreur de suppression :', error);
        alert("Erreur lors de la suppression du livre.");
    }
}

// Fonction pour gérer la confirmation de suppression
function afficherToast(index) {
    const livre = livres[index];
    const toast = new bootstrap.Toast(document.getElementById('toastSuppression'));

    toast.show(); // Affichage du toast de confirmation de suppression

    // Lorsqu'on clique sur "Oui" dans le toast, on supprime le livre
    document.querySelector('.btn-light').onclick = () => {
        supprimerLivre(livre.id);
        toast.hide(); // Cacher le toast manuellement
    };
}


// Fonction pour modifier un livre
function modifierLivre(index) {
    const livre = livres[index];

    document.getElementById('titreModif').value = livre.titre;
    document.getElementById('idLivreModif').value = livre.id;
    document.getElementById('idAuteurModif').value = livre.idAuteur;
    document.getElementById('anneeModif').value = livre.annee;
    document.getElementById('pagesModif').value = livre.pages;

    const categorieSelect = document.getElementById('categorieModif');
    const autreInput = document.getElementById('categorieAutreModif');

    // Gérer les catégories connues vs personnalisées
    if (["bandes dessinées", "nouvelle", "roman", "suspense"].includes(livre.categorie.toLowerCase())) {
        categorieSelect.value = livre.categorie.toLowerCase();
        autreInput.value = "";
        document.getElementById('champCategorieAutreModif').style.display = "none";
    } else {
        categorieSelect.value = "autre";
        autreInput.value = livre.categorie;
        document.getElementById('champCategorieAutreModif').style.display = "block";
    }

    // Affiche le modal de modification
    $('#idModalModifierLivre').modal('show');
}
  
// Fonction pour mettre à jour les informations d'un livre
async function mettreAJourLivre() {
    // Gestion des catégories
    let categorie = document.getElementById('categorieModif').value;
    if (categorie === 'autre') {
      const autre = document.getElementById('categorieAutreModif').value.trim();
      if (!autre) {
        alert("Veuillez entrer une catégorie.");
        return;
      }
      categorie = autre;
    }

    const id = parseInt(document.getElementById('idLivreModif').value);
  
    // Création de l'objet livre à mettre à jour
    const livre = {
        id: id,
        titre: document.getElementById('titreModif').value,
        idAuteur: parseInt(document.getElementById('idAuteurModif').value),
        annee: parseInt(document.getElementById('anneeModif').value),
        pages: parseInt(document.getElementById('pagesModif').value),
        categorie: categorie,
        pochette: `Pochette_${document.getElementById('idAuteurModif').value}_${document.getElementById('idLivreModif').value}.jpg`
    };
  
    const idLivre = livre;
  
    // Envoi de la requête PUT pour mise à jour
    try {
      const response = await fetch(`/livres/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(livre)
      });
  
      const data = await response.json();
  
      if (data.success) {
        afficherLivres(); // Rafraîchir l'affichage
        const toast = new bootstrap.Toast(document.getElementById('toastSuccès'));
        toast.show(); // Affiche un message de succès
        $('#idModalModifierLivre').modal('hide'); // Fermer le modal
      } else {
        alert("Erreur lors de la mise à jour du livre.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur de communication avec le serveur.");
    }
  }
  

// Fonction pour gérer l'envoi du formulaire
async function submitForm(event) {
    event.preventDefault();  // Empêche le rechargement de la page

    if (modeModification) {
        await mettreAJourLivre();  // Appelle la fonction de mise à jour si mode modification
        modeModification = false;  // Réinitialiser après modification
    } else {
        await ajouterLivre();  // Appelle la fonction d'ajout si mode ajout
    }
}

// Écouteurs d'événements pour l'envoi des formulaires une fois le DOM chargé
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('formAjoutLivre').addEventListener('submit', submitForm);
  document.getElementById('formModifierLivre').addEventListener('submit', async (e) => {
    e.preventDefault();
    await mettreAJourLivre(); // Gère la soumission du formulaire de modification
  });
});
