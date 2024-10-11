const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
// Allow requests from any origin
app.use(cors({
  origin: '*', // This allows all origins
}));
app.use(express.json());

const emotions = ['neutral', 'happy', 'sad', 'angry', 'surprised', 'disgusted', 'fearful'];

app.post('/api/chat', async (req, res) => {
  const { messages, stream = false, model = 'llama-3.1-8b-instant', system = "groq" } = req.body;
  try {
    const response = await axios.post('https://api.undrstnd-labs.com/v1/chat/completions', {
      stream,
      model,
      system,
      messages: [
        ...messages,
        { role: 'system', content: 'After your response, on a new line, add at least two emotion tags like this: [EMOTION1:happy][EMOTION2:surprised]. You can add more if needed. Choose from: neutral, happy, sad, angry, surprised, disgusted, fearful. Balance the emotions to match the content of your response.' }
      ]
    }, {
      headers: {
        'Authorization': 'Bearer udsk_xZX39BJtJyBmw8RGgUTGmdG966eT2VGaDLoW84'
      }
    });

    const fullResponse = response.data.choices[0].message.content;
    const [answer, ...emotionTags] = fullResponse.split(/\[EMOTION\d+:/);
    
    // Rename this variable to avoid conflict
    const parsedEmotions = emotionTags.map(tag => {
      const emotion = tag.split(']')[0].toLowerCase();
      return emotions.includes(emotion) ? emotion : 'neutral';
    });

    res.json({
      ...response.data,
      choices: [{
        ...response.data.choices[0],
        message: {
          ...response.data.choices[0].message,
          content: answer.trim(),
          emotions: parsedEmotions // Use the renamed variable here
        }
      }]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error processing the request' });
  }
});

module.exports = app;
