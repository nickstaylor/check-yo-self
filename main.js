var toDoList = new ToDoList();
console.log(toDoList);
var roughDraftSection = document.querySelector('.rough-draft-card');
var roughDraftTask = document.querySelector('.task-item');
var asideButtons = document.querySelector('.aside-section');
// var addTaskButton = document.querySelector('.add-task-button');
var roughDraftArray = [];

asideButtons.addEventListener('click', clickButtons);
roughDraftSection.addEventListener('click', deleteRoughDraftTask);

function clickButtons(event){
  var target = event.target.classList;
  if (target.contains('add-task-button')){
      addRoughDraftTasks()
    } if (target.contains('make-list-btn')){
      makeList();
    } if (target.contains('clear-all-btn')){
      roughDraftSection.innerText = "";    // clearAllAside();
    } if (target.contains('filter')){
      filterByUrgency();
    }
}

function deleteRoughDraftTask(){
  // code here to take item out of DOM array.
  for (var i = 0; i < roughDraftArray.length; i++){
    var textToRemove = event.target.nextSibling.dataset.id;
    var textNumber = parseInt(textToRemove);
    // console.log(textToRemove);
    // console.log(roughDraftArray[i].id);
    // console.log(textNumber === roughDraftArray[i].id)
           if (textNumber === roughDraftArray[i].id){
             roughDraftArray.splice(i, 1);
             console.log(roughDraftArray);
        }
      }

if (event.target.className === 'delete-btn-rough'){
  event.target.parentNode.remove()
}
}



function makeList(){
  var taskTitle = document.querySelector('.task-title').value;
  if(taskTitle == ""){
    return;
  }
  console.log(taskTitle)
// grab the new list elements, make each of them a "task" instance
//instantiate new TodoList
// and place the "tasks" into the new ToDoList array

  // var list = new ToDoList (taskTitle, roughDraftArray, Date.now());
  // list.tasks.push(roughDraftArray);
  // console.log(list)

}


function addRoughDraftTasks(){
  if (roughDraftTask.value == ""){
    alert("Please Enter a Task");
    return;
  } else {
    // instantiate ToDoList here
  var task = new Task(roughDraftTask.value);
  roughDraftSection.insertAdjacentHTML('beforeend', `
  <div class="roughdraftitem"><img src="images/delete.svg"
   alt="delete button" class="delete-btn-rough" /><p data-id=${task.id}>${task.taskName}</p></div>`);
   console.log(task);
   roughDraftArray.push(task);
   console.log(roughDraftArray);
   roughDraftTask.value = "";
   //add each of there to roughDraftArray
}
}
