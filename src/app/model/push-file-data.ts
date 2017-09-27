export class PushFileData {
	path: string;
	contents: string;
	project: string;
	encoding: string;

	public static isSane(data?: PushFileData) {
		if (!data) {
			return false;
		}

		let sane = true;
		sane = sane && typeof data.contents === "string";
		sane = sane && typeof data.path === "string";
		sane = sane && typeof data.project === "string";
		sane = sane && typeof data.encoding === "string";

		return sane;
	}

	public static decodeData(data: PushFileData): Promise<string> {
		return new Promise((resolve, reject) => {
			if (data.encoding == "plain") {
				resolve(data.contents);
			} else if (data.encoding == "base64") {
				try {
					let decodeBuffer = new Buffer(data.contents, 'base64');
					let decodedContents = decodeBuffer.toString();

					resolve(decodedContents);
				} catch (e) {
					reject(new Error(e));
				}
			} else {
				reject(new Error("Unsupported encoding"));
			}
		});
	}
}
