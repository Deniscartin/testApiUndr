const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(express.json());

// Abilita CORS per tutte le origini
app.use(cors());

// Endpoint per gestire le richieste dal frontend
app.post('/api/chat', async (req, res) => {
  try {
    const { apiKey, ...restOfRequest } = req.body; // Estrai apiKey dai dati della richiesta

    // Invio della richiesta all'API di Undrstnd
    const response = await axios.post('https://dev.undrstnd-labs.com/api', restOfRequest, {
      headers: {
        'x-api-key': apiKey,  // Usa la chiave API fornita dal client
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
