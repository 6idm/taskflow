function makeTaskController(service) {
  return {
    list(req, res) {
      res.json(service.list(req.query));
    },

    getOne(req, res) {
      const task = service.getById(req.params.id);
      if (!task) return res.status(404).json({ error: 'Tâche non trouvée' });
      res.json(task);
    },

    create(req, res) {
      try {
        res.status(201).json(service.create(req.body));
      } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
      }
    },

    update(req, res) {
      try {
        const task = service.updateTask(req.params.id, req.body);
        if (!task) return res.status(404).json({ error: 'Tâche non trouvée' });
        res.json(task);
      } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
      }
    },

    remove(req, res) {
      const deleted = service.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Tâche non trouvée' });
      res.json({ message: 'Tâche supprimée', task: deleted });
    },
  };
}

module.exports = makeTaskController;
