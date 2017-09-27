import { Variables } from './variables';
import { Project } from './classes/project';
import * as debug from 'debug';

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
				debug("Project exists, ignoring");
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
}
