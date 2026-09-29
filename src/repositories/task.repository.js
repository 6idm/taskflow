class TaskRepository {
  constructor(seedTasks = []) {
    this.tasks = [...seedTasks];
    this.nextId = this.tasks.length + 1;
  }

  findAll() {
    return [...this.tasks];
  }

  findById(id) {
    return this.tasks.find((t) => t.id === id) || null;
  }

  create(data) {
    const task = {
      id: String(this.nextId++),
      description: '',
      status: 'todo',
      owner: 'anonymous',
      createdAt: new Date().toISOString(),
      ...data,
    };
    this.tasks.push(task);
    return task;
  }

  update(id, changes) {
    const task = this.findById(id);
    if (!task) return null;
    Object.assign(task, changes);
    return task;
  }

  delete(id) {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;
    return this.tasks.splice(index, 1)[0];
  }
}

module.exports = TaskRepository;
