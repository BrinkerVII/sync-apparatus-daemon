import { ObjectStoreItem } from '../model/object-store-item';
import * as db from 'sqlite';
import * as path from 'path';
import * as uuid from 'uuid';

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

	private generateObjectStoreItem(path: string, blob: string): ObjectStoreItem {
		let now = (new Date()).getTime();

		let item: ObjectStoreItem = {
			uuid: uuid.v4(),
			created: now,
			modified: now,
			path: path,
			file: blob
		};

		return item;
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

	deinit(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.connection.close().then(resolve).catch(reject);
		});
	}

	containsObjectWithPath(path: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.connection.get("SELECT COUNT(*) AS count from object WHERE path = ?", path)
				.then(result => {
					resolve(result.count !== 0);
				})
				.catch(err => reject(err));
		});
	}

	retrieveContentByPath(path: string): Promise<string> {
		return new Promise((resolve, reject) => {
			this.connection.get("SELECT content file from object WHERE path = ?", path)
				.then(result => {
					resolve(result.content);
				})
				.catch(err => reject(err));
		});
	}

	storeByPath(path: string, blob: string): Promise<ObjectStoreItem> {
		return new Promise((resolve, reject) => {
			this.containsObjectWithPath(path)
				.then(containsObject => {
					if (containsObject) {
						let run = this.connection.run("UPDATE object SET file = ?, modified = ? WHERE path = ?", [
							blob,
							(new Date()).getTime(),
							path
						]);

						run
							.then(() => {
								this.connection.get("SELECT * FROM object WHERE path = ?", path)
									.then(result => {
										resolve(result);
									})
									.catch(err => reject(err));
							})
							.catch(err => reject(err));
					} else {
						let item = this.generateObjectStoreItem(path, blob);
						let run = this.connection.run("INSERT INTO object (uuid, created, modified, path, file) VALUES(?, ?, ?, ?, ?)", [
							item.uuid,
							item.created,
							item.modified,
							item.path,
							item.file
						]);

						run
							.then(() => resolve(item))
							.catch(err => reject(err));
					}
				})
				.catch(err => reject(err));
		});
	}

	deleteByPath(path: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.containsObjectWithPath(path)
				.then((containsObject) => {
					if (containsObject) {
						let run = this.connection.run("DELETE FROM object WHERE path = ?", [path]);

						run
							.then(() => resolve())
							.catch(reject);
					} else {
						reject(new Error("Path does not exist in object store"));
					}
				})
				.catch(reject);
		});
	}

	getAllObjects(): Promise<ObjectStoreItem[]> {
		return new Promise((resolve, reject) => {
			this.connection.all("SELECT * from object")
				.then(objects => {
					resolve(objects);
				})
				.catch(err => reject(err));
		});
	}
}
