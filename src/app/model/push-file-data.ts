export class PushFileData {
	path: string;
	contents: string;
	project: string;
	
	public static isSane(data?: PushFileData) {
		if (!data) {
			return false;
		}
		
		let sane = true;
		sane = sane && typeof data.contents === "string";
		sane = sane && typeof data.path === "string";
		sane = sane && typeof data.project === "string";
		
		return sane;
	}
}
