const express = require('express');
const axios = require('axios');
const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

router.post('/', async (req, res) => {
    const contents = req.body.contents;

    try {
        const response = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
            { contents },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': GEMINI_API_KEY
                }
            }
        );

        let botReply = response.data.candidates[0].content.parts[0].text || '';

        botReply = botReply
            .replace(/\*\*(.*?)\*\*/g, '$1')     // remove bold formatting **text**
            .replace(/^\*\s+/gm, '')             // remove bullet points (start of lines)
            .replace(/\n\*\s+/g, '\n')           // remove mid-line bullets
            .replace(/(\n\s*){3,}/g, '\n\n')     // prevent triple line breaks
            .trim();

        res.json({ reply: botReply });
    } catch (error) {
        console.error('Gemini API error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch Gemini response' });
    }
});

module.exports = router;
