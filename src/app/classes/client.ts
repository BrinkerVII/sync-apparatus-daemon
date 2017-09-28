import * as uuid from 'uuid';
import { Change } from './change';

export class Client {
	private id: string = uuid.v4();
	private name: string;
	private creationTime: Date = new Date();
	private changes: Change[] = [];

	constructor(name: string) {
		this.name = name;
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
		this.changes.push(change);
	}
	
	public getChanges(): Change[] {
		return this.changes;
	}
}
