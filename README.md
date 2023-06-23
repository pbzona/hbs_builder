# Dynamic Handlebars Templating with Node.js

This project provides a script that allows you to dynamically render Handlebars templates using Node.js. It leverages the Handlebars templating engine, along with chokidar for file watching and node-sass for SCSS compilation.

## Project Structure

The project expects the following structure:

- `src/`: This directory contains the source files.
  - `index.hbs`: The main Handlebars template file.
  - `context.js`: A JavaScript file that exports the context object to be used in the template.
  - `partials/`: A directory containing partials to be included in the main template.
  - `scss/`: A directory containing SCSS files.
    - `main.scss`: The main SCSS file to be compiled.
- `dist/`: This directory contains the output files.
  - `css/`: A directory where the compiled CSS file will be generated.
    - `style.css`: The compiled CSS file.

## Usage

1. Install the dependencies by running `npm install`.
2. Customize your Handlebars template in `src/index.hbs` and add any desired partials to `src/partials/`.
3. Customize your SCSS styles in `src/scss/style.scss`.
4. Customize your context object in `src/context.js`. Export the desired context object directly from this file.
5. Run the script using `npm start`

The script will watch for changes in the template, partials, SCSS files, and the context file. Whenever a change is detected, it will recompile the SCSS, update the CSS file, and render the Handlebars template with the updated context. The resulting HTML will be written to `dist/index.html`.

Open `dist/index.html` in your browser to view the rendered template.

Note: Ensure that the `dist/css/` directory exists before running the script. If it doesn't exist, the script will attempt to create it.
