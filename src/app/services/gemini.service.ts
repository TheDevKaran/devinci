import { Injectable } from '@angular/core';

export type ImageResponse = { base64: string; mimeType: string };

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  // NOTE: DEFAULTS BELOW MUST BE REPLACED with your deployed backend values.
  // They will be read from window.__BACKEND_URL and window.__BACKEND_KEY if set,
  // otherwise they fall back to these values (change the fallback to your Vercel URL).
  private BACKEND_URL: string = (window as any).__BACKEND_URL || 'https://doodle-backend-five.vercel.app/api/generate';
  private FRONTEND_BACKEND_KEY: string | null = (window as any).__BACKEND_KEY || "devcodeworking?";

  /**
   * Transform an image by sending base64 + prompt to your backend.
   * The backend (Vercel) holds GEN_API_KEY and forwards requests to Google.
   */



  async transformImage(base64Image: string, mimeType: string, prompt: string): Promise<ImageResponse> {
    // Defensive: remove data: prefix if caller passed a full data URL
    const cleanedBase64 = this.stripDataUrlPrefix(base64Image);
    const body = {
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { data: cleanedBase64, mimeType } },
            { text: prompt }
          ]
        }
      ]
    };

    // Build headers. Add x-backend-key only if FRONTEND_BACKEND_KEY is set.
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.FRONTEND_BACKEND_KEY) headers['x-backend-key'] = this.FRONTEND_BACKEND_KEY;

    let resp: Response;
    try {
      resp = await fetch(this.BACKEND_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });
    } catch (networkError) {
      console.error('Network error while calling backend:', networkError);
      throw new Error(`Network error: ${networkError}`);
    }

    const status = resp.status;
    let json: any;
    try {
      json = await resp.json();
    } catch (e) {
      console.error('Failed to parse JSON response from backend. Status:', status);
      throw new Error(`Invalid JSON response from backend (status ${status}).`);
    }

    if (!resp.ok) {
      console.error('Backend returned error:', status, json);
      const apiMessage = json?.error ?? JSON.stringify(json);
      const err = new Error(`Backend error ${status}: ${apiMessage}`);
      (err as any).details = { status, raw: json };
      throw err;
    }

    // Extract base64 image defensively from known response shapes
    const candidates = json?.response?.candidates ?? json?.candidates ?? json;
    if (!Array.isArray(candidates) || candidates.length === 0) {
      console.error('No candidates in response', json);
      const err = new Error('No candidates returned from the model.');
      (err as any).details = { status, raw: json };
      throw err;
    }

    const firstCandidate = candidates[0];
    const parts = firstCandidate?.content?.parts ?? firstCandidate?.parts;
    if (!Array.isArray(parts) || parts.length === 0) {
      console.error('No parts in candidate', firstCandidate, json);
      const err = new Error('No content parts returned by model.');
      (err as any).details = { status, raw: json };
      throw err;
    }

    const imagePart = parts.find((p: any) => p?.inlineData?.data);
    if (!imagePart || !imagePart.inlineData?.data) {
      console.error('No inlineData found in parts', parts, json);
      const err = new Error('No inlineData (image) found in response.');
      (err as any).details = { status, raw: json };
      throw err;
    }

    const retBase64 = imagePart.inlineData.data;
    const retMime = imagePart.inlineData.mimeType ?? imagePart.inlineData.mimetype ?? mimeType ?? 'image/png';

    if (typeof retBase64 !== 'string' || retBase64.length === 0) {
      console.error('inlineData.data is empty or invalid', retBase64, json);
      const err = new Error('inlineData.data is empty or invalid.');
      (err as any).details = { status, raw: json };
      throw err;
    }

    return { base64: retBase64, mimeType: retMime };
  }

  private stripDataUrlPrefix(data?: string) {
    if (!data || typeof data !== 'string') return '';
    const idx = data.indexOf('base64,');
    if (idx >= 0) return data.slice(idx + 7);
    return data;
  }
}
