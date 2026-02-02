export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)
    
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return new Response(HTML, {
        headers: { 'Content-Type': 'text/html; charset=UTF-8' }
      })
    }
    
    if (url.pathname === '/app.js') {
      return new Response(JS, {
        headers: { 'Content-Type': 'application/javascript; charset=UTF-8' }
      })
    }
    
    // NEW: Live page
    if (url.pathname === '/live' || url.pathname === '/live.html') {
      return new Response(LIVE_HTML, {
        headers: { 'Content-Type': 'text/html; charset=UTF-8' }
      })
    }
    
    return new Response('Not Found', { status: 404 })
  }
}

const HTML = `__HTML_CONTENT__`
const JS = `__JS_CONTENT__`
const LIVE_HTML = `__LIVE_HTML_CONTENT__`
