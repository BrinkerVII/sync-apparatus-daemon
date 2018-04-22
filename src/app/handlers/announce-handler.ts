import { BaseHandler } from './base-handler';
import { Request, Response, NextFunction } from 'express';
import { Util } from '../util';
import { ClientManager } from '../client-manager';

export class AnnounceHandler extends BaseHandler {
	public path = "/announce";

	post(request: Request, response: Response, next: NextFunction) {
		if (!Util.validateParameters(request, response, { name: "string" })) {
			return;
		}

		response.json({
			clientId: ClientManager.getInstance().newClient(request.body.name).getId()
		});
	}
}
