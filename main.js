var roughDraftSection = document.querySelector('.rough-draft-card');
var roughDraftTask = document.querySelector('.task-item');
var asideButtons = document.querySelector('.aside-section');
var addTaskButton = document.querySelector('.add-task-button');

asideButtons.addEventListener('click', clickButtons);
//create array for rough draft items

function clickButtons(event){
  // if the input field is blank, return out of the function
  //make the plus icon inactive unless text field is entered.
  var target = event.target.classList;
  if (target.contains('add-task-button')){
      addRoughDraftTasks()
}
}

function addRoughDraftTasks(){
  if (roughDraftTask.value == ""){
    alert("Please Enter a Task");
    return;
  } else {
  roughDraftSection.insertAdjacentHTML('beforeend', `
  <div class="roughdraftitem"><img src="images/delete.svg"
   alt="delete button" class="delete-btn-rough" />${roughDraftTask.value}</div>`);
   roughDraftTask.value = "";
}
}
