const { google } = require('googleapis');
const { Readable } = require('stream');
const path = require('path');
const fs = require('fs');

const credentialsPath = process.env.GOOGLE_CREDENTIALS_PATH
  ? path.resolve(process.cwd(), process.env.GOOGLE_CREDENTIALS_PATH)
  : path.join(__dirname, '../../google-credentials.json');

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '';

let drive = null;
let isConfigured = false;

// Initialize Google Drive API client defensively
try {
  if (fs.existsSync(credentialsPath)) {
    const auth = new google.auth.GoogleAuth({
      keyFile: credentialsPath,
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file'
      ],
    });
    drive = google.drive({ version: 'v3', auth });
    isConfigured = true;
    console.log('[Google Drive] Authenticated successfully with Service Account at:', credentialsPath);
  } else {
    console.warn(
      '[Google Drive Notice] google-credentials.json not found at:',
      credentialsPath,
      '\n-> Running in fallback mode. Uploads will generate mock storage URLs until credentials are provided.'
    );
  }
} catch (err) {
  console.error('[Google Drive Init Error]:', err.message);
}

/**
 * Upload a file buffer to Google Drive
 * @param {Express.Multer.File} fileObject
 * @param {string} [customFolderId]
 * @returns {Promise<{ fileId: string, webViewLink: string, directUrl: string, thumbnailLink: string }>}
 */
async function uploadToDrive(fileObject, customFolderId = FOLDER_ID) {
  if (!fileObject || !fileObject.buffer) {
    throw new Error('No file buffer provided for upload');
  }

  // Graceful fallback if credentials are not yet configured
  if (!isConfigured || !drive) {
    console.warn('[Google Drive Mock] Storing simulated URL for hackathon development.');
    const mockId = 'mock_gdrive_' + Date.now() + '_' + Math.random().toString(36).substring(7);
    return {
      fileId: mockId,
      webViewLink: `https://drive.google.com/file/d/${mockId}/view?usp=sharing`,
      directUrl: `https://lh3.googleusercontent.com/d/${mockId}`,
      thumbnailLink: `https://drive.google.com/thumbnail?id=${mockId}&sz=w500`,
    };
  }

  const bufferStream = new Readable();
  bufferStream.push(fileObject.buffer);
  bufferStream.push(null);

  const sanitizedFileName = `${Date.now()}_${fileObject.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

  const fileMetadata = {
    name: sanitizedFileName,
    ...(customFolderId ? { parents: [customFolderId] } : {}),
  };

  const media = {
    mimeType: fileObject.mimetype || 'application/octet-stream',
    body: bufferStream,
  };

  try {
    // 1. Create file on Drive
    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, name, webViewLink, webContentLink, thumbnailLink',
    });

    const fileId = file.data.id;

    // 2. Grant public read permission so avatar / certificates render in frontend
    try {
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
    } catch (permErr) {
      console.warn('[Google Drive Permission Warning]:', permErr.message);
    }

    // Direct image embed URL using Google CDN
    const directUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
    const thumbnailLink = file.data.thumbnailLink || `https://drive.google.com/thumbnail?id=${fileId}&sz=w500`;

    return {
      fileId: fileId,
      webViewLink: file.data.webViewLink,
      directUrl: directUrl,
      thumbnailLink: thumbnailLink,
    };
  } catch (error) {
    console.error('[Google Drive Upload Error]:', error.message);
    throw new Error('Google Drive upload failed: ' + error.message);
  }
}

module.exports = {
  uploadToDrive,
  isDriveConfigured: () => isConfigured,
};
