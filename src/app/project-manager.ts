import { Variables } from './variables';
import { Project } from './classes/project';
import * as debug from 'debug';
import { Client } from './classes/client';
import { Change } from './classes/change';

let d = debug("sync-apparatus:project-manager");

export class ProjectManager {
	private static instance: ProjectManager = new ProjectManager();
	public static getInstance(): ProjectManager {
		return ProjectManager.instance;
	}

	private projects: Project[] = [];

	public projectExists(name: string) {
		for (let project of this.projects) {
			if (project.getName() === name) {
				return true;
			}
		}

		return false;
	}

	public addProject(name: string): Promise<Project> {
		return new Promise<Project>((resolve, reject) => {
			if (this.projectExists(name)) {
				d("Project exists, ignoring");
				return reject(new Error("Project exists"));
			}

			let project = new Project(name);
			project.init()
				.then(() => {
					this.projects.push(project);
					resolve(project)
				})
				.catch(err => reject(err));
		});
	}

	public getProjectByName(name: string): Promise<Project> {
		return new Promise((resolve, reject) => {
			let project: Project;

			for (let existingProject of this.projects) {
				if (existingProject.getName() === name) {
					project = existingProject;
					break;
				}
			}

			if (project) {
				resolve(project);
			} else {
				reject(new Error("Project does not exist"));
			}
		});
	}

	public addAllObjectsToClient(client: Client) {
		for (let project of this.projects) {
			project.getObjectStore().getAllObjects()
				.then(objects => {
					objects.forEach(object => {
						client.addChange(new Change(project, object));
					});
				})
				.catch(err => console.error(err));
		}
	}
}
