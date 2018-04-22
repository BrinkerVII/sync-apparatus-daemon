export class ObjectStoreItem {
	uuid: string;
	created: number;
	modified: number;
	path: string;
	file: string;
	
	public static getFileLength(item: ObjectStoreItem) {
		return item.file.length;
	}
}
