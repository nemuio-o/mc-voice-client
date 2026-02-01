/**
 * Static file server for voice chat client
 */
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)
    
    // Serve index.html
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return new Response(HTML, {
        headers: { 'Content-Type': 'text/html; charset=UTF-8' }
      })
    }
    
    // Serve app.js
    if (url.pathname === '/app.js') {
      return new Response(JS, {
        headers: { 'Content-Type': 'application/javascript; charset=UTF-8' }
      })
    }
    
    return new Response('Not Found', { status: 404 })
  }
}

// Inline HTML (will be replaced during deployment)
const HTML = \`__HTML_CONTENT__\`

// Inline JS (will be replaced during deployment)
const JS = \`__JS_CONTENT__\`
