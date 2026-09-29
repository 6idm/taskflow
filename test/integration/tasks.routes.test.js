const { describe, test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const createApp = require('../../src/app');
const TaskRepository = require('../../src/repositories/task.repository');

describe('API /api/tasks (intégration)', () => {
  let app;

  beforeEach(() => {
    const repository = new TaskRepository([
      { id: '1', title: 'Tâche existante', description: '', status: 'todo', owner: 'alice' },
    ]);
    app = createApp({ repository });
  });

  test('GET /api/tasks renvoie la liste', async () => {
    const res = await request(app).get('/api/tasks');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 1);
  });

  test('POST /api/tasks crée une tâche, puis GET la retrouve', async () => {
    const createRes = await request(app)
      .post('/api/tasks')
      .send({ title: 'Nouvelle tâche', owner: 'bob' });
    assert.equal(createRes.status, 201);

    const getRes = await request(app).get(`/api/tasks/${createRes.body.id}`);
    assert.equal(getRes.status, 200);
    assert.equal(getRes.body.title, 'Nouvelle tâche');
  });

  test('POST /api/tasks sans titre renvoie 400', async () => {
    const res = await request(app).post('/api/tasks').send({});
    assert.equal(res.status, 400);
  });

  test('PATCH /api/tasks/:id change le statut', async () => {
    const res = await request(app).patch('/api/tasks/1').send({ status: 'done' });
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'done');
  });

  test('PATCH avec un statut invalide renvoie 400', async () => {
    const res = await request(app).patch('/api/tasks/1').send({ status: 'urgent' });
    assert.equal(res.status, 400);
  });

  test('DELETE /api/tasks/:id supprime la tâche', async () => {
    const res = await request(app).delete('/api/tasks/1');
    assert.equal(res.status, 200);
    const getRes = await request(app).get('/api/tasks/1');
    assert.equal(getRes.status, 404);
  });

  test('GET sur un id inconnu renvoie 404', async () => {
    const res = await request(app).get('/api/tasks/999');
    assert.equal(res.status, 404);
  });
});