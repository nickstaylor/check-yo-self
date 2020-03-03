
var roughDraftSection = document.querySelector('.rough-draft-card');
var roughDraftTask = document.querySelector('.task-item');
var asideButtons = document.querySelector('.aside-section');
var taskDisplayArea = document.querySelector('.task-container');
var taskTitleBox = document.querySelector('.task-title');
var tasksDisplayed = "";
var roughDraftArray = [];
var list;

asideButtons.addEventListener('click', clickButtons);
roughDraftSection.addEventListener('click', deleteRoughDraftTask);
taskDisplayArea.addEventListener('click', addTasks);
window.onload = retrieveToDosFromStorage;

function retrieveToDosFromStorage(){

  alllocalStorage = Object.keys(localStorage);
  console.log(alllocalStorage);
  for (var i = 0; i < alllocalStorage.length; i++){
    var string = localStorage.getItem(alllocalStorage[i]);
    var parseString = JSON.parse(string);
    console.log(parseString);
    var list = new ToDoList (parseString.title, parseString.tasks);
    console.log(list)

    }


    var image = `<img src="images/checkbox.svg"
     alt="checkbox button" class="checkbox-btn" />`
    var tasksDisplayed = "<ul>"
    for (var i = 0; i < parseString.tasks.length; i++){
      tasksDisplayed = tasksDisplayed + '<li>' + image + parseString.tasks[i].taskName + "</li>"
    } tasksDisplayed = tasksDisplayed + "</ul>";

  console.log(tasksDisplayed);

    taskDisplayArea.insertAdjacentHTML('beforeend', `
    <section class="taskbox taskbox${parseString.id}">
      <div class="top-of-taskbox">
        <p id="taskbox-title">${parseString.title}</p>
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
  console.log(roughDraftArray);

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

function addTasks(){
  //ugentbutton finction here
  if (event.target.className === 'task-list'){
    console.log("I got here");
  }
  // console.log(event.target.childNodes);



}

function makeList(){
  var taskTitle = taskTitleBox.value;
  console.log(taskTitle);
  if((taskTitle === "") && (roughDraftArray.length === 0)){
    //continue working on this later
    return;
  }
    //clear left side out here, reset it.
  var list = new ToDoList (taskTitle, roughDraftArray);
  list.saveToStorage();
  //move list to larger array of lists on localStorage- why do this?

  console.log(list);
  var image = `<img src="images/checkbox.svg"
   alt="checkbox button" class="checkbox-btn" />`
  var tasksDisplayed = "<ul>"
  console.log(tasksDisplayed);
  for (var i = 0; i < list.tasks.length; i++){
    tasksDisplayed = tasksDisplayed + '<li>' + image + list.tasks[i].taskName + "</li>"
  } tasksDisplayed = tasksDisplayed + "</ul>";

console.log(tasksDisplayed);

  taskDisplayArea.insertAdjacentHTML('beforeend', `
  <section class="taskbox taskbox${list.id}">
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
   console.log(task);
   roughDraftArray.push(task);
   console.log(roughDraftArray);
   roughDraftTask.value = "";
}
}
