import * as debug from 'debug';
import { Client } from './classes/client';

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
}
