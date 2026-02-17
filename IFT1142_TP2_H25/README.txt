Avant de débuter, il faut installer les node_modules.
Pour ce faire, allez dans la console et tapez :

npm install

(Cet instruction va lire le fichier package.json et installer tous les modules)


Ensuite, pour accéder au site de l'application Web,

1- Ouvrir un nouveau terminal en mode "Command Prompt"
2- Tapez dans le terminal : node serveur_web.js
3- Accéder au site via http://localhost:3000/


Note supplémentaire :

Dans le dossier des pochettes de livres du côté client, j'ai insérer une pochette générique 
"Pochette_0_404.jpg". Cela veut donc dire que, lors de l'ajout d'un livre dans le Web App, 
il est possible d'entrer n'importe quelle valeur dans les champs du formulaire du modal, mais
pour que l'image générique du livre ajouté apparaisse dans la liste, il faut obligatoirement 
entrer "404" comme valeur pour ID Livre, et "0" comme valeur pour ID Auteur, sinon il y aura
un problème lors du chargement de l'image. Cela arrive en raison de la façon dont les pochettes
sont chargées du côté client.