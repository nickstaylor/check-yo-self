var roughDraftSection = document.querySelector(".rough-draft-card");
var roughDraftTask = document.querySelector(".task-item");
var asideButtons = document.querySelector(".aside-section");
var taskDisplayArea = document.querySelector(".task-container");
var taskTitleBox = document.querySelector(".task-title");
var initialGreeting = document.querySelector(".initial-greeting");
var searchInput = document.querySelector(".search-input");
var filterButton = document.querySelector(".filter");
var roughDraftTasks = [];
var allToDoLists = [];

asideButtons.addEventListener("click", clickAsideButtons);
roughDraftSection.addEventListener("click", deleteRoughDraftTask);
taskDisplayArea.addEventListener("click", modifyTasks);
searchInput.addEventListener("keyup", searchTasks);
filterButton.addEventListener("click", filterUrgentTasks);
window.onload = retrieveToDosFromStorage;

function retrieveToDosFromStorage() {
  let localStorageLists = localStorage.getItem("allLists");
  var retrievedLists = JSON.parse(localStorageLists);
  if (!retrievedLists.length) {
    initialGreeting.classList.remove("hide");
    return;
  }
  initialGreeting.classList.add("hide");
  for (var i = 0; i < retrievedLists.length; i++) {
    let tasksArray = []
    retrievedLists[i].tasks.forEach(task => {
      var newTask = new Task(task.taskName, task.id, task.completed)
      tasksArray.push(newTask)
    })
    var list = new ToDoList(
      retrievedLists[i].id,
      retrievedLists[i].title,
      tasksArray,
      retrievedLists[i].urgent
    );
    allToDoLists.push(list);
    displayCard(list);
  }
}

function searchTasks() {
  let userInput = searchInput.value.trim().toLowerCase();
  console.log(userInput);
  let allTaskCards = Array.from(document.querySelectorAll(".taskbox"));
  allTaskCards.forEach((task) => {
    var todoTitle = task.querySelector("#taskbox-title");
    if (!todoTitle.innerText.toLowerCase().includes(userInput)) {
      task.classList.add("hidden");
    } else {
      task.classList.remove("hidden");
    }
  });
}

function filterUrgentTasks() {
  let allTaskCards = Array.from(document.querySelectorAll(".top-of-taskbox"));
  allTaskCards.forEach((task) => {
    if (!task.classList.contains("urgent-style")) {
      task.parentNode.classList.toggle("hidden");
    } 
  });
}

function clickAsideButtons(event) {
  var target = event.target.classList;
  if (target.contains("add-task-button")) {
    addRoughDraftTasks();
  }
  if (target.contains("make-list-btn")) {
    makeList();
  }
  if (target.contains("clear-all-btn")) {
    clearAllAside();
  }
}

function clearAllAside() {
  roughDraftSection.innerText = "";
  taskTitleBox.value = "";
  roughDraftTasks = [];
}

function deleteRoughDraftTask(event) {
  for (var i = 0; i < roughDraftTasks.length; i++) {
    var textToRemove = event.target.nextSibling.dataset.id;
    var textNumber = parseInt(textToRemove);
    if (textNumber === roughDraftTasks[i].id) {
      roughDraftTasks.splice(i, 1);
    }
  }
  if (event.target.className === "delete-btn-rough") {
    event.target.parentNode.remove();
  }
}

function modifyTasks(event) {
  if (event.target.closest(".checkbox-btn")) {
    checkOffTasks();
  }
  if (event.target.closest(".urgent")) {
    urgentButton();
  }
}

function updateTaskTitle() {
  let currentTitle = event.target;
  currentTitle.classList.add("hidden");
  currentTitle.nextSibling.nextSibling.classList.remove("hidden");
  currentTitle.parentNode.firstElementChild.classList.add("hidden");
  currentTitle.nextSibling.nextSibling.nextSibling.nextSibling.classList.remove("hidden");
}

function changeTaskTitle(id) {
  let updatedTitle = event.target.closest(".top-of-taskbox").children[2].value;
  if (!updatedTitle) {
    updatedTitle = event.target.closest(".top-of-taskbox").children[2]
      .placeholder;
  }
  let currentTaskList = findCurrentTaskList(id);
  allToDoLists.forEach((list) => {
    if (list.id === parseInt(id)) {
      list.title = updatedTitle
    }
  });
  let currentTitle = event.target;
  currentTitle.classList.add("hidden");
  currentTitle.parentNode.children[0].classList.remove("hidden")
  currentTitle.parentNode.children[0].innerText = updatedTitle
  currentTitle.parentNode.children[1].classList.remove("hidden")
  currentTitle.parentNode.children[2].classList.add("hidden")
  currentTitle.parentNode.children[2].placeholder = updatedTitle;


  currentTaskList.saveToStorage();

}

function checkOffTasks() {
  var listImage = event.target;
  if (listImage.src.match("images/checkbox.svg")) {
    listImage.src = "images/checkbox-active.svg";
  } else {
    listImage.src = "images/checkbox.svg";
  }
  listImage.parentNode.classList.toggle("task-list-checked");
  let taskId = event.target.dataset.id;
  let taskListId = event.target.closest(".taskbox").dataset.id;
  let currentTaskList = findCurrentTaskList(taskListId);

  let currentTask = currentTaskList.tasks.find(task => task.id === parseInt(taskId));
  currentTask.updateTask();
  currentTaskList.saveToStorage();

}

