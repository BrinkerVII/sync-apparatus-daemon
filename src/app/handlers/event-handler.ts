import { Request, Response, NextFunction } from 'express';
import { BaseHandler } from './base-handler';
import { SyncEvent } from '../classes/sync-event';
import { EVENT_TYPES } from '../constants/event-types';

let handlerFunctions = {};

handlerFunctions[EVENT_TYPES.PUSH_FILE] = (event: SyncEvent) => {

};

export class EventHandler extends BaseHandler {
	path = "/event";

	post(request: Request, response: Response, next: NextFunction) {
		let events: SyncEvent[] = request.body;

		if (events.forEach) { // Determines if the post body really is an array
			events.forEach(event => {
				if (SyncEvent.isSane(event)) {
					let f: Function = handlerFunctions[event.type];
					if (f) { f(event); }
				}
			});
			return;
		}

		response.status(400).send("Bad Request");
	}
}
