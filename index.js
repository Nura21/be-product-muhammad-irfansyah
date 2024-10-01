const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models'); // Sequelize models

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sync the database
db.sequelize.sync().then(() => {
  console.log("Connected to the database.");
});

// Simple route
// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to Sequelize CRUD application." });
// });

// Require the routes
require('./routes/order.routes')(app);
require('./routes/product.routes')(app);

// Set the server to listen on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
