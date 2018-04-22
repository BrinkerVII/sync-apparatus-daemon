export class DeleteFileData {
	path: string;
	project: string;
	clientToken?: string;
	
	public static isSane(data: DeleteFileData): boolean {
		let sane = true;
		
		sane = sane && typeof data.path === "string";
		sane = sane && typeof data.project == "string";
		
		if (data.clientToken) {
			sane = sane && typeof data.clientToken === "string";
		}
		
		return sane;
	}
}
