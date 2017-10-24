import { ObjectStoreItem } from '../model/object-store-item';
import { WheelShed, Wheel } from 'wheel-shed';
import * as path from 'path';
import * as uuid from 'uuid';

export class ObjectStore {
	private shed: WheelShed;

	constructor(
		private directory: string
	) {
		this.shed = new WheelShed(this.directory);
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

	private wheelToObjectStoreItemWithFile(wheel: Wheel, file: string): ObjectStoreItem {
		let metadata = wheel.getMetadata();

		return {
			uuid: metadata.id,
			created: metadata.created,
			modified: metadata.modified,
			path: metadata.name,
			file: file
		}
	}

	private wheelToObjectStoreItem(wheel: Wheel): Promise<ObjectStoreItem> {
		let metadata = wheel.getMetadata();

		return new Promise<ObjectStoreItem>((resolve, reject) => {
			wheel.getContent()
				.then(content => {
					resolve({
						uuid: metadata.id,
						created: metadata.created,
						modified: metadata.modified,
						path: metadata.name,
						file: content
					})
				})
				.catch(reject);
		});
	}

	containsObjectWithPath(path: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.shed.filter((wheel) => wheel.getName() === path)
				.then(wheels => {
					resolve(wheels.length > 0);
				})
				.catch(reject);
		});
	}

	retrieveContentByPath(path: string): Promise<string> {
		return new Promise((resolve, reject) => {
			this.shed.filter((wheel) => wheel.getName() === path)
				.then(wheels => {
					let wheel: Wheel = wheels[0];
					if (wheel) {
						wheel.getContent()
							.then(contentString => resolve(contentString))
							.catch(reject);
					} else {
						reject(new Error(`No wheel found with name ${path}`));
					}
				})
				.catch(reject);
		});
	}

	storeByPath(path: string, blob: string): Promise<ObjectStoreItem> {
		return new Promise((resolve, reject) => {
			this.containsObjectWithPath(path)
				.then(containsObject => {
					let wheel: Wheel;

					let doStore = () => {
						if (wheel) {
							wheel.setContent(blob)
								.then(() => {
									let osi = this.wheelToObjectStoreItemWithFile(wheel, blob)
									resolve(osi);
								})
								.catch(reject);
						} else {
							reject(new Error(`Could not store to wheel with name ${path}`));
						}
					}

					if (containsObject) {
						this.shed.filter((wheel) => wheel.getName() === path)
							.then(wheels => {
								wheel = wheels[0];
								doStore();
							})
							.catch(reject);
					} else {
						try {
							wheel = new Wheel(this.shed, true);
							doStore();
						} catch (e) {
							reject(new Error(e));
						}
					}
				})
				.catch(err => reject(err));
		});
	}

	deleteByPath(path: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.shed.filter((wheel) => wheel.getName() === path)
				.then(wheels => {
					let res = 0; let rej = 0;

					let tryResolve = () => {
						if (res >= wheels.length) {
							resolve();
						} else if (res + rej >= wheels.length) {
							reject(new Error("Could not remove all wheels"));
						}
					}

					for (let wheel of wheels) {
						wheel.remove()
							.then(() => {
								res++;
								tryResolve();
							})
							.catch(() => {
								rej++;
								tryResolve();
							});
					}
				})
				.catch(reject);
		});
	}

	getAllObjects(): Promise<ObjectStoreItem[]> {
		return new Promise((resolve, reject) => {
			this.shed.filter(() => true)
				.then(wheels => {
					let osiarray: ObjectStoreItem[] = [];
					let res = 0; let rej = 0;

					let tryResolve = () => {
						if (res >= wheels.length) {
							resolve();
						} else if (res + rej >= wheels.length) {
							reject(new Error("Could not remove all wheels"));
						}
					}

					for (let wheel of wheels) {
						this.wheelToObjectStoreItem(wheel)
							.then(osi => {
								osiarray.push(osi);
								res++;
								tryResolve();
							})
							.catch(err => {
								rej++;
								tryResolve();
							})
					}
				})
				.catch(reject);
		});
	}
}
