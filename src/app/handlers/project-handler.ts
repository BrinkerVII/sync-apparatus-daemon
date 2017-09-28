import { BaseHandler } from './base-handler';
import { Request, Response, NextFunction } from 'express';
import { ProjectManager } from '../project-manager';
import { Util } from '../util';

export class ProjectHandler extends BaseHandler {
	public path = "/project";

	get(request: Request, response: Response, next: NextFunction) {
		response.json(ProjectManager.getInstance().getProjectList());
	}

	post(request: Request, response: Response, next: NextFunction) {
		if (!Util.validateParameters(request, response, { name: "string" })) {
			return;
		}

		ProjectManager.getInstance().addProject(request.body.name)
			.then(() => {
				response.json({ success: true });
			})
			.catch(err => {
				console.error(err);
				response.status(500).json(err.toString());
			});
	}

	delete(request: Request, response: Response, next: NextFunction) {
		if (!Util.validateParameters(request, response, { name: "string" })) {
			return;
		}

		let sendError = (err) => {
			response.status(500).json(err.toString())
		}

		ProjectManager.getInstance().getProjectByName(request.body.name)
			.then(project => {
				ProjectManager.getInstance().removeProject(project)
					.then(() => {
						response.status(200).send("OK");
					})
					.catch(err => sendError(err));
			})
			.catch(err => sendError(err));
	}
}
