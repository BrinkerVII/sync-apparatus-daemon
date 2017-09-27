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

	public init(): Promise<void> {
		console.log(this.fspath);

		return new Promise<void>((resolve, reject) => {
			resolve();
		});
	}
}
