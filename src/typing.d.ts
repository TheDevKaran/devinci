declare module '@google/genai' {
  export class GoogleGenAI {
    constructor(options?: { apiKey?: string });
    models: {
      generateContent: (args: any) => Promise<any>;
    };
  }
  export type GenerateContentResponse = any;
  export default GoogleGenAI;
}
