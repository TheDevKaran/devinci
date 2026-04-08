export const environment = {
  production: false,
  // You can set your API key on the window object before bootstrapping or replace this.
  geminiApiKey: (window as any).__GEMINI_API_KEY || '',
  apiBaseUrl: 'https://devinci-backend-3.onrender.com'

};
