import { ObjectStoreItem } from "../model/object-store-item";
import { Project } from "./project";

export class Change {
	private dependencies: number = 0;
	
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
	
	public incrementDependencies(amount: number = 1): number {
		this.dependencies += amount;
		return this.dependencies;
	}
	
	public decrementDepencendies(amount: number = 1): number {
		this.dependencies -= amount;
		return this.dependencies;
	}
}
