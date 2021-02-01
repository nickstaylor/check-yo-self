class Task {
  constructor(name, id, completed) {
    this.taskName = name;
    this.id = id || Date.now();
    this.completed = completed || false;
  }

  updateTask() {
    this.completed = !this.completed;
  }
}
 