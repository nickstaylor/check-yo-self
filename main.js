
var roughDraftSection = document.querySelector('.rough-draft-card');
var roughDraftTask = document.querySelector('.task-item');
var asideButtons = document.querySelector('.aside-section');
var taskDisplayArea = document.querySelector('.task-container');
var taskTitleBox = document.querySelector('.task-title');
var initialGreeting = document.querySelector('.initial-greeting');
var tasksDisplayed = "";
var roughDraftArray = [];
var list;
var localStorageArray =[];

asideButtons.addEventListener('click', clickButtons);
roughDraftSection.addEventListener('click', deleteRoughDraftTask);
taskDisplayArea.addEventListener('click', modifyTasks);
window.onload = retrieveToDosFromStorage;

function retrieveToDosFromStorage(){
  alllocalStorage = localStorage.getItem('allLists');
  var parseString = JSON.parse(alllocalStorage);

  if (parseString === null){
    initialGreeting.classList.remove('hide');
    return}
    else {initialGreeting.classList.add('hide')
  };

  for (var i = 0; i < parseString.length; i++){
    console.log(parseString);
    var list = new ToDoList (parseString[i].id, parseString[i].title, parseString[i].tasks, parseString[i].urgent);
    console.log(parseString[i].urgent)
    localStorageArray.push(list);
    console.log(list)
    if (list.urgent == true){
      reloadUrgentColors(parseString[i].title, list)
    }
     else {displayCard(parseString[i].title, list)}

    //if parseString.urgent === true, then invoke the urgent styling function
  }
}

function clickButtons(event){
  var target = event.target.classList;
  if (target.contains('add-task-button')){
      addRoughDraftTasks()
    } if (target.contains('make-list-btn')){
      makeList();
    } if (target.contains('clear-all-btn')){
      clearAllAside();
    } if (target.contains('filter')){
      filterByUrgency();
    }
}

function clearAllAside() {
  roughDraftSection.innerText = "";
  taskTitleBox.value = "";
  roughDraftArray = [];
}

function deleteRoughDraftTask(){
  for (var i = 0; i < roughDraftArray.length; i++){
    var textToRemove = event.target.nextSibling.dataset.id;
    var textNumber = parseInt(textToRemove);
       if (textNumber === roughDraftArray[i].id){
           roughDraftArray.splice(i, 1);
           console.log(roughDraftArray);
        }
      }
    if (event.target.className === 'delete-btn-rough'){
        event.target.parentNode.remove()
      }
}

function modifyTasks(){
  // check tasks function here
  if (event.target.closest('.checkbox-btn')){
    checkOffTasks()
  }
    //urgentbutton function here
  if (event.target.closest('.urgent')){
    urgentButton();
  }
}


function checkOffTasks(){
  if (event.target.src.match("images/checkbox.svg")){
    event.target.src = "images/checkbox-active.svg"
  } else {event.target.src = "images/checkbox.svg"}

    event.target.parentNode.classList.toggle('task-list-checked')
}


function urgentButton(){
  var target = event.target.parentNode
  console.log(target.parentNode.parentNode)
  if (event.target.src.match("images/urgent.svg")){
    event.target.src = "images/urgent-active.svg"
  } else {event.target.src = "images/urgent.svg"}

    //changes font to urgent
    target.classList.toggle('urgent-font');

    //changes bottom to urgent
    target.parentNode.classList.toggle('urgent-style');

    // changes top to urgent
    target.parentNode.parentNode.firstElementChild.classList.toggle('urgent-style');

    // changes the middle part to urgent
    target.parentNode.parentNode.firstElementChild.nextSibling.nextSibling.classList.toggle('urgent-style');

    console.log(target.parentNode.parentNode.dataset.id)
    for (var i = 0; i < localStorageArray.length; i++){
      if (target.parentNode.parentNode.dataset.id == localStorageArray[i].id)
      // { localStorageArray[i].urgent = !localStorageArray[i].urgent;
      {localStorageArray[i].updateToDo();
        localStorageArray[i].saveToStorage();
        console.log(localStorageArray[i])}
      }
}


function makeList(){
  var taskTitle = taskTitleBox.value;
  initialGreeting.classList.add('hide');
  if((taskTitle === "") || (roughDraftArray.length === 0)){
    return;
  }

  var list = new ToDoList (Date.now(), taskTitle, roughDraftArray);
  localStorageArray.push(list);
  list.saveToStorage();
  displayCard(taskTitle, list)

}


function reloadUrgentColors(taskTitle, list){
  var tasksDisplayed = "<ul>"
  for (var i = 0; i < list.tasks.length; i++){
    var image = `<img src="images/checkbox.svg"
    alt="checkbox button" class="checkbox-btn data-id=${list.tasks[i].id}" />`
    tasksDisplayed = tasksDisplayed + '<li class="list-item">' + image + list.tasks[i].taskName + "</li>"
  } tasksDisplayed = tasksDisplayed + "</ul>";

console.log(tasksDisplayed)

taskDisplayArea.insertAdjacentHTML('beforeend', `
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
    <div class="delete-button-task">
      <img class="delete" src="images/delete.svg">
      <p>DELETE</p>
  </div>
</section>`)
clearAllAside();


}

  function displayCard(taskTitle, list){
    var tasksDisplayed = "<ul>"
    for (var i = 0; i < list.tasks.length; i++){
      var image = `<img src="images/checkbox.svg"
      alt="checkbox button" class="checkbox-btn data-id=${list.tasks[i].id}" />`
      tasksDisplayed = tasksDisplayed + '<li class="list-item">' + image + list.tasks[i].taskName + "</li>"
    } tasksDisplayed = tasksDisplayed + "</ul>";

    console.log(tasksDisplayed)

  taskDisplayArea.insertAdjacentHTML('beforeend', `
  <section class="taskbox taskbox${list.id}" data-id=${list.id}>
    <div class="top-of-taskbox">
      <p id="taskbox-title">${list.title}</p>
    </div>
    <div class="task-list">
        ${tasksDisplayed}
    </div>
    <div class="bottom-of-taskbox">
      <div class="urgent-button">
        <img class="urgent" src="images/urgent.svg">
        <p>URGENT</p>
      </div>
      <div class="delete-button-task">
        <img class="delete" src="images/delete.svg">
        <p>DELETE</p>
    </div>
  </section>`)
  clearAllAside();
}


function addRoughDraftTasks(){
  if (roughDraftTask.value == ""){
    alert("Please Enter a Task");
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
