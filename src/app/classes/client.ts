import * as uuid from 'uuid';

export class Client {
	private id: string = uuid.v4();
	private name: string;
	private creationTime: Date = new Date();

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
}
