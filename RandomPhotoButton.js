import React, { useState } from 'react';
import { fetchRandomPhotos } from './unsplashService'; 
import { analyzeImageWithGoogleVision } from './imageAnalysisService'; 
import { createPlaylistBasedOnAnalysis } from './spotifyService';

const RandomPhotoButton = () => {
    const [photoUrl, setPhotoUrl] = useState('');
    const [analysisResult, setAnalysisResult] = useState([]);

    const handleFetchAnalyzeAndCreatePlaylist = async () => {
        try {
            const photos = await fetchRandomPhotos(1);
            if (photos.length > 0) {
                const url = photos[0].urls.regular;
                setPhotoUrl(url);
                
                const analysisResults = await analyzeImageWithGoogleVision(url);
                setAnalysisResult(analysisResults);
                
            }
        } catch (error) {
            console.error('Error in process:', error);
        }
    };

    return (
        <div>
            <button onClick={handleFetchAnalyzeAndCreatePlaylist}>Fetch, Analyze, and Create Playlist</button>
            {photoUrl && <img src={photoUrl} alt="Analyzed Unsplash" />}
            {/* Render analysis results and potentially playlist creation status */}
        </div>
    );
};

export default RandomPhotoButton;
