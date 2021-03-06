import * as path from 'path';
import * as debug from 'debug';

let d = debug("sync-apparatus:variables")

export class Variables {
	public static projectBasePath: string = "";
}

let folderName: string = "sa-daemon-" + (new Date()).getTime().toString();
if (process.platform === "win32") {
	Variables.projectBasePath = path.join(process.env.TEMP || "./tmp", folderName);
} else {
	Variables.projectBasePath = path.join("/tmp", folderName);
}
path.normalize(Variables.projectBasePath);

d(`Using project base path ${Variables.projectBasePath}`);
