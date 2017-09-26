import { Request, Response, NextFunction } from 'express';
import { BaseHandler } from './base-handler';
import { SyncEvent } from '../classes/sync-event';
import { EventProcessor } from '../event-processor';

export class EventHandler extends BaseHandler {
	path = "/event";

	post(request: Request, response: Response, next: NextFunction) {
		let events: SyncEvent[] = request.body;

		if (events.forEach) { // Determines if the post body really is an array
			events.forEach(event => {
				EventProcessor.getInstance().pushEvent(event);
			});
			return;
		}

		response.status(400).send("Bad Request");
	}
}
