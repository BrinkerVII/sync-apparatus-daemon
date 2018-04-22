import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as methodOverride from 'method-override';
import { HelloWorldHandler } from './handlers/hello-world-handler';
import { EventHandler } from './handlers/event-handler';
import { AnnounceHandler } from './handlers/announce-handler';
import { ClientHandler } from './handlers/client-handler';
import { ProjectHandler } from './handlers/project-handler';
import { ChangesHandler } from './handlers/changes-handler';
import { PostOfficeHandler } from './handlers/post-office-handler';

export class App {
	private static instance: App = new App();
	public static getInstance(): App {
		return App.instance;
	}

	private express: express.Application;
	private constructor() {
		this.express = express();

		this.setupMiddleware();
		this.setupRoutes();
	}

	private setupMiddleware() {
		this.express.use(logger("dev"));
		this.express.use(bodyParser.json());
		this.express.use(bodyParser.urlencoded({ extended: false }));
		this.express.use(methodOverride("X-HTTP-Method-Override"));
	}

	private registerRoute(router: express.Router, handler: any, method: string) {
		if (typeof handler[method] === "function") {
			router[method](handler.path, (request, response, next) => {
				handler[method](request, response, next);
			});
		}
	}

	private setupRoutes() {
		let router = express.Router();

		let routeHandlers: any[] = [
			new HelloWorldHandler(),
			new EventHandler(),
			new AnnounceHandler(),
			new ClientHandler(),
			new ProjectHandler(),
			new ChangesHandler(),
			new PostOfficeHandler()
		];

		for (let handler of routeHandlers) {
			if (typeof handler.path === "string") {
				this.registerRoute(router, handler, "get");
				this.registerRoute(router, handler, "post");
				this.registerRoute(router, handler, "put");
				this.registerRoute(router, handler, "delete");
			}
		}

		this.express.use("/", router);
	}

	public getExpressApplication(): express.Application {
		return this.express;
	}
}
