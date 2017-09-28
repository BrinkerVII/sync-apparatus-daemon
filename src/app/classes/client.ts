import * as uuid from 'uuid';
import { Change } from './change';
import { ObjectStoreItem } from '../model/object-store-item';
import { ProjectManager } from '../project-manager';

export class Client {
	private id: string = uuid.v4();
	private name: string;
	private creationTime: Date = new Date();
	private changes: Change[] = [];

	constructor(name: string) {
		this.name = name;
		
		ProjectManager.getInstance().addAllObjectsToClient(this);
	}

	private removeChangesWithPath(path: string) {
		if (!path) { return; }

		let index: number = -1;
		for (let i = 0; i < this.changes.length; i++) {
			if (this.changes[i].getObjectStoreItem().path === path) {
				index = i;
				break;
			}
		}

		if (index >= 0) {
			this.changes.splice(index);
			this.removeChangesWithPath(path);
		}
	}

	public getId(): string {
		return this.id;
	}

	public getName(): string {
		return this.name;
	}

	public getCreationTime(): Date {
		return this.creationTime;
	}

	public addChange(change: Change) {
		this.removeChangesWithPath(change.getObjectStoreItem().path);
		this.changes.push(change);
	}

	public getChanges(): Change[] {
		return this.changes;
	}

	public getChangeList(project?: string): { uuid: string; length: number }[] {
		let changeList: { uuid: string; length: number }[] = [];

		for (let change of this.changes) {
			let includeChange = true;
			let objectStoreItem = change.getObjectStoreItem();

			if (project) {
				if (project !== change.getProject().getName()) {
					includeChange = false;
				}
			}

			if (includeChange) {
				changeList.push({
					uuid: objectStoreItem.uuid,
					length: ObjectStoreItem.getFileLength(objectStoreItem)
				});
			}
		}

		return changeList;
	}
}
