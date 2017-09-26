import { Request, Response, NextFunction } from 'express';
import { BaseHandler } from './base-handler';

export class HelloWorldHandler extends BaseHandler {
	path = "/hello";

	get(request: Request, response: Response, next: NextFunction) {
		response.json({ message: (new Date()).toLocaleString() })
	}

	post(request: Request, response: Response, next: NextFunction) {
		response.json({ message: typeof request.body });
	}
}
