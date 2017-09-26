import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';

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
	}
	
	private setupRoutes() {
		let router = express.Router();
		
		router.get("/", (request, response, next) => {
			response.json({ message: "Hello World!"});
		});
		
		this.express.use("/", router);
	}
	
	public getExpressApplication(): express.Application {
		return this.express;
	}
}
