import gulp from 'gulp';

import cssnano from 'cssnano';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import browserSync from 'browser-sync';

import clean from 'gulp-clean';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import postcss from 'gulp-postcss';
import imagemin from 'gulp-imagemin';
import includePartials from 'gulp-file-include';

gulp.task('clean', () => gulp.src('./dist', { read: false, allowEmpty: true }).pipe(clean()));

gulp.task('scripts', () => gulp
  .src('./src/**/*.{js,jsx,json}')
  .pipe(babel())
  .pipe(concat('bundle.js'))
  .pipe(gulp.dest('./dist')));

gulp.task('styles', () => gulp
  .src('./src/**/*.css')
  .pipe(postcss([tailwindcss(), autoprefixer(), cssnano()]))
  .pipe(concat('bundle.css'))
  .pipe(gulp.dest('./dist')));

gulp.task('html', () => gulp
  .src('./src/**/*.{html,php}')
  .pipe(includePartials())
  .pipe(gulp.dest('./dist')));

gulp.task('fonts', () => gulp
  .src('./src/fonts/**/*.{woff2,woff,eot,ttf,svg}')
  .pipe(gulp.dest('./dist/fonts')));

gulp.task('images', () => gulp
  .src('./src/img/**/*.{jpg,png,svg,gif}')
  .pipe(imagemin())
  .pipe(gulp.dest('./dist/img')));

gulp.task('live', (done) => {
  browserSync.init({
    server: { baseDir: './dist' },
    port: 5000,
  });
  done();
});

gulp.task('refresh', (done) => {
  browserSync.reload();
  done();
});

gulp.task('watch', () => {
  gulp.watch('./src/**/*.{js,jsx,json}', gulp.series('scripts', 'refresh'));
  gulp.watch(
    ['./src/**/*.css', './tailwind.config.js'],
    gulp.series('styles', 'refresh'),
  );
  gulp.watch(
    './src/**/*.{html,php}',
    gulp.series('scripts', 'styles', 'html', 'refresh'),
  );
  gulp.watch(
    './src/fonts/**/*.{woff2,woff,eot,ttf,svg}',
    gulp.series('fonts', 'refresh'),
  );
  gulp.watch(
    './src/img/**/*.{jpg,png,svg,gif}',
    gulp.series('images', 'refresh'),
  );
});

gulp.task(
  'build',
  gulp.series(
    'clean',
    gulp.parallel('scripts', 'styles', 'html', 'fonts', 'images'),
  ),
);

gulp.task('serve', gulp.series('build', 'live', 'watch'));
