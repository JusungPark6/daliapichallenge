const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'code';
const SCOPES = ['playlist-modify-private', 'playlist-read-private', 'playlist-modify-public']; // Adjust scopes as needed

const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPES.join(' '))}`;

function SpotifyAuthButton() {
  return (
    <a href={authUrl}>Login with Spotify</a>
  );
}

export default SpotifyAuthButton;
