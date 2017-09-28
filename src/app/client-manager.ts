import * as debug from 'debug';
import { Client } from './classes/client';
import { Change } from './classes/change';

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

	public replicateChange(change: Change, sourceClient?: string | Client) {
		if (sourceClient) {
			let realClient: Client;
			if (typeof sourceClient === "string") {
				for (let client of this.clients) {
					if (client.getId() === sourceClient) {
						realClient = client;
					}
				}
			}

			if (realClient) {
				sourceClient = realClient;
			}
		}
		let sourceClientO: Client = <Client>sourceClient;

		for (let client of this.clients) {
			let replicate = true;
			if (sourceClient && sourceClientO) {
				if (sourceClientO.getId() === client.getId()) {
					replicate = false;
				}
			}

			if (replicate) {
				client.addChange(change);
			}
		}
	}
}
