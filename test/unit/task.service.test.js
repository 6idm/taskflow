const { describe, test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { TaskService } = require('../../src/services/task.service');

function createFakeRepository(initialTasks = []) {
  const tasks = [...initialTasks];
  let nextId = tasks.length + 1;
  return {
    findAll: () => [...tasks],
    findById: (id) => tasks.find((t) => t.id === id) || null,
    create: (data) => {
      const task = {
        id: String(nextId++),
        description: '',
        status: 'todo',
        owner: 'anonymous',
        ...data,
      };
      tasks.push(task);
      return task;
    },
    update: (id, changes) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return null;
      Object.assign(task, changes);
      return task;
    },
    delete: (id) => {
      const index = tasks.findIndex((t) => t.id === id);
      if (index === -1) return null;
      return tasks.splice(index, 1)[0];
    },
  };
}

describe('TaskService', () => {
  let service;

  beforeEach(() => {
    service = new TaskService(
      createFakeRepository([
        { id: '1', title: 'Tâche A', description: '', status: 'todo', owner: 'alice' },
        { id: '2', title: 'Tâche B', description: '', status: 'done', owner: 'bob' },
      ]),
    );
  });

  test('list() renvoie toutes les tâches sans filtre', () => {
    assert.equal(service.list().length, 2);
  });

  test('list() filtre par statut', () => {
    const result = service.list({ status: 'done' });
    assert.deepEqual(
      result.map((t) => t.id),
      ['2'],
    );
  });

  test('list() filtre par recherche texte', () => {
    const result = service.list({ q: 'tâche a' });
    assert.deepEqual(
      result.map((t) => t.id),
      ['1'],
    );
  });

  test('create() ajoute une tâche avec le statut todo par défaut', () => {
    const task = service.create({ title: 'Nouvelle tâche' });
    assert.equal(task.status, 'todo');
    assert.equal(service.list().length, 3);
  });

  test('create() rejette une tâche sans titre', () => {
    assert.throws(() => service.create({}), /titre est obligatoire/);
  });

  test('updateTask() refuse un statut invalide', () => {
    assert.throws(() => service.updateTask('1', { status: 'urgent' }), /Statut invalide/);
  });

  test('updateTask() renvoie null si la tâche n’existe pas', () => {
    assert.equal(service.updateTask('999', { status: 'done' }), null);
  });

  test('delete() retire la tâche et la renvoie', () => {
    const deleted = service.delete('1');
    assert.equal(deleted.id, '1');
    assert.equal(service.list().length, 1);
  });
});