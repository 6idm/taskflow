const config = require('./config');
const createApp = require('./src/app');

const app = createApp();

app.listen(config.port, () => {
  console.log(`TaskFlow démarré sur http://localhost:${config.port}`);
});
