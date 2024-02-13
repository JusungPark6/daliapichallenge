import axios from 'axios';

const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
const baseUrl = 'https://api.unsplash.com';

export const fetchRandomPhotos = async (count = 10) => {
  try {
    const response = await axios.get(`${baseUrl}/photos/random`, {
      params: { client_id: accessKey, count },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching photos from Unsplash:', error);
    throw error;
  }
};