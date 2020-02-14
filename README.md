# Web Skeleton Starter Kit

## Updates
February 14, 2020
- added `panini` package. It helps to build larger site using html templates. For more information check [panini website](https://get.foundation/sites/docs/panini.html)

February 11, 2020
  - added [bootstrap grid](https://github.com/m-spyratos/bootstrap-4-grid)
  - font-size has been rewritten
  - in `index.html` *preconnect* has been added for improving speed of site and basic semantic structure
  - `.gitignore` has been updated
  
December 10, 2019
  - kit has been rewritten to fully support new Gulp 4
  - kit has been tested, all is working 

## About
This is a starter kit for creating **static** websites. It is useful for everyone who creates websites regularly and want to automate some processes for example - minifying images, css, js, etc..

Web starter kit uses a NPM package **gulp (version 4)** to automate processes and speed up the workflow of static web development.

## Structure

```
|-build
|-dev
  |--css
  |--fonts
  |--html
  |--humans
  |--img
  |--js
  |--sass
|-gulpfile.js
|-.gitignore
|-.browserslistrc
```

## Included packages
This is a list of packages and plugins used in web starter kit. Every package is run by Gulp and help you in web development workflow

### Included packages in Gulp.js:
- gulp
- del
- browser-sync
- babel
- sass
- gulp-rename
- gulp-size
- gulp-imagemin
- gulp-uglify
- gulp-newer
- gulp-cleanhtml
- gulp-wait2
- [panini](https://github.com/foundation/panini)
- post-css
  - postcss-preset-env
  - autoprefixer
  - cssnano

### Other included packages
- [LazySizes](http://afarkas.github.io/lazysizes/#examples)
  - for lazy-loading images
- [jQuery v3.4.1](https://jquery.com/)
  - for making quick changes and improving interactivity on website
- [font-awesome](https://fontawesome.com/v4.7.0/)
  - it's still functioning and it's free!
- [fontello](http://fontello.com/)
  - you don't need all icons in font-awesome. This tool allows you to pick and use only icons which you are going to use
- [bootstrap 4 grid](https://github.com/m-spyratos/bootstrap-4-grid)
- [humans.txt](http://humanstxt.org/Standard.html)
  - we are still humans who build the web, aren't we? 

## What you need before to run the web starter kit
- **node.js**
- optional: you can also install **yarn** for better and easier package management

## How to install and run web starter kit
1) Download this kit
    ```
    git clone https://github.com/adamhemzal/web-skeleton-starter-kit.git
    ```

2) Initiate project. It'll create a `package.json` file. **I highly suggest using [yarn](https://yarnpkg.com/)** instead of npm

    yarn

    ```
    yarn init

    yarn init -y
    ```  
    
    npm

    ```
    npm init

    npm init -y // I recommend using this line, because it'll skip the annoying questions.
    ```


3) Install all packages. Simply copy and paste the code bellow. The same code can be found in `gulpfile.js`

    npm

    ```
    npm install --save-dev gulp del browser-sync gulp-babel @babel/core @babel/preset-env gulp-sass node-sass gulp-rename gulp-size gulp-imagemin gulp-uglify gulp-newer gulp-cleanhtml gulp-wait2 gulp-postcss postcss-preset-env cssnano autoprefixer panini
    ```

    yarn

    ```
    yarn add --dev gulp del browser-sync gulp-babel @babel/core @babel/preset-env gulp-sass node-sass gulp-rename gulp-size gulp-imagemin gulp-uglify gulp-newer gulp-cleanhtml gulp-wait2 gulp-postcss postcss-preset-env cssnano autoprefixer panini
    ```

## Workflow
TODO

### Using Fontello
- visit [Fontello](http://fontello.com/) site
- select icons which you want and need
- download icons using **Download** button on the website
- unzip file and open `fontello-codes.css`
- copy all code from `fontello-codes.css` to the bottom of the file `dev/sass/fontello/_main-fontello.scss` and replace the previous icons
- if you want to use fontello, check the line `@import "fontello/fontello.scss";` in file `style.scss` if it is uncommented
