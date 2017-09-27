import * as db from 'sqlite';
import * as path from 'path';

const CREATE_TABLE_SQL = 'CREATE TABLE IF NOT EXISTS "object" ( `uuid` TEXT, `created` INTEGER, `modified` INTEGER, `path` TEXT, `file` BLOB, PRIMARY KEY(`uuid`) )';

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
					this.connection.exec(CREATE_TABLE_SQL)
						.then(() => resolve())
						.catch(err => reject(err))
				})
				.catch(err => reject(err))
		})
	}

	containsObjectWithPath(path: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.connection.get("SELECT COUNT(*) from object WHERE path = ?", path)
				.then(result => {
					console.log(result);
					resolve(!!result);
				})
				.catch(err => reject(err));
		});
	}

	retrieveByPath(path: string): Promise<string> {
		return new Promise((resolve, reject) => {
			this.connection.get("SELECT content file from object WHERE path = ?", path)
				.then(result => {
					resolve(result);
				})
				.catch(err => reject(err));
		});
	}

	storeByPath(path: string, blob: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.containsObjectWithPath(path)
				.then(result => {
					console.log(result);
					resolve();
				})
				.catch(err => reject(err));
		});
	}
}
