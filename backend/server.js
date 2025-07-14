const app = require('./app');
const { initDb } = require('./db');

initDb()
  .then(() => {
    app.listen(3001, () => {
      console.log('Server is running on http://localhost:3001');
    });
  })
  .catch((err) => {
    console.error('DB connection failed', err);
    process.exit(1);
  });
