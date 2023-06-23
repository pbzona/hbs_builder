const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const chokidar = require('chokidar');
const sass = require('node-sass');

const templatePath = path.join(__dirname, 'src', 'index.hbs');
const partialsFolderPath = path.join(__dirname, 'src', 'partials');
const scssFolderPath = path.join(__dirname, 'src', 'scss');
const scssFilePath = path.join(__dirname, 'src', 'scss', 'main.scss');
const distFolderPath = path.join(__dirname, 'dist');
const cssFolderPath = path.join(distFolderPath, 'css');
const distFilePath = path.join(distFolderPath, 'index.html');
const styleFilePath = path.join(cssFolderPath, 'style.css');
const contextFilePath = path.join(__dirname, 'src', 'context.js');

if (!fs.existsSync(distFolderPath)) {
  fs.mkdirSync(distFolderPath);
}

if (!fs.existsSync(cssFolderPath)) {
  fs.mkdirSync(cssFolderPath);
}

// Read the initial content of the index.hbs file
let templateContent = fs.readFileSync(templatePath, 'utf8');

// Function to register all partials in the partials folder
const registerPartials = () => {
  // Clear all previously registered partials
  handlebars.unregisterPartial(handlebars.partials);

  // Read the files in the partials folder
  const partialFiles = fs.readdirSync(partialsFolderPath);

  // Register each partial
  partialFiles.forEach((file) => {
    const partialName = path.parse(file).name;
    const partialPath = path.join(partialsFolderPath, file);
    const partialContent = fs.readFileSync(partialPath, 'utf8');
    handlebars.registerPartial(partialName, partialContent);
  });
};

// Function to render the template with the given context object
const renderTemplate = (context) => {
  // Compile the template
  const compiledTemplate = handlebars.compile(templateContent);

  // Render the template with the context object
  const renderedTemplate = compiledTemplate(context);

  // Write the rendered template to index.html in the dist folder
  fs.writeFileSync(distFilePath, renderedTemplate, 'utf8');

  console.log('index.html updated');
};

const compileSass = () => {
  // Compile SCSS to CSS
  sass.render(
    {
      file: scssFilePath,
      outputStyle: 'compressed',
    },
    (err, result) => {
      if (!err) {
        // Write the compiled CSS to style.css in the CSS folder
        fs.writeFileSync(styleFilePath, result.css, 'utf8');

        console.log('style.css updated');
      } else {
        console.error('SCSS compilation error:', err);
      }
    }
  );
}

// Watch for changes in the template, SCSS, and context files
const watcher = chokidar.watch([templatePath, scssFolderPath, contextFilePath], {
  ignored: /(^|[/\\])\../, // ignore dotfiles
  persistent: true,
});

// When a change is detected, handle the corresponding file type
watcher.on('change', (filePath) => {
  const fileExt = path.extname(filePath);

  if (fileExt === '.hbs') {
    // Re-register the partials
    registerPartials();

    // Re-read the template content
    templateContent = fs.readFileSync(templatePath, 'utf8');

    // Read the context object from context.js
    const context = require(contextFilePath);

    // Render the template with the updated context object
    renderTemplate(context);
  } else if (fileExt === '.scss') {
    // Compile the SCSS to CSS
    compileSass();

  } else if (filePath === contextFilePath) {
    // Clear the require cache for context.js
    delete require.cache[require.resolve(contextFilePath)];
    
    // Read the updated context object
    const context = require(contextFilePath);

    // Render the template with the updated context object
    renderTemplate(context);
  }
});

// Compile initial CSS
compileSass();

// Register the initial partials
registerPartials();

// Read the initial context object
const initialContext = require(contextFilePath);

// Render the template with the initial context object
renderTemplate(initialContext);

// Start watching for changes
console.log('Watching for changes...');
