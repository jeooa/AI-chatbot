const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const db = require('../db'); // your db connection
// const app = express();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);
    db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashed], (err) => {
        if (err) return res.status(400).json({ message: 'Email already used' });
        res.json({ message: 'Registered successfully' });
    });
});

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, users) => {
        if (err || users.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

        const user = users[0];
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
});

// Google Login
router.post('/google', async (req, res) => {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
    });

    const { name, email, sub: google_id } = ticket.getPayload();
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (results.length === 0) {
            db.query('INSERT INTO users (name, email, google_id) VALUES (?, ?, ?)', [name, email, google_id]);
        }

        const token = jwt.sign({ name, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
});

// app.get('/api/google-client-id', (req, res) => {
//     res.json({ clientId: process.env.GOOGLE_CLIENT_ID });
// });



module.exports = router;
