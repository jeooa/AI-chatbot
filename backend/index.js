const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const chatRoutes = require('./routes/chat');
const authRoutes = require('./routes/auth')
const PORT = process.env.PORT;
const app = express();


app.use(cors());
app.use(bodyParser.json());
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
