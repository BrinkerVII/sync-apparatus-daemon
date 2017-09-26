import { SyncEvent } from './classes/sync-event';
import { EVENT_TYPES } from './constants/event-types';

export class EventProcessor {
	private static instance: EventProcessor = new EventProcessor();
	private eventHandlers: any = {};

	public static getInstance(): EventProcessor {
		return EventProcessor.instance;
	}

	private constructor() {
		this.eventHandlers[EVENT_TYPES.PUSH] = (event: SyncEvent) => {

		}
	}

	public pushEvent(event: SyncEvent) {
		if (this.eventHandlers[event.type]) {
			this.eventHandlers[event.type](event);
		}
	}
}
