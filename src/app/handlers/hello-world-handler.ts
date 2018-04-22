import { Request, Response, NextFunction } from 'express';
import { BaseHandler } from './base-handler';

export class HelloWorldHandler extends BaseHandler {
	path = "/hello";

	get(request: Request, response: Response, next: NextFunction) {
		let body = {
			defaultString: "sync-apparatus-daemon",
			serverName: "Sync Apparatus",
			serverTime: (new Date()).toLocaleString()
		}
		
		response.json(body);
	}

	post(request: Request, response: Response, next: NextFunction) {
		response.json({ message: typeof request.body });
	}
}
