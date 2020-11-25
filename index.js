const express = require('express');
const app = express();

const getData = require('./utils/fetch');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`listening on port ${PORT}`));

app.get('/api/:mediaID', async (req, res) => {
  let response = await getData(req.params.mediaID);

  res.json(response);
});
