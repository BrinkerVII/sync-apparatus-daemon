import * as uuid from 'uuid';
import { Change } from './change';
import { ObjectStoreItem } from '../model/object-store-item';
import { ProjectManager } from '../project-manager';

export interface ClientChange {
	uuid: string;
	length: number;
}

export class Client {
	private id: string;
	private name: string;
	private creationTime: Date;
	private changes: Change[] = [];

	constructor(name: string) {
		this.name = name;
		this.id = uuid.v4();
		this.creationTime = new Date();

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
		change.incrementDependencies();
	}

	public getChanges(): Change[] {
		return this.changes;
	}

	public getChangeList(project?: string): ClientChange[] {
		let changeList: ClientChange[] = [];

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

	public removeChange(change: Change) {
		let index = this.changes.indexOf(change);
		if (index >= 0) {
			this.changes.splice(index);
		}

		change.decrementDepencendies();
	}

	public getChangeById(changeId: string): Promise<Change> {
		return new Promise((resolve, reject) => {
			let selectedChange: Change;

			for (let change of this.changes) {
				if (change.getObjectStoreItem().uuid === changeId) {
					selectedChange = change;
				}
			}

			if (selectedChange) {
				resolve(selectedChange);
			} else {
				reject(new Error("Change unknown"));
			}
		});
	}
}
