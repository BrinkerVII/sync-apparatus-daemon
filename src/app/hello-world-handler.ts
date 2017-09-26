import { Request, Response, NextFunction } from 'express';

export class HelloWorldHandler {
	path = "/";
	
	get(request: Request, response: Response, next: NextFunction) {
		response.json({ message: "Hello World! " + (new Date()).toLocaleString() });
	}
}
