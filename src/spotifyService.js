const SpotifyWebApi = require('spotify-web-api-node');

// Configure the Spotify API
const spotifyApi = new SpotifyWebApi({
  clientId: 'YOUR_SPOTIFY_CLIENT_ID',
  clientSecret: 'YOUR_SPOTIFY_CLIENT_SECRET',
  redirectUri: 'YOUR_REDIRECT_URI'
});

// Function to set the access token
exports.setAccessToken = (accessToken) => {
  spotifyApi.setAccessToken(accessToken);
};

// Function to search for tracks based on keywords
exports.searchTracks = async (keywords) => {
  try {
    const data = await spotifyApi.searchTracks(keywords);
    return data.body.tracks.items;
  } catch (error) {
    console.error('Error searching tracks:', error);
    throw error;
  }
};

// Function to create a playlist and add tracks
exports.createPlaylistAndAddTracks = async (userId, playlistName, trackURIs) => {
  try {
    // Create a new playlist
    const playlistResponse = await spotifyApi.createPlaylist(userId, playlistName, { public: false });
    const playlistId = playlistResponse.body.id;

    // Add tracks to the playlist
    await spotifyApi.addTracksToPlaylist(playlistId, trackURIs);
    return playlistResponse.body;
  } catch (error) {
    console.error('Error creating playlist and adding tracks:', error);
    throw error;
  }
};
