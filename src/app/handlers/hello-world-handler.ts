import { Request, Response, NextFunction } from 'express';
import { BaseHandler } from './base-handler';

export class HelloWorldHandler extends BaseHandler {
	path = "/";
	
	get(request: Request, response: Response, next: NextFunction) {
		response.json({ message: "Hello World! " + (new Date()).toLocaleString() });
	}
}
