class ToDoList {
  constructor(id, title, tasks, urgent) {
    this.id = id
    this.title = title;
    this.tasks  = tasks;
    this.urgent = urgent || false;
  }

  saveToStorage() {
    let allListsInStorage = JSON.stringify(allToDoLists)
    localStorage.setItem(('allLists'), allListsInStorage)
  }

  deleteFromStorage() {
    let allListsInStorage = JSON.stringify(allToDoLists);
    localStorage.setItem("allLists", allListsInStorage);
  }

  updateUrgency() {
    this.urgent = !this.urgent;
    this.saveToStorage();
  }

  addTask(task) {
    this.tasks.push(task);
  }

}
