// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');

// Creates a client
const client = new vision.ImageAnnotatorClient();

exports.analyzeImageWithGoogleVision = async (imageUrl) => {
  try {
    const [result] = await client.objectLocalization(imageUrl);
    const objects = result.localizedObjectAnnotations;
    const analysisResults = objects.map(object => ({
      name: object.name,
      confidence: object.score,
      vertices: object.boundingPoly.normalizedVertices.map(v => `x: ${v.x}, y: ${v.y}`),
    }));
    return analysisResults;
  } catch (error) {
    console.error('Error calling Google Cloud Vision API:', error);
    throw error;
  }
};
