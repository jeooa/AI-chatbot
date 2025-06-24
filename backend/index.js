const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const chatRoutes = require('./routes/chat');
const PORT = 3000;
const app = express();


app.use(cors());
app.use(bodyParser.json());
app.use('/api/chat', chatRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
