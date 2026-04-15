import "./style.css";
import { saveTodos, loadTodos } from "./storage.js";

/**
 * 1. INITIALISATION & ÉLÉMENTS DU DOM
 */
const ul = document.querySelector("ul");
const form = document.querySelector("form");
const input = document.querySelector("form > input");

// Logique de chargement : si rien en mémoire, on met la tâche par défaut
const savedData = loadTodos();
const todos = savedData
  ? savedData
  : [
      {
        text: "Faire du JavaScript",
        done: false,
        editMode: false,
      },
    ];

/**
 * 2. GESTIONNAIRES D'ÉVÉNEMENTS GÉNÉRAUX (LISTENERS)
 */

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = input.value;
  input.value = "";
  addTodo(value);
});

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

const displayTodo = () => {
  const todosNode = todos.map((todo, index) => {
    return todo.editMode
      ? createTodoEditElement(todo, index)
      : createTodoElement(todo, index);
  });
  ul.innerHTML = "";
  ul.append(...todosNode);
};

const createTodoElement = (todo, index) => {
  const li = document.createElement("li");

  const buttonDelete = document.createElement("button");
  buttonDelete.innerHTML = "Supprimer";
  buttonDelete.classList.add("danger");
  buttonDelete.addEventListener("click", (event) => {
    event.stopPropagation();
    deleteTodo(index);
  });

  const buttonEdit = document.createElement("button");
  buttonEdit.innerHTML = "Edit";
  buttonEdit.classList.add("primary");
  buttonEdit.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleEditMode(index);
  });

  li.innerHTML = `
    <span class="todo ${todo.done ? "done" : ""}"></span>
    <p class="${todo.done ? "done" : ""}">${todo.text}</p>
  `;

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

const createTodoEditElement = (todo, index) => {
  const li = document.createElement("li");
  const inputEdit = document.createElement("input");
  inputEdit.type = "text";
  inputEdit.value = todo.text;

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
      text: `${text[0].toUpperCase()}${text.slice(1)}`,
      done: false,
      editMode: false,
    });
    saveTodos(todos);
    displayTodo();
  }
};

const deleteTodo = (index) => {
  todos.splice(index, 1);
  saveTodos(todos);
  displayTodo();
};

const toggleTodo = (index) => {
  todos[index].done = !todos[index].done;
  saveTodos(todos);
  displayTodo();
};

const toggleEditMode = (index) => {
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
    saveTodos(todos);
    displayTodo();
  }
};

displayTodo();
