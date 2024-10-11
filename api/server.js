const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
// Allow requests from any origin
app.use(cors({
  origin: '*', // This allows all origins
}));
app.use(express.json());

app.post('/api/chat', async (req, res) => { // Change endpoint to root
  const { messages, stream = false, model = 'llama-3.1-8b-instant', system = "groq" } = req.body;

  try {
    const response = await axios.post('https://api.undrstnd-labs.com/v1/chat/completions', {
      stream,
      model,
      system,
      messages
    }, {
      headers: {
        'Authorization': 'Bearer udsk_xZX39BJtJyBmw8RGgUTGmdG966eT2VGaDLoW84'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error processing the request' });
  }
});

// Export the express handler
module.exports = app;
