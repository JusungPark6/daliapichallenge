const express = require('express');
const cors = require('cors');
const googleVisionService = require('../src/googleVisionService');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
  });

app.get('/callback', async (req, res) => {
    const code = req.query.code;
    const spotifyTokenUrl = 'https://accounts.spotify.com/api/token';
    try {
      const response = await axios.post(spotifyTokenUrl, new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'YOUR_REGISTERED_REDIRECT_URI',
        client_id: 'YOUR_SPOTIFY_CLIENT_ID',
        client_secret: 'YOUR_SPOTIFY_CLIENT_SECRET',
      }).toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
  
      res.redirect(`http:localhost:${port}/?access_token=${response.data.access_token}`);
    } catch (error) {
      console.error('Error exchanging code for tokens', error);
      res.sendStatus(500);
    }
  });

app.post('/analyze-image-with-google-vision', async (req, res) => {
    console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

    console.log("Request received", req.body);
    const { imageUrl } = req.body;
    try {
      const analysisResults = await googleVisionService.analyzeImageWithGoogleVision(imageUrl);
      res.json({ analysis: analysisResults });
    } catch (error) {
      console.error('Error analyzing image with Google Cloud Vision:', error);
      res.status(500).send('Error analyzing image with Google Cloud Vision');
    }
});

// Endpoint to fetch a random photo from Unsplash
app.get('/fetch-random-photo', async (req, res) => {
    try {
      const response = await axios.get('https://api.unsplash.com/photos/random', {
        headers: {
          Authorization: `Client-ID ${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}`,
        },
      });
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching photo from Unsplash:', error);
      res.status(500).send('Error fetching photo from Unsplash');
    }
  });
  
  // Endpoint to create a Spotify playlist based on image analysis
  app.post('/create-playlist', async (req, res) => {
    const { userId, analysisResults } = req.body;
    try {
        // Assuming accessToken is obtained elsewhere and set correctly
        spotifyApi.setAccessToken(process.env.SPOTIFY_ACCESS_TOKEN);

        // Create a new playlist for the user
        const playlistResponse = await spotifyApi.createPlaylist(userId, 'Image Analysis Playlist', { public: false });
        const playlistId = playlistResponse.body.id;

        if (analysisResults.length === 0) {
            return res.status(400).send('No analysis results provided');
        }

        // This takes the first result's name for a track search
        const searchKeyword = analysisResults[0].name; // Assuming each result has a 'name' property
        const searchResponse = await spotifyApi.searchTracks(searchKeyword);
        const trackUris = searchResponse.body.tracks.items.map(track => track.uri).slice(0, 10);

        if (trackUris.length > 0) {
            await spotifyApi.addTracksToPlaylist(playlistId, trackUris);
            res.json({ playlistId: playlistId, tracksAdded: trackUris.length });
        } else {
            res.status(404).send(`No tracks found for keyword: ${searchKeyword}`);
        }
    } catch (error) {
        console.error('Error creating Spotify playlist:', error);
        res.status(500).send('Error creating Spotify playlist');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
