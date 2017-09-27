import { BaseHandler } from './base-handler';
import { Request, Response, NextFunction } from 'express';
import { ClientManager } from '../client-manager';

export class ClientHandler extends BaseHandler {
	public path = "/client";

	get(request: Request, response: Response, next: NextFunction) {
		let responseList: any[] = [];
		for (let client of ClientManager.getInstance().getClients()) {
			responseList.push({
				id: client.getId(),
				name: client.getName()
			});
		}

		response.json(responseList);
	}
}
