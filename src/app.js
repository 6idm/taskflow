const express = require('express');
const TaskRepository = require('./repositories/task.repository');
const { TaskService } = require('./services/task.service');
const makeTaskController = require('./controllers/task.controller');
const makeTaskRouter = require('./routes/task.routes');
const seedTasks = require('./repositories/seed-tasks');

function createApp({ repository } = {}) {
  const app = express();
  app.use(express.json());
  app.use(express.static('public'));

  const taskRepository = repository || new TaskRepository(seedTasks);
  const taskService = new TaskService(taskRepository);
  const taskController = makeTaskController(taskService);

  app.use('/api/tasks', makeTaskRouter(taskController));

  // Route héritée, hors périmètre de ce refactor (XSS connu, voir README)
  app.get('/search', (req, res) => {
    const q = req.query.q || '';
    const results = taskService
      .list({})
      .filter((t) => t.title.toLowerCase().includes(q.toLowerCase()));
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Recherche</title></head>
      <body>
        <h1>Résultats pour : ${q}</h1>
        <ul>${results.map((t) => `<li>${t.title} — ${t.status}</li>`).join('')}</ul>
        <a href="/">Retour</a>
      </body>
      </html>
    `);
  });

  return app;
}

module.exports = createApp;
