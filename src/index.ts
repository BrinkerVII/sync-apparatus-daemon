import * as http from 'http';
import * as debug from 'debug';

import { App } from './app/app';
let expressApp = App.getInstance().getExpressApplication();
debug('ts-express:server');

const PORT: number = Number.parseInt(process.env.PORT) || 3000;
expressApp.set("port", PORT);

const server = http.createServer(expressApp);
server.listen(PORT);
server.on("error", (error: NodeJS.ErrnoException) => {
	if (error.syscall !== 'listen') throw error;
	let bind = PORT.toString();
	switch (error.code) {
		case 'EACCES':
			console.error(`${bind} requires elevated privileges`);
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(`${bind} is already in use`);
			process.exit(1);
			break;
		default:
			throw error;
	}
});

server.on("listening", () => {
	let address = server.address();
	let bindString = `${address.address}:${address.port}`;
	
	debug(`Listening on ${bindString}`);
})
