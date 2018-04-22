import { BaseHandler } from './base-handler';
import { Request, Response, NextFunction } from 'express';
import { ClientManager } from '../client-manager';
import { Util } from '../util';

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

	delete(request: Request, response: Response, next: NextFunction) {
		if (!Util.validateParameters(request, response, { clientToken: "string" })) {
			return;
		}

		let sendError = (err) => {
			console.error(err);
			response.status(500).json(err.toString());
		}

		ClientManager.getInstance().getClientById(request.body.clientToken)
			.then(client => {
				ClientManager.getInstance().removeClient(client)
					.then(() => response.status(200).json("OK"))
					.catch(sendError);
			})
			.catch(sendError);
	}
}
