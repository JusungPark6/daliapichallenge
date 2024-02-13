import axios from 'axios';

export const analyzeImageWithGoogleVision = async (imageUrl) => {
  try {
    const response = await axios.post('http://localhost:3001/analyze-image-with-google-vision', { imageUrl });
    return response.data.analysis;
  } catch (error) {
    console.error('Error analyzing image with Google Cloud Vision in analyzeImageWithGoogleVision:', error);
    throw error;
  }
};
