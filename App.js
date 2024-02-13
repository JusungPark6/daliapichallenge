import React, { useState, useEffect } from 'react';
import RandomPhotoButton from './RandomPhotoButton';
import SpotifyAuthButton from './SpotifyAuthButton';

function App() {
  const [accessToken, setAccessToken] = useState('');
  useEffect(() => {
    console.log(window.location.href); // Or console.log for less intrusive debugging
  }, []);

  useEffect(() => {
    let token = window.localStorage.getItem('spotifyAccessToken');
    console.log('Token from storage:', token);
  
    if (!token) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      token = params.get('access_token');
      console.log('Token from URL:', token);
  
      if (token) {
        window.localStorage.setItem('spotifyAccessToken', token); // Save for future sessions
        setAccessToken(token);
        window.location.hash = ''; // Clean up URL
      }
    } else {
      setAccessToken(token); // Use token from local storage if present
    }
  }, []);

  return (
    <div className="App">
      <h1>Photo to Playlist</h1>
      {!accessToken ? (
  <SpotifyAuthButton />
) : (
  <RandomPhotoButton accessToken={accessToken} />
)}
    </div>
  );
}

export default App;
