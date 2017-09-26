import { SyncEvent } from './classes/sync-event';

export class EventProcessor {
	private static instance: EventProcessor = new EventProcessor();
	public static getInstance(): EventProcessor {
		return EventProcessor.instance;
	}
	
	private constructor() {
		
	}
	
	public pushEvent(event: SyncEvent) {
		
	}
}
