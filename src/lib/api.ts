const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export interface BackendStatus {
  status: string;
  timestamp: string;
  googleDriveConfigured: boolean;
  version: string;
}

/**
 * Check backend connection and Google Drive storage configuration status
 */
export async function checkBackendStatus(): Promise<BackendStatus | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/status`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Upload student profile photo directly to Google Drive backend
 */
export async function uploadProfilePictureToBackend(file: File, token?: string): Promise<{ url: string } | null> {
  try {
    const formData = new FormData();
    formData.append('profilePicture', file);
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PATCH',
      headers,
      body: formData,
    });
    if (!res.ok) return null;
    const data = await res.json();
    return { url: data.profilePicture };
  } catch (err) {
    console.warn('[Backend Upload] Google Drive API upload failed, using local storage fallback:', err);
    return null;
  }
}

/**
 * Upload academic document / certificate directly to Google Drive backend
 */
export async function uploadDocumentToBackend(file: File, title: string, type: string, token?: string) {
  try {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('title', title);
    formData.append('type', type);
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/users/documents`, {
      method: 'POST',
      headers,
      body: formData,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('[Backend Upload] Document upload failed:', err);
    return null;
  }
}
