const gulp = require('gulp');
const typescript = require('gulp-typescript');
const JSON_FILES = ['src/*.json', 'src/**/*.json'];

const project = typescript.createProject("tsconfig.json");

gulp.task("build", () => {
	const result = project.src()
		.pipe(project());

	return result.js.pipe(gulp.dest("dist"));
});

gulp.task("assets", () => {
	return gulp.src(JSON_FILES)
		.pipe(gulp.dest("dist"));
});

gulp.task("build-all", ["build", "assets"]);

gulp.task("watch", ["build"], () => {
	gulp.watch("src/**/*.ts", ["build"]);
});


gulp.task("default", ["build-all"]);
