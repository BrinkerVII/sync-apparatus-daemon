import { Request, Response, NextFunction } from "express";
import { BaseHandler } from "./base-handler";
import { ClientManager } from "../client-manager";

export class ChangesHandler extends BaseHandler {
	public path = "/changes/:token/:project";

	get(request: Request, response: Response, next: NextFunction) {
		ClientManager.getInstance().getClientById(request.params.token)
			.then(client => {
				response.json(client.getChangeList(request.params.project));
			})
			.catch(err => {
				console.error(err);
				response.status(403).json(err.toString());
			});
	}
}
