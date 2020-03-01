class ToDoList{
  constructor(title, tasks){
    this.id = this.nextId()
    this.title = title;
    this.urgent = false;
    this.tasks  =[];
    //make this just this.tasks = tasks
  }

  nextId(){
    if (ToDoList.nextId === undefined){
      ToDoList.nextId = 0;
    }
    return ToDoList.nextId++;
  }

  saveToStorage(){

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
