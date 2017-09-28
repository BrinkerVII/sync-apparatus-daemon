import { ObjectStoreItem } from "../model/object-store-item";
import { Project } from "./project";

export class Change {
	constructor(
		private project: Project,
		private objectStoreItem: ObjectStoreItem
	) {
		
	}
	
	public getObjectStoreItem(): ObjectStoreItem {
		return this.objectStoreItem;
	}
	
	public getProject(): Project {
		return this.project;
	}
}