function urgentButton() {
  var target = event.target.parentNode;
  var taskBox = target.parentNode.parentNode;
  if (event.target.src.match("images/urgent.svg")) {
    event.target.src = "images/urgent-active.svg";
  } else {
    event.target.src = "images/urgent.svg";
  }
  //changes font to urgent
  target.classList.toggle("urgent-font");
  //changes bottom to urgent
  target.parentNode.classList.toggle("urgent-style");
  // changes top to urgent
  target.parentNode.parentNode.firstElementChild.classList.toggle(
    "urgent-style"
  );
  // changes input background to match
  target.parentNode.parentNode.firstElementChild.
    firstElementChild.nextSibling.nextSibling.
    nextSibling.nextSibling.classList.toggle("urgent-style");
  // changes the middle part to urgent
  target.parentNode.parentNode.firstElementChild.nextSibling.nextSibling.classList.toggle(
    "urgent-style"
  );
  // let allTasks = Array.from(document.querySelectorAll(`${taskBox.dataset.id}`));
  let allTasks = Array.from(document.getElementsByClassName(`${taskBox.dataset.id}`));
  allTasks.forEach(task => task.classList.toggle("urgent-style"))
  for (var i = 0; i < allToDoLists.length; i++) {
    if (parseInt(taskBox.dataset.id) === allToDoLists[i].id) {
      allToDoLists[i].updateUrgency();
    }
  }
}

function makeList() {
  var taskTitle = taskTitleBox.value;
  initialGreeting.classList.add("hide");
  if (taskTitle === "" || roughDraftTasks.length === 0) {
    return;
  }
  var newList = new ToDoList(Date.now(), taskTitle, roughDraftTasks);
  allToDoLists.push(newList);
  newList.saveToStorage();
  displayCard(newList);
}

function findCurrentTaskList(id) {
  return allToDoLists.find(list=> list.id === parseInt(id))
}

function deleteTaskList(id) {
  
  let currentTaskList = findCurrentTaskList(id)

  let updatedLists = allToDoLists.filter((list) => list.id !== id);
  allToDoLists = updatedLists;
  if (!allToDoLists.length) {
    initialGreeting.classList.remove("hide");
  }
  currentTaskList.deleteFromStorage()
  event.target.closest(".taskbox").remove();

}

function displayCard(list) {
  let tasksDisplayed = loadAllTasksToTaskList(list);

  taskDisplayArea.insertAdjacentHTML(
    "beforeend",
    `
  <section class="taskbox" data-id=${list.id}>
    <div class="top-of-taskbox ${list.urgent && "urgent-style"}">
      <p id="taskbox-title">${list.title}</p>
      <img src="images/create-outline.svg" class="edit-task-title" alt="edit-button"
      onclick="updateTaskTitle()" />
      <input class="hidden title-input ${list.urgent && "urgent-style"}" placeholder="${list.title}" />
      <img class="hidden " id="save-task-title" src="images/save-outline.svg" alt="save-button"
      onclick="changeTaskTitle(${list.id})" />
    </div>
    <div class="task-list ${list.urgent && "urgent-style"}">
        ${tasksDisplayed}
    </div>
    <div class="bottom-of-taskbox ${list.urgent && "urgent-style"}">
      <div class="urgent-button ${list.urgent && "urgent-font"}">
        <img class="urgent" 
        src=${list.urgent ? "images/urgent-active.svg" : "images/urgent.svg"}>
        <p>URGENT</p>
      </div>
      <div class="delete-button-task" onclick="deleteTaskList(${list.id})">
        <img src="images/delete.svg">
        <p>DELETE</p>
    </div>
  </section>`
  );
  clearAllAside();
}

function loadAllTasksToTaskList(list) {
  let tasksDisplayed = "<ul>";
  for (var i = 0; i < list.tasks.length; i++) {
    var image = `<img src="${
      list.tasks[i].completed
        ? "images/checkbox-active.svg"
        : "images/checkbox.svg"
    }"
    alt="checkbox button" class="checkbox-btn" data-completed=${
  list.tasks[i].completed} data-id=${list.tasks[i].id} />`;
    tasksDisplayed =
      tasksDisplayed +
      `<li class="list-item ${
        list.tasks[i].completed && "task-list-checked"
      }">` +
      image +
      `<p class="ind-task" onclick="editTask()">${list.tasks[i].taskName}</p>
        <input class="hidden task-input ${list.id} ${list.urgent && "urgent-style"}" 
         placeholder="${list.tasks[i].taskName}" />
        <img class="hidden" id="save-task" src="images/save-outline.svg" alt="save-button"
      onclick="saveEditedTask(${list.tasks[i].id})" />
        ` +
      "</li>";
  }
  tasksDisplayed = tasksDisplayed + "</ul>";
  return tasksDisplayed;
}

function editTask() {
  let currentTask = event.target;
  currentTask.classList.add("hidden");
  currentTask.nextSibling.nextSibling.classList.remove("hidden");
  currentTask.nextSibling.nextSibling.
    nextSibling.nextSibling.classList.remove("hidden");
}

function addRoughDraftTasks() {
  if (roughDraftTask.value === "") {
    window.alert("Please Enter a Task");
    return;
  }
  var task = new Task(roughDraftTask.value);
  roughDraftSection.insertAdjacentHTML(
    "beforeend",
    `
  <div class="roughdraftitem"><img src="images/delete.svg"
  alt="delete button" class="delete-btn-rough" /><p data-id=${task.id}>${task.taskName}</p></div>`
  );
  roughDraftTasks.push(task);
  roughDraftTask.value = "";
  document.querySelector(".task-item").focus();
}
