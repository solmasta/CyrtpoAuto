// functions/index.js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Override the static index.html
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>CryptoAuto - LIVE</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: green; }
          </style>
        </head>
        <body>
          <h1>✅ CryptoAuto Worker is RUNNING!</h1>
          <p>Worker successfully deployed at: ${request.url}</p>
          <p><a href="/health">Check Health</a></p>
          <p><a href="/api/test">Test API</a></p>
        </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({
        status: 'online',
        timestamp: new Date().toISOString(),
        worker: 'cryptoauto',
        environment: env.NODE_ENV || 'production'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('Not found: ' + url.pathname, { status: 404 });
  }
};
