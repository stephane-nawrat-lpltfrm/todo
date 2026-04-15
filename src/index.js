import "./style.css";

/**
 * 1. INITIALISATION & ÉLÉMENTS DU DOM
 */
const ul = document.querySelector("ul");
const form = document.querySelector("form");
const input = document.querySelector("form > input");

const todos = [
  {
    text: "Faire du JavaScript",
    done: false,
    editMode: false,
  },
];

/**
 * 2. GESTIONNAIRES D'ÉVÉNEMENTS GÉNÉRAUX (LISTENERS)
 */

// Ajout d'une todo via le formulaire
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = input.value;
  input.value = "";
  addTodo(value);
});

// Sortie du mode édition avec la touche 'Echap'
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const todoInEdit = todos.find((t) => t.editMode);
    if (todoInEdit) {
      todoInEdit.editMode = false;
      displayTodo();
    }
  }
});

/**
 * 3. LOGIQUE D'AFFICHAGE (RENDERING)
 */

// Fonction principale : vide la liste et reconstruit le DOM
const displayTodo = () => {
  const todosNode = todos.map((todo, index) => {
    // Rendu conditionnel selon l'état editMode
    return todo.editMode
      ? createTodoEditElement(todo, index)
      : createTodoElement(todo, index);
  });
  ul.innerHTML = "";
  ul.append(...todosNode);
};

// Mode Lecture : Affiche la tâche normalement
const createTodoElement = (todo, index) => {
  const li = document.createElement("li");

  // Bouton Supprimer
  const buttonDelete = document.createElement("button");
  buttonDelete.innerHTML = "Supprimer";
  buttonDelete.classList.add("danger");
  buttonDelete.addEventListener("click", (event) => {
    event.stopPropagation(); // Évite de déclencher le toggle du li
    deleteTodo(index);
  });

  // Bouton Editer
  const buttonEdit = document.createElement("button");
  buttonEdit.innerHTML = "Edit";
  buttonEdit.classList.add("primary");
  buttonEdit.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleEditMode(index);
  });

  // Contenu texte et statut
  li.innerHTML = `
    <span class="todo ${todo.done ? "done" : ""}"></span>
    <p class="${todo.done ? "done" : ""}">${todo.text}</p>
  `;

  // Gestion du Simple clic (Toggle statut) vs Double clic (Mode Edition)
  let timer;
  li.addEventListener("click", (event) => {
    if (event.detail === 1) {
      timer = setTimeout(() => toggleTodo(index), 200);
    } else if (event.detail > 1) {
      clearTimeout(timer);
      toggleEditMode(index);
    }
  });

  li.append(buttonEdit, buttonDelete);
  return li;
};

// Mode Édition : Affiche l'input de modification
const createTodoEditElement = (todo, index) => {
  const li = document.createElement("li");
  const inputEdit = document.createElement("input");
  inputEdit.type = "text";
  inputEdit.value = todo.text;

  // Sauvegarde sur touche Entrée
  inputEdit.addEventListener("keydown", (event) => {
    if (event.key === "Enter") editTodo(index, inputEdit);
  });

  const buttonSave = document.createElement("button");
  buttonSave.innerHTML = "Save";
  buttonSave.classList.add("success");
  buttonSave.addEventListener("click", () => editTodo(index, inputEdit));

  const buttonCancel = document.createElement("button");
  buttonCancel.innerHTML = "Cancel";
  buttonCancel.classList.add("danger");
  buttonCancel.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleEditMode(index);
  });

  li.append(inputEdit, buttonSave, buttonCancel);

  // Autofocus sur l'input dès qu'il apparaît
  setTimeout(() => inputEdit.focus(), 0);

  return li;
};

/**
 * 4. ACTIONS SUR LE STATE (DATA)
 */

const addTodo = (text) => {
  text = text.trim();
  if (text) {
    todos.push({
      // Petite astuce : Capitalize la première lettre
      text: `${text[0].toUpperCase()}${text.slice(1)}`,
      done: false,
      editMode: false,
    });
    displayTodo();
  }
};

const deleteTodo = (index) => {
  todos.splice(index, 1);
  displayTodo();
};

const toggleTodo = (index) => {
  todos[index].done = !todos[index].done;
  displayTodo();
};

const toggleEditMode = (index) => {
  // Désactive les autres modes édition pour n'en avoir qu'un à la fois
  todos.forEach((t, i) => {
    if (i !== index) t.editMode = false;
  });
  todos[index].editMode = !todos[index].editMode;
  displayTodo();
};

const editTodo = (index, input) => {
  const value = input.value.trim();
  if (value) {
    todos[index].text = value;
    todos[index].editMode = false;
    displayTodo();
  }
};

// Premier rendu au chargement
displayTodo();
