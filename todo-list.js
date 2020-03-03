class ToDoList{
  constructor(id, title, tasks, urgent){
    this.id = id
    this.title = title;
    this.tasks  = tasks;
    this.urgent = false;
    //make this just this.tasks = tasks
  }

  nextId(){
    if (ToDoList.nextId === undefined){
      ToDoList.nextId = 0;
    }
    return ToDoList.nextId++;
  }

  saveToStorage(){

    // var storageList = [this.id, this.title, this.urgent, this.tasks]
    // var storageList = list
    var allListsInStorage = JSON.stringify(localStorageArray)
    // var currentList = JSON.stringify(list)
    localStorage.setItem(('allLists'), allListsInStorage)


  }

  deleteFromStorage(){
    localStorage.clear();
  }

  updateToDo(){
    //should update todo's title and urgency
  }

  updateTask(){
    task.completed = true;
    //update task content and if it has been completed.
  }
}
