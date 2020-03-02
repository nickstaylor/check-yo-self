class ToDoList{
  constructor(title, tasks){
    this.id = this.nextId()
    this.title = title;
    this.urgent = false;
    this.tasks  = tasks;
    //make this just this.tasks = tasks
  }

  nextId(){
    if (ToDoList.nextId === undefined){
      ToDoList.nextId = 0;
    }
    return ToDoList.nextId++;
  }

  saveToStorage(){

    // var currentList = JSON.stringify(list)
    // localStorage.setItem('list', list)

  }

  deleteFromStorage(){

  }

  updateToDo(){
    //should update todo's title and urgency
  }

  updateTask(){
    //update task content and if it has been completed.
  }
}
