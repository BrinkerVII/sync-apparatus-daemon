import { Variables } from '../variables';
import * as path from 'path';
import * as fs from 'fs-extra-promise';
import * as rimraf from 'rimraf';

export class Project {
	private name: string;
	private fspath: string;

	constructor(name: string) {
		this.name = name;
		this.fspath = path.normalize(path.join(Variables.projectBasePath, this.name));
	}

	public getName(): string {
		return this.name;
	}

	public fsInit(): Promise<void> {
		console.log(this.fspath);

		return new Promise<void>((resolve, reject) => {
			fs.isDirectoryAsync(this.fspath)
				.then((pe) => {
					if (pe) {
						rimraf(this.fspath, (err) => {
							if (err) {
								reject(err);
							} else {
								resolve();
							}
						});
					} else {
						fs.mkdirs(this.fspath)
							.then(() => resolve())
							.catch(err => reject(err));
					}
				})
				.catch(err => {
					fs.mkdirsAsync(this.fspath)
						.then(() => resolve())
						.catch(err => reject(err));
				});
		});
	}
}
