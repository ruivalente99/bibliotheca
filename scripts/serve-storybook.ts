const port = Number(process.env.PORT) || 6006;

const server = Bun.serve({
  port,
  fetch(req) {
    const url = new URL(req.url);
    const filePath = "./storybook-static" + (url.pathname === "/" ? "/index.html" : url.pathname);
    const file = Bun.file(filePath);
    return new Response(file);
  },
});

console.log(`Storybook static server running on http://127.0.0.1:${server.port}`);
