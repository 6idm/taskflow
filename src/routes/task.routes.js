const express = require('express');

function makeTaskRouter(controller) {
  const router = express.Router();
  router.get('/', controller.list);
  router.get('/:id', controller.getOne);
  router.post('/', controller.create);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);
  return router;
}

module.exports = makeTaskRouter;
