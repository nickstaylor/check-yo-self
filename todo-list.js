class ToDoList{
  constructor(id, title, tasks, urgent){
    this.id = id
    this.title = title;
    this.tasks  = tasks;
    this.urgent = urgent || false;
  }

  saveToStorage(){
    var allListsInStorage = JSON.stringify(localStorageArray)
    localStorage.setItem(('allLists'), allListsInStorage)
  }

  updateToDo(){
    this.urgent = !this.urgent;
  }

}
