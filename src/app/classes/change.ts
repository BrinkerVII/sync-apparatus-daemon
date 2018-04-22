import { ObjectStoreItem } from "../model/object-store-item";
import { Project } from "./project";
import { CHANGE_TYPES } from "../constants/change-types";

export class Change {
	private dependencies: number = 0;

	constructor(
		private project: Project,
		private objectStoreItem: ObjectStoreItem,
		private type: string = CHANGE_TYPES.NOP
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

	public export(): any {
		let exportedObject = {
			path: this.objectStoreItem.path,
			file: this.objectStoreItem.file,
			type: this.type
		}

		return exportedObject;
	}
}
