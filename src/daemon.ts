import * as http from 'http';
import * as debug from 'debug';

import { App } from './app/app';
let d = debug('sync-apparatus:index');

const PORT: number = Number.parseInt(process.env.PORT) || 3000;

export class Daemon {
	private server: http.Server;
	private expressApp = App.getInstance().getExpressApplication();
	private isListening: boolean = false;

	constructor() { }

	listen(port: number = PORT): Daemon {
		if (this.isListening) {
			d("Server already listening, ignoring listen call");
			return this;
		}
		this.isListening = true;

		this.server = this.expressApp.listen(port);

		this.server.on("error", (error: NodeJS.ErrnoException) => {
			if (error.syscall !== 'listen') throw error;
			let bind = port.toString();
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

		this.server.on("listening", () => {
			let address = this.server.address();
			let bindString = `${address.address}:${address.port}`;

			d(`Listening on '${bindString}'`);
		});

		return this;
	}

	stopListening() {
		if (!this.isListening) {
			d("Server is already not listening, ignoring stopListening call");
			return;
		}
		this.isListening = false;

		this.server.close(param => {
			d(`Server closed:: ${param}`);
		});
	}
}
