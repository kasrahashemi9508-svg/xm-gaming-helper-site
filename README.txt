XM Gaming Helper: backend + API

IMPORTANT:
- This creates a new web assistant inspired by your gaming-helper use case. It does not import the private ChatGPT plugin itself.
- Never put OPENAI_API_KEY into index.html, GitHub, screenshots, or chat. Add it only in Render > your Web Service > Environment.
- OpenAI API usage may cost money. Do not add a payment method or create a key unless a parent/guardian responsible for the account approves it.
- The API is not connected until a valid key and a live Render Web Service are configured.

Deploy:
1. Add server.js and package.json to the root of your GitHub repository alongside index.html.
2. In Render, create a NEW "Web Service" (not Static Site) connected to the repository, branch main.
3. Build Command: npm install
4. Start Command: npm start
5. Choose an appropriate plan and check any costs before creating.
6. Once the service is live, add OPENAI_API_KEY under Environment Variables in Render only, if approved.
7. Optional variable OPENAI_MODEL can be set to gpt-4.1-mini.
8. Test https://YOUR-SERVICE.onrender.com/api/health; expected JSON: {"ok":true,"service":"XM Gaming Helper API"}.

Note: Current index.html does not yet have a chat form wired to /api/chat. The backend endpoint is ready, but front-end integration is a separate step. If you keep GitHub Pages as the website, the browser code must call the Render service URL and the server must be configured for cross-origin requests. Easiest path is serving index.html from the same Render Web Service.
