# Spécifications Techniques : Architecture Todo  (Vanilla JS)

## 1. Lexique et Fondamentaux Techniques
Pour expliquer ce projet, il est essentiel d'utiliser les termes précis qui définissent la structure du code.

### La boîte à outils JavaScript (ES6+)
Constante (const) : Utilisée pour déclarer les éléments du DOM et les fonctions. Contrairement à let, elle empêche la réassignation, garantissant que la logique de base reste stable et immuable.

Fonction Fléchée (() => {}) : Syntaxe moderne pour définir des blocs de logique. Elle est plus concise et prévisible car elle ne redéfinit pas son propre contexte this.

State (État) : Représenté ici par le tableau todos. C'est l'unique source de vérité. L'interface (le HTML) n'est qu'un miroir de ce tableau à un instant T.

### Manipulation du DOM (Document Object Model)
querySelector() : La méthode permettant de cibler les éléments HTML. C'est le pont de contact entre le JavaScript et l'interface utilisateur.

createElement() : Crée un nœud HTML en mémoire. Cette méthode est préférée à innerHTML car elle permet d'attacher des écouteurs d'événements directement sur l'objet JS avant qu'il ne soit visible.

append() : Méthode d'insertion qui place l'élément créé à l'intérieur de son parent (ex: ajouter un li dans le ul).

## 2. Architecture : Le Modèle "State-Driven UI"
Le projet suit un flux de données rigoureux pour éviter les désynchronisations entre le code et l'affichage.

L'Action : L'utilisateur interagit (clic, saisie).

La Modification du State : On met à jour le tableau d'objets todos.

Le Rendu (Re-render) : La fonction displayTodo() vide le conteneur HTML (ul.innerHTML = "") et reconstruit la liste complète à partir du State mis à jour.

Justification technique : Bien que redessiner toute la liste puisse sembler moins optimal qu'une modification chirurgicale, cela garantit une fiabilité totale. L'interface ne peut jamais afficher une donnée qui n'existe pas dans le tableau.

## 3. Logique du CRUD (Détail des Fonctions)
### 🟢 Create (Ajouter)
L'ajout capte la valeur de l'input utilisateur.

Traitement : Utilisation de .trim() pour supprimer les espaces inutiles et capitalisation de la première lettre pour la propreté des données.

Structure : Chaque tâche est un objet : { text, done, editMode }.

### Read (Afficher)
La fonction de rendu itère sur le tableau via une boucle. Elle utilise un Rendu Conditionnel :

Si todo.editMode === true : Elle génère un formulaire d'édition.

Sinon : Elle génère l'affichage classique de la tâche.

### Update (Modifier)
La modification est une bascule d'état en deux étapes :

Activation : On passe editMode à true. L'interface change visuellement (bascule texte -> input).

Validation : À la sauvegarde, on met à jour todo.text et on repasse editMode à false.

### Delete (Supprimer)
Utilisation de la méthode splice(index, 1). L'index est passé en argument à la fonction pour cibler l'élément exact dans le tableau.

## 4. Concepts Avancés et Résolution de Problèmes
### Gestion de la Propagation (stopPropagation)
Lorsqu'un bouton est imbriqué dans un élément parent (le li), cliquer sur le bouton déclenche également l'événement du parent : c'est le Bubbling (remontée de bulles).

Solution : event.stopPropagation() est utilisé sur les boutons pour isoler l'action et empêcher que la tâche ne soit marquée comme "complétée" par erreur lors d'une suppression.

### Le Cycle de Focus (setTimeout 0)
Lors du passage en mode édition, l'élément input est créé par le code, mais le navigateur ne l'a pas encore totalement "peint" à l'écran.

Astuce technique : setTimeout(() => input.focus(), 0) place la demande de focus à la fin de la file d'attente. Cela garantit que l'élément est prêt et visible avant de recevoir le curseur.

### Persistance (LocalStorage)
Le localStorage est une API de stockage qui ne gère que les chaînes de caractères (Strings).

Sérialisation : JSON.stringify(todos) transforme nos objets complexes en texte.

Désérialisation : JSON.parse(data) reconstruit les objets JavaScript lors du rechargement de la page.

## 5. Pourquoi cette méthode ? (Arguments Oral)
Maintenabilité : La séparation nette entre les Données (storage.js) et la Vue (index.js) permet de modifier l'une sans casser l'autre.

Préparation à React : Ce concept de "State" et de "Rendu dynamique" est le fondement exact des frameworks modernes.

Robustesse : En gérant l'état de manière centralisée, le débogage est simplifié : si l'affichage est faux, c'est forcément que le State (le tableau) est faux.