export class SyncEvent {
	type: string;
	
	public static isSane(event: SyncEvent): boolean {
		let sane: boolean = true;
		sane = sane && typeof event.type === "string";
		
		return sane;
	}
}
