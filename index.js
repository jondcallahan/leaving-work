const express = require('express');
const bodyParser = require('body-parser');

const app = express()

app.get('*', (req, res) => {
  console.log(req.headers);
  res.send(200)
})

app.listen(3000, () => {console.log('Listening on port 3000')})
