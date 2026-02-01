export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url)

    if (url.pathname.startsWith("/api/")) {
      return new Response("api ok")
    }

    return env.ASSETS.fetch(request)
  }
}
