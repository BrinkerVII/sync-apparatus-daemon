import { Request, Response, NextFunction } from 'express';
import { BaseHandler } from './base-handler';
import { SyncEvent } from '../model/sync-event';
import { PushFileData } from '../model/push-file-data';
import { EVENT_TYPES } from '../constants/event-types';
import { ProjectManager } from '../project-manager';
import * as debug from 'debug';
import { Change } from '../classes/change';
import { ClientManager } from '../client-manager';

let d = debug("sync-apparatus:event-handler");
let handlerFunctions = {};

handlerFunctions[EVENT_TYPES.PUSH_FILE] = (event: SyncEvent) => {
	return new Promise((resolve, reject) => {
		let data: PushFileData = event.data;
		if (PushFileData.isSane(data)) {
			ProjectManager.getInstance().getProjectByName(data.project)
				.then(project => {
					PushFileData.decodeData(data)
						.then(decodedData => {
							project.getObjectStore().storeByPath(data.path, decodedData)
								.then((objectStoreItem) => {
									ClientManager.getInstance().replicateChange(new Change(objectStoreItem));
									resolve();
								})
								.catch(err => reject(err));
						})
						.catch(err => reject(err));
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
			let processedEvents = 0;
			let errors: any[] = [];

			events.forEach(event => {
				d(`Processing event of type ${event.type}`);

				if (SyncEvent.isSane(event)) {
					let f: Function = handlerFunctions[event.type];
					if (f) {
						f(event)
							.then(() => {
								d("Event handled successfully")
								processedEvents++;
								d(`Incremented processedEvents to ${processedEvents}`)
							})
							.catch(err => {
								errors.push(err);
								processedEvents++;
								d(`Incremented processedEvents to ${processedEvents}`)
							});
					} else {
						d(`Did not get an event handler for event type ${event.type}`);
					}
				} else {
					d(`Ignoring insane event`);
				}
			});

			let timer = setInterval(() => {
				if (processedEvents >= events.length) {
					if (errors.length > 0) {
						response.status(500).json(errors);
					} else {
						response.status(200).json("OK");
					}
					clearInterval(timer);
				}
			}, 100);

			return;
		}

		response.status(400).send("Bad Request");
	}
}
