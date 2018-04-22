import { Request, Response, NextFunction } from 'express';
import { BaseHandler } from './base-handler';
import { SyncEvent } from '../model/sync-event';
import { PushFileData } from '../model/push-file-data';
import { EVENT_TYPES } from '../constants/event-types';
import { ProjectManager } from '../project-manager';
import * as debug from 'debug';
import { Change } from '../classes/change';
import { ClientManager } from '../client-manager';
import { CHANGE_TYPES } from '../constants/change-types';
import { DeleteFileData } from '../model/delete-file-data';
import { ObjectStoreItem } from '../model/object-store-item';
import * as uuid from 'uuid';

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
									ClientManager.getInstance().getClientById(event.clientToken)
										.then(client => {
											ClientManager
												.getInstance()
												.replicateChange(new Change(
													project,
													objectStoreItem,
													CHANGE_TYPES.ADD),
												client
												);
											resolve();
										})
										.catch(reject);
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

handlerFunctions[EVENT_TYPES.DELETE_FILE] = (event: SyncEvent) => {
	return new Promise((resolve, reject) => {
		let data: DeleteFileData = event.data;
		if (DeleteFileData.isSane(data)) {
			ProjectManager.getInstance().getProjectByName(data.project)
				.then(project => {
					project.getObjectStore().deleteByPath(data.path)
						.then(() => {
							ClientManager.getInstance().removeChangesWithPath(data.path);

							let date = new Date().getTime();
							let objectStoreItem = new ObjectStoreItem()
							objectStoreItem.uuid = uuid.v4();
							objectStoreItem.file = "";
							objectStoreItem.path = data.path;
							objectStoreItem.created = date;
							objectStoreItem.modified = date;

							ClientManager.getInstance()
								.replicateChange(new Change(
									project,
									objectStoreItem,
									CHANGE_TYPES.DELETE
								));

							resolve();
						})
						.catch(reject);
				})
				.catch(reject);
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
						console.error(errors);
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
