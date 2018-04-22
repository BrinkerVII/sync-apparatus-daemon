import { Request, Response, NextFunction } from 'express';

export class Util {
	public static validateParameters(request: Request, response: Response, parameterList: any): boolean {
		let valid = true;

		for (let parameterKey in parameterList) {
			let parameterValue = request.body[parameterKey]
			valid = valid && typeof parameterValue === parameterList[parameterKey];
		}

		if (!valid) {
			response.status(400).send("Bad request");
		}

		return valid;
	}
}
