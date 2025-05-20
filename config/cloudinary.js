// cloudinary.js

/**
 * Uploads an image to Cloudinary.
 * @param {string} imageUri - The local URI of the image.
 * @param {string} mimeType - The MIME type of the image (e.g., 'image/jpeg').
 * @param {string} fileName - The file name to send (e.g., 'photo.jpg').
 * @returns {Promise<string>} The secure URL of the uploaded image.
 */
export const uploadImageToCloudinary = async (imageUri, mimeType = 'image/jpeg', fileName = 'upload.jpg') => {
  const cloudName = 'dkymxgxlb'; // Replace with your Cloudinary cloud name
  const uploadPreset = 'my-recipe-App'; // Replace with your unsigned upload preset

  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: mimeType,
    name: fileName,
  });
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (response.ok && data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error(data.error?.message || 'Cloudinary upload failed');
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};
