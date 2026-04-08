// // proxy-server.js - improved dev proxy with health endpoint and dotenv support
// import express from 'express';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import dotenv from 'dotenv';

// dotenv.config(); // loads .env into process.env

// const app = express();
// app.use(cors({ origin: true }));
// app.use(bodyParser.json({ limit: '80mb' }));

// const API_KEY = process.env.GEN_API_KEY;
// const PORT = process.env.PROXY_PORT || 3000;

// if (!API_KEY) {
//   console.error('ERROR: GEN_API_KEY not found in environment (.env or env vars). Exiting.');
//   process.exit(1);
// }

// // health check
// app.get('/health', (req, res) => {
//   res.json({ ok: true, time: new Date().toISOString(), proxyTo: 'generativelanguage.googleapis.com' });
// });

// // debug: show incoming body size & truncated preview
// app.post('/api/generate', async (req, res) => {
//   try {
//     console.log('[proxy] /api/generate called. body keys:', Object.keys(req.body || {}));
//     // forward to Google
//     const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${API_KEY}`;
//     const googleResp = await fetch(url, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(req.body),
//     });

//     const text = await googleResp.text();

//     // Pass through status
//     res.status(googleResp.status);

//     // If google returned JSON, send parsed JSON; otherwise send text
//     try {
//       const json = JSON.parse(text);
//       return res.json(json);
//     } catch (e) {
//       console.warn('[proxy] Google returned non-JSON. Returning raw text. status=', googleResp.status);
//       return res.send(text);
//     }
//   } catch (err) {
//     console.error('[proxy] error forwarding to Google:', err);
//     return res.status(502).json({ error: 'Proxy forwarding failed', detail: String(err) });
//   }
// });

// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`[proxy] listening on http://0.0.0.0:${PORT} — GEN_API_KEY loaded: ${!!API_KEY}`);
// });
