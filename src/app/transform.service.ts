// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class TransformService {

//   private apiKey = "AIzaSyAjzwS_pXuKkXmfFe_ZkxShj59SNFSY2no"; // ← Replace this

//   async transformImage(base64: string, mimeType: string, prompt: string) {
//     const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + this.apiKey;

//     const body = {
//       contents: [
//         {
//           parts: [
//             { inlineData: { data: base64, mimeType } },
//             { text: prompt }
//           ]
//         }
//       ]
//     };

//     const response = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body)
//     });

//     const result = await response.json();

//     try {
//       return result.candidates[0].content.parts[0].inlineData.data;
//     } catch {
//       console.error(result);
//       throw new Error("No image returned — check API key or quota.");
//     }
//   }
// }
