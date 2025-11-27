const http = require('node:http');

const PORT = 3000;

const processRequest = (req, res) => {
  if (req.url === '/') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain; utf-8');
    res.end('Hello, World Pagina de prueba!\n');
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found\n');
  }
}

const server = http.createServer(processRequest);

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});