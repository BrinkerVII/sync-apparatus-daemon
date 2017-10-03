import { BaseHandler } from "./base-handler";
import { Request, Response, NextFunction } from "express";
import { ClientManager } from "../client-manager";

export class PostOfficeHandler extends BaseHandler {
	public path = "/post-office/:token/:changeId";

	get(request: Request, response: Response, next: NextFunction) {
		let sendError = (err) => {
			console.error(err);
			response.status(500).json(err.toString());
		}

		ClientManager.getInstance().getClientById(request.params.token)
			.then(client => {
				client.getChangeById(request.params.changeId)
					.then(change => {
						response.status(200).json(change.export());
					})
					.catch(sendError);
			})
			.catch(sendError);
	}

	delete(request: Request, response: Response, next: NextFunction) {
		let sendError = (err) => {
			console.error(err);
			response.status(500).json(err.toString());
		}

		ClientManager.getInstance().getClientById(request.params.token)
			.then(client => {
				client.getChangeById(request.params.changeId)
					.then(change => {
						try {
							client.removeChange(change);
							response.status(200).json("OK");
						} catch (e) {
							sendError(new Error(e));
						}
					})
					.catch(sendError);
			})
			.catch(sendError);
	}
}
