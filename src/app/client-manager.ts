import * as debug from 'debug';
import { Client } from './classes/client';
import { Change } from './classes/change';
import { Project } from './classes/project';

let d = debug("sync-apparatus:client-manager");

export class ClientManager {
	private static instance: ClientManager = new ClientManager();
	public static getInstance(): ClientManager {
		return ClientManager.instance;
	}

	private clients: Client[] = [];

	public newClient(name: string): Client {
		let client = new Client(name);
		let clientString = `Added new client '${client.getName()}' (${client.getId()})`;
		d(clientString);

		this.clients.push(client);
		return client;
	}

	public getClients(): Client[] {
		return this.clients;
	}

	public getClientById(token: string): Promise<Client> {
		return new Promise((resolve, reject) => {
			let client: Client;

			for (let knownClient of this.clients) {
				if (knownClient.getId() === token) {
					client = knownClient;
				}
			}

			if (client) {
				resolve(client);
			} else {
				reject(new Error("Client unkown"));
			}
		});
	}

	public replicateChange(change: Change, sourceClient?: Client) {
		for (let client of this.clients) {
			let replicate = true;
			if (sourceClient) {
				if (sourceClient.getId() === client.getId()) {
					replicate = false;
				}
			}

			if (replicate) {
				client.addChange(change);
			}
		}
	}

	public removeChangesOfProject(project: Project) {
		let projectName = project.getName();

		for (let client of this.clients) {
			let rubbish: Change[] = [];

			for (let change of client.getChanges()) {
				if (change.getProject().getName() === projectName) {
					rubbish.push(change);
				}
			}

			for (let change of rubbish) {
				client.removeChange(change);
			}
		}
	}

	public removeChangesWithPath(path: string) {
		for (let client of this.clients) {
			let rubbish: Change[] = [];

			for (let change of client.getChanges()) {
				if (change.getObjectStoreItem().path === path) {
					rubbish.push(change);
				}
			}

			for (let change of rubbish) {
				client.removeChange(change);
			}
		}
	}

	public removeClient(client: Client): Promise<void> {
		return new Promise((resolve, reject) => {
			let newClientsArray: Client[] = [];

			for (let knownClient of this.clients) {
				if (knownClient.getId() !== client.getId()) {
					newClientsArray.push(client);
				}
			}

			this.clients = newClientsArray;
			resolve();
		});
	}
}
