import { ObjectStoreItem } from "../model/object-store-item";

export class Change {
	private objectStoreItem: ObjectStoreItem;

	constructor(objectStoreItem: ObjectStoreItem) {
		this.objectStoreItem = objectStoreItem;
	}
}
