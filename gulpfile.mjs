import gulp from "gulp";
import { deleteSync } from "del";
import ts from "gulp-typescript";
import less from "gulp-less";
import zip from "gulp-zip";
import jsonEditor from "gulp-json-editor";

const ENVIROMENT_VARIABLE_VERSION = "MODULE_VERSION";
const DEFAULT_VERSION = "1.0.0";

gulp.task("clean", function (cb) {
    deleteSync(["dist/**", "!dist", "module.zip"]);
    cb();
});

gulp.task("compileTypescript", function () {
    const tsProject = ts.createProject("tsconfig.json");
    return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest("dist/scripts"));
});

gulp.task("compileLESS", function () {
    return gulp
        .src("src/styles/**/*.less")
        .pipe(less())
        .pipe(gulp.dest("dist/styles"));
});

gulp.task("copyAssets", function () {
    return gulp
        .src([
            "src/**",
            "!src/scripts/**",
            "!src/styles/**/*.less",
            "!src/module.json",
        ])
        .pipe(gulp.dest("dist"));
});

gulp.task("prepareManifest", function () {
    let moduleVersion = process.env[ENVIROMENT_VARIABLE_VERSION];
    if (!moduleVersion) {
        moduleVersion = DEFAULT_VERSION;
    }

    return gulp
        .src(["src/module.json"])
        .pipe(jsonEditor({ version: moduleVersion }))
        .pipe(gulp.dest("dist"));
});

gulp.task("zip", function () {
    return gulp.src("dist/**/*").pipe(zip("module.zip")).pipe(gulp.dest("."));
});

gulp.task("build", function (cb) {
    return gulp.series(
        "compileTypescript",
        "compileLESS",
        "copyAssets",
        "prepareManifest"
    )(cb);
});

gulp.task("default", function (cb) {
    return gulp.series("clean", "build")(cb);
});
