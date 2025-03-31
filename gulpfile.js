// const gulp = require('gulp');
// const fileInclude = require('gulp-file-include');
// const sass = require('gulp-sass')(require('sass'));
// const path = require('path');
//
// const paths = {
//     src: {
//         html: './*.html',
//         sassMain: './sass/style.sass',
//         sassWatch: ['./sass/**/*.sass', './blocks/**/*.sass'],
//         blocks: './blocks/common/'
//     },
//     dist: {
//         base: './dist/',
//         css: './dist/css/'
//     }
// };
//
// // HTML задача
// gulp.task('html', () => {
//     return gulp.src(paths.src.html)
//         .pipe(fileInclude({
//             prefix: '@@',
//             basepath: path.resolve(__dirname, paths.src.blocks)
//         }))
//         .pipe(gulp.dest(paths.dist.base));
// });
//
// // SASS задача с поддержкой новых модулей
// gulp.task('sass', () => {
//     return gulp.src(paths.src.sassMain)
//         .pipe(sass({
//             outputStyle: 'compressed',
//             quietDeps: true // Скрываем deprecated-предупреждения
//         }).on('error', sass.logError))
//         .pipe(gulp.dest(paths.dist.css));
// });
//
// // Вотчер
// gulp.task('watch', () => {
//     gulp.watch(paths.src.html, gulp.series('html'));
//     gulp.watch(paths.src.sassWatch, gulp.series('sass'));
//     gulp.watch(paths.src.blocks + '**/*.html', gulp.series('html'));
// });
//
// // Дефолтная задача
// gulp.task('default', gulp.parallel('html', 'sass'));








const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const path = require('path');
const del = require('del');
const browserSync = require('browser-sync').create();

const paths = {
    src: {
        html: ['./*.html', './pages/**/*.html'],
        sassMain: './sass/style.sass',
        sassWatch: ['./sass/**/*.sass', './blocks/**/*.sass'],
        blocks: './blocks/',
        assets: './assets/**/*'
    },
    dist: {
        base: './dist/',
        css: './dist/css/',
        pages: './dist/pages/'
    }
};

// Очистка dist
gulp.task('clean', () => del(['dist/**/*']));

// HTML задача
gulp.task('html', () => {
    return gulp.src(paths.src.html)
        .pipe(fileInclude({
            prefix: '@@',
            basepath: path.resolve(__dirname, paths.src.blocks),
            context: {
                baseUrl: './'
            }
        }))
        .pipe(gulp.dest(paths.dist.base))
        .pipe(browserSync.stream());
});

// SASS задача с обработкой ошибок
gulp.task('sass', () => {
    return gulp.src(paths.src.sassMain)
        .pipe(sass({
            outputStyle: 'compressed',
            quietDeps: true,
            includePaths: [path.resolve(__dirname, 'blocks')]
        }).on('error', sass.logError))
        .pipe(gulp.dest(paths.dist.css))
        .pipe(browserSync.stream());
});

// Копирование дополнительных ресурсов
gulp.task('assets', () => {
    return gulp.src(paths.src.assets)
        .pipe(gulp.dest(paths.dist.base + 'assets/'));
});

// Сервер
gulp.task('serve', () => {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
});

// Вотчер
gulp.task('watch', () => {
    gulp.watch(paths.src.html, gulp.series('html'));
    gulp.watch(paths.src.sassWatch, gulp.series('sass'));
    gulp.watch(paths.src.blocks + '**/*.html', gulp.series('html'));
});

// Сборка
gulp.task('build', gulp.series('clean', gulp.parallel('html', 'sass', 'assets')));

// Дефолтная задача
gulp.task('default', gulp.series('build', gulp.parallel('serve', 'watch')));








