import { Variables } from '../variables';
import { ObjectStore } from './object-store';
import * as path from 'path';
import * as fs from 'fs-extra-promise';
import * as rimraf from 'rimraf';
import * as debug from 'debug';

export class Project {
	private name: string;
	private fspath: string;
	private objectStore: ObjectStore;

	constructor(name: string) {
		this.name = name;
		this.fspath = path.normalize(path.join(Variables.projectBasePath, this.name));
	}

	public getName(): string {
		return this.name;
	}

	public init(): Promise<void> {
		console.log(this.fspath);

		return new Promise<void>((resolve, reject) => {
			let initObjectStore = () => {
				this.objectStore = new ObjectStore(this.fspath);
				this.objectStore.init()
					.then(() => resolve())
					.catch(err => reject(err));
			}

			fs.isDirectoryAsync(this.fspath)
				.then(() => {
					initObjectStore();
				})
				.catch(err => {
					fs.mkdirsAsync(this.fspath)
						.then(() => {
							initObjectStore();
						})
						.catch(err => reject(err))
				})
		});
	}

	public getObjectStore(): ObjectStore {
		if (!this.objectStore) {
			debug("No object store");
		}
		return this.objectStore
	}
}
