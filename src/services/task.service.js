const VALID_STATUSES = ['todo', 'in-progress', 'done'];

class TaskService {
  constructor(repository) {
    this.repository = repository;
  }

  list({ status, q } = {}) {
    let result = this.repository.findAll();

    if (status) {
      result = result.filter((t) => t.status === status);
    }

    if (q) {
      const needle = q.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(needle) || t.description.toLowerCase().includes(needle),
      );
    }

    return result;
  }

  getById(id) {
    return this.repository.findById(id);
  }

  create({ title, description, owner }) {
    if (!title) {
      const error = new Error('Le titre est obligatoire');
      error.status = 400;
      throw error;
    }
    return this.repository.create({ title, description, owner });
  }

  updateTask(id, changes) {
    const task = this.repository.findById(id);
    if (!task) return null;

    const { status, title, description } = changes;
    if (status && !VALID_STATUSES.includes(status)) {
      const error = new Error('Statut invalide. Valeurs acceptées : todo, in-progress, done');
      error.status = 400;
      throw error;
    }

    const updates = {};
    if (status) updates.status = status;
    if (title) updates.title = title;
    if (description !== undefined) updates.description = description;

    return this.repository.update(id, updates);
  }

  delete(id) {
    return this.repository.delete(id);
  }
}

module.exports = { TaskService, VALID_STATUSES };
