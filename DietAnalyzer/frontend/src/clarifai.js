import axios from 'axios';

const CLARIFAI_API_URL = 'https://api.clarifai.com/v2/models/YOUR_MODEL_ID/outputs';
const CLARIFAI_API_KEY = 'YOUR_API_KEY';

export const analyzeImage = (imageBase64) => {
  return axios.post(
    CLARIFAI_API_URL,
    {
      inputs: [{ data: { image: { base64: imageBase64 } } }],
    },
    {
      headers: {
        Authorization: `Key ${CLARIFAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
};
