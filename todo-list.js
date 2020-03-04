class ToDoList{
  constructor(id, title, tasks, urgent){
    this.id = id
    this.title = title;
    this.tasks  = tasks;
    this.urgent = urgent || false;

    //make this just this.tasks = tasks
  }

  saveToStorage(){
    var allListsInStorage = JSON.stringify(localStorageArray)
    localStorage.setItem(('allLists'), allListsInStorage)
  }

  deleteFromStorage(){
    localStorage.clear();
  }

  updateToDo(){
    this.urgent = !this.urgent;
  }

  updateTask(){
    task.completed = true;
    //update task content and if it has been completed.
  }
}
