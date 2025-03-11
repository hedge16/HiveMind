import pug from 'pug';
import http from 'http';

let title = 'Hive Mind';
let html = pug.renderFile('./template.pug', {title : title});

http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(html);
}
).listen(8080);