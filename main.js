var roughDraftSection = document.querySelector(".rough-draft-card");
var roughDraftTask = document.querySelector(".task-item");
var asideButtons = document.querySelector(".aside-section");
var taskDisplayArea = document.querySelector(".task-container");
var taskTitleBox = document.querySelector(".task-title");
var initialGreeting = document.querySelector(".initial-greeting");
var searchInput = document.querySelector(".search-input");
var filterButton = document.querySelector(".filter");
var roughDraftTasks = [];
var localStorageArray = [];

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
    localStorageArray.push(list);
    displayCard(list);
  }
}

function searchTasks() {
  let userInput = searchInput.value.trim();
  let allTaskCards = Array.from(document.querySelectorAll(".taskbox"));
  allTaskCards.forEach((task) => {
    var todoTitle = task.querySelector("#taskbox-title");
    if (!todoTitle.innerText.includes(userInput)) {
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


function checkOffTasks() {
  var listImage = event.target;
  if (listImage.src.match("images/checkbox.svg")) {
    listImage.src = "images/checkbox-active.svg";
  } else {
    listImage.src = "images/checkbox.svg";
  }
  listImage.parentNode.classList.toggle("task-list-checked");
  let taskId = event.target.dataset.id;
  console.log(event.target.dataset.id);
  let taskListId = event.target.closest(".taskbox").dataset.id;
  let currentTaskList = findCurrentTaskList(taskListId);

  let currentTask = currentTaskList.tasks.find(task => task.id === parseInt(taskId));
  currentTask.updateTask();
  console.log(currentTaskList);
  currentTaskList.saveToStorage();
  console.log(currentTask);

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
  // changes the middle part to urgent
  target.parentNode.parentNode.firstElementChild.nextSibling.nextSibling.classList.toggle(
    "urgent-style"
  );
  for (var i = 0; i < localStorageArray.length; i++) {
    if (parseInt(taskBox.dataset.id) === localStorageArray[i].id) {
      localStorageArray[i].updateToDo();
      // localStorageArray[i].saveToStorage();
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
  localStorageArray.push(newList);
  newList.saveToStorage();
  displayCard(newList);
}

function findCurrentTaskList(id) {
  return localStorageArray.find(list=> list.id === parseInt(id))
}

function deleteTaskList(id) {
  
  let currentTaskList = findCurrentTaskList(id)

  let updatedLists = localStorageArray.filter((list) => list.id !== id);
  localStorageArray = updatedLists;
  if (!localStorageArray.length) {
    initialGreeting.classList.remove("hide");
  }
  currentTaskList.deleteFromStorage()
  event.target.closest(".taskbox").remove();

}

function displayCard(list) {
  var tasksDisplayed = "<ul>";
  for (var i = 0; i < list.tasks.length; i++) {
    var image = `<img src="${list.tasks[i].completed ? "images/checkbox-active.svg" : "images/checkbox.svg"}"
    alt="checkbox button" class="checkbox-btn" data-completed=${list.tasks[i].completed} data-id=${list.tasks[i].id} />`;
    tasksDisplayed =
      tasksDisplayed +
      `<li class="list-item ${list.tasks[i].completed && "task-list-checked"}">` +
      image +
      `<p>${list.tasks[i].taskName}</p>` +
      "</li>";
  }
  tasksDisplayed = tasksDisplayed + "</ul>";
  taskDisplayArea.insertAdjacentHTML(
    "beforeend",
    `
  <section class="taskbox taskbox${list.id}" data-id=${list.id}>
    <div class="top-of-taskbox ${list.urgent && "urgent-style"}">
      <p id="taskbox-title">${list.title}</p>
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
