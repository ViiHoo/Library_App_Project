// ********************* CRÉATION DU SERVEUR NODE ************************

const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require('fs');

const app = express();
const port = 3000;
const serveur = http.createServer(app);

// Démarre le serveur sur le port 3000
serveur.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});


// ********************* GESTION DES MIDDLEWARES ************************

// Sert les fichiers statiques (HTML, CSS, JS, images) depuis le dossier "client"
app.use(express.static(path.join(__dirname, "client")));

// Utilise body-parser pour parser les données JSON et autres types de corps de requêtes
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));


// ********************* ROUTES ************************

// Route pour la page d'accueil (index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

// Route pour récupérer les livres (lecture du fichier JSON)
app.get("/livres", (req, res) => {
  res.header("Content-type", "application/json");
  res.header("Charset", "utf8");
  res.sendFile(path.join(__dirname, "serveur", "donnees", "livres.json"));
});

// Route pour ajouter un livre
app.post("/livres", (req, res) => {
  const nouveauLivre = req.body;
  const fichierLivres = path.join(__dirname, "serveur", "donnees", "livres.json");

  // Lecture du fichier livres.json
  fs.readFile(fichierLivres, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Erreur de lecture du fichier." });
    }

    let livres = JSON.parse(data);

    // Vérifie que l'ID fourni n'existe pas déjà
    const idExiste = livres.some(livre => livre.id === nouveauLivre.id);
    if (idExiste) {
      return res.status(400).json({ success: false, message: "ID déjà existant." });
    }
    
    // Ajoute le nouveau livre à la liste
    livres.push(nouveauLivre);

    // Sauvegarde la nouvelle liste de livres dans le fichier JSON
    fs.writeFile(fichierLivres, JSON.stringify(livres, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Erreur de sauvegarde du fichier." });
      }
      res.status(201).json({ success: true, message: "Livre ajouté avec succès." });
    });
  });
});

// Route pour modifier un livre
app.put("/livres/:id", (req, res) => {
  const livreId = parseInt(req.params.id);
  const livreModifie = req.body;
  const fichierLivres = path.join(__dirname, "serveur", "donnees", "livres.json");

  // Lecture du fichier JSON
  fs.readFile(fichierLivres, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Erreur de lecture du fichier." });
    }

    let livres = JSON.parse(data);
    const index = livres.findIndex(livre => livre.id === livreId);

    // Vérifie si le livre existe
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Livre non trouvé." });
    }

    // Remplace le livre à l’index trouvé
    livres[index] = livreModifie;

    // Écriture du fichier avec les données modifiées
    fs.writeFile(fichierLivres, JSON.stringify(livres, null, 2), (err) => {
      if (err) {
        return res.status(500).send("Erreur de sauvegarde du fichier.");
      }
      res.status(200).json({ success: true, message: "Livre modifié avec succès." });
    });
  });
});

// Route pour supprimer un livre
app.delete("/livres/:id", (req, res) => {
  const livreId = parseInt(req.params.id);
  const fichierLivres = path.join(__dirname, "serveur", "donnees", "livres.json");

  // Lecture du fichier JSON
  fs.readFile(fichierLivres, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send("Erreur de lecture du fichier.");
    }

    let livres = JSON.parse(data);
    const index = livres.findIndex(livre => livre.id === livreId);

    // Vérifie si le livre existe
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Livre non trouvé." });
    }

    // Supprime le livre de la liste
    livres.splice(index, 1);  // Supprimer le livre

    // Écrit la nouvelle liste dans le fichier JSON
    fs.writeFile(fichierLivres, JSON.stringify(livres, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Erreur de sauvegarde du fichier." });
      }
      res.status(200).json({ success: true, message: "Livre supprimé avec succès." });
    });
  });
});