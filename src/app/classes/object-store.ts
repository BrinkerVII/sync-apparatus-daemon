import * as db from 'sqlite';
import * as path from 'path';

export class ObjectStore {
	private name: string = "objects.sqlite";
	private connection: db.Database;

	constructor(
		private directory: string
	) {

	}

	private getFilePath(): string {
		if (!this.name.endsWith("sqlite")) {
			this.name += ".sqlite";
		}
		return path.join(this.directory, this.name);
	}

	init(): Promise<void> {
		return new Promise((resolve, reject) => {
			db.open(this.getFilePath())
				.then(connection => {
					this.connection = connection;
					resolve();
				})
				.catch(err => reject(err))
		})
	}
}
