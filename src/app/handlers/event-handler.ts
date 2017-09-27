import { Request, Response, NextFunction } from 'express';
import { BaseHandler } from './base-handler';
import { SyncEvent } from '../model/sync-event';
import { PushFileData } from '../model/push-file-data';
import { EVENT_TYPES } from '../constants/event-types';
import { ProjectManager } from '../project-manager';

let handlerFunctions = {};

handlerFunctions[EVENT_TYPES.PUSH_FILE] = (event: SyncEvent) => {
	return new Promise((resolve, reject) => {
		let data: PushFileData = event.data;
		if (PushFileData.isSane(data)) {
			ProjectManager.getInstance().getProjectByName(data.project)
				.then(project => {

				})
				.catch(err => reject(err));
		} else {
			reject(new Error("Data is insane"));
		}
	})
};

export class EventHandler extends BaseHandler {
	path = "/event";

	post(request: Request, response: Response, next: NextFunction) {
		let events: SyncEvent[] = request.body;

		if (events.forEach) { // Determines if the post body really is an array
			events.forEach(event => {
				if (SyncEvent.isSane(event)) {
					let f: Function = handlerFunctions[event.type];
					if (f) {
						f(event)
							.then(() => {
								response.status(200).send("OK");
							})
							.catch(err => {
								response.status(500).json(err);
							});
					}
				}
			});
			return;
		}

		response.status(400).send("Bad Request");
	}
}
