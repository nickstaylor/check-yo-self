var roughDraftSection = document.querySelector('.rough-draft-card');
var roughDraftTask = document.querySelector('.task-item');
var asideButtons = document.querySelector('.aside-section');
var taskDisplayArea = document.querySelector('.task-container');
var taskTitleBox = document.querySelector('.task-title');
var initialGreeting = document.querySelector('.initial-greeting');
var roughDraftArray = [];
var localStorageArray = [];

asideButtons.addEventListener('click', clickAsideButtons);
roughDraftSection.addEventListener('click', deleteRoughDraftTask);
taskDisplayArea.addEventListener('click', modifyTasks);
window.onload = retrieveToDosFromStorage;

function retrieveToDosFromStorage() {
  let localStorageLists = localStorage.getItem('allLists');
  var retrievedLists = JSON.parse(localStorageLists);
  if (!retrievedLists) {
    initialGreeting.classList.remove('hide');
    return
  }
  initialGreeting.classList.add('hide')
  
  for (var i = 0; i < retrievedLists.length; i++) {
    var list = new ToDoList(retrievedLists[i].id, retrievedLists[i].title, retrievedLists[i].tasks, retrievedLists[i].urgent);
    localStorageArray.push(list);
    displayCard(list)
    // if (list.urgent) {
    //   reloadUrgentColors(list)
    // } else {
    //   displayCard(list)
    // }
  }
}

function clickAsideButtons(event) {
  var target = event.target.classList;
  if (target.contains('add-task-button')) {
    addRoughDraftTasks()
  }
  if (target.contains('make-list-btn')) {
    makeList();
  }
  if (target.contains('clear-all-btn')) {
    clearAllAside();
  }
}

function clearAllAside() {
  roughDraftSection.innerText = "";
  taskTitleBox.value = "";
  roughDraftArray = [];
}

function deleteRoughDraftTask(event) {
  for (var i = 0; i < roughDraftArray.length; i++) {
    var textToRemove = event.target.nextSibling.dataset.id;
    var textNumber = parseInt(textToRemove);
    if (textNumber === roughDraftArray[i].id) {
      roughDraftArray.splice(i, 1);
    }
  }
  if (event.target.className === 'delete-btn-rough') {
    event.target.parentNode.remove()
  }
}

function modifyTasks(event) {
  if (event.target.closest('.checkbox-btn')) {
    checkOffTasks()
  }
  if (event.target.closest('.urgent')) {
    urgentButton();
  }
}

function checkOffTasks() {
  var listImage = event.target
  if (listImage.src.match("images/checkbox.svg")) {
    listImage.src = "images/checkbox-active.svg"
  } else {
    listImage.src = "images/checkbox.svg"
  }
  listImage.parentNode.classList.toggle('task-list-checked')
}

function urgentButton() {
  var target = event.target.parentNode
  console.log(target);
  var taskBox = target.parentNode.parentNode
  if (event.target.src.match("images/urgent.svg")) {
    event.target.src = "images/urgent-active.svg"
  } else {
    event.target.src = "images/urgent.svg"
  }
  //changes font to urgent
  target.classList.toggle('urgent-font');
  //changes bottom to urgent
  target.parentNode.classList.toggle('urgent-style');
  // changes top to urgent
  target.parentNode.parentNode.firstElementChild.classList.toggle('urgent-style');
  // changes the middle part to urgent
  target.parentNode.parentNode.firstElementChild.nextSibling.nextSibling.classList.toggle('urgent-style');
  for (var i = 0; i < localStorageArray.length; i++) {
    if (parseInt(taskBox.dataset.id) === localStorageArray[i].id) {
      localStorageArray[i].updateToDo();
      localStorageArray[i].saveToStorage();
    }
  }
}

function makeList() {
  var taskTitle = taskTitleBox.value;
  initialGreeting.classList.add('hide');
  if ((taskTitle === "") || (roughDraftArray.length === 0)) {
    return;
  }
  var list = new ToDoList(Date.now(), taskTitle, roughDraftArray);
  localStorageArray.push(list);
  list.saveToStorage();
  displayCard(list);
}

function deleteTaskList(id) {
  console.log(id);
}

function reloadUrgentColors(list) {
  var tasksDisplayed = "<ul>"
  for (var i = 0; i < list.tasks.length; i++) {
    var image = `<img src="images/checkbox.svg"
    alt="checkbox button" class="checkbox-btn" data-id=${list.tasks[i].id} />`
    tasksDisplayed = tasksDisplayed + '<li class="list-item">' + image + list.tasks[i].taskName + "</li>"
  }
  tasksDisplayed = tasksDisplayed + "</ul>";
  taskDisplayArea.insertAdjacentHTML(
    "beforeend",
    `
  <section class="taskbox taskbox${list.id}" data-id=${list.id}>
    <div class="top-of-taskbox urgent-style">
      <p id="taskbox-title">${list.title}</p>
    </div>
    <div class="task-list urgent-style">
        ${tasksDisplayed}
    </div>
    <div class="bottom-of-taskbox urgent-style">
      <div class="urgent-button urgent-font">
        <img class="urgent" src="images/urgent-active.svg">
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

function displayCard(list) {
  console.log(list.urgent);
  var tasksDisplayed = "<ul>"
  for (var i = 0; i < list.tasks.length; i++) {
    var image = `<img src="images/checkbox.svg"
    alt="checkbox button" class="checkbox-btn" data-id=${list.tasks[i].id} />`
    tasksDisplayed = tasksDisplayed + '<li class="list-item">' + image + list.tasks[i].taskName + "</li>"
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
        <img class="urgent" src=${list.urgent ? "images/urgent-active.svg" : "images/urgent.svg"}>
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
  } else {
    var task = new Task(roughDraftTask.value);
    roughDraftSection.insertAdjacentHTML('beforeend', `
    <div class="roughdraftitem"><img src="images/delete.svg"
    alt="delete button" class="delete-btn-rough" /><p data-id=${task.id}>${task.taskName}</p></div>`);
    roughDraftArray.push(task);
    roughDraftTask.value = "";
  }
}
