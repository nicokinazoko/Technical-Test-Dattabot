const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 4000;

// app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('hello world');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
