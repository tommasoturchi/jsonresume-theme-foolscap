var fs = require("fs");
var path = require("path");
var Handlebars = require("handlebars");
var groupBy = require("handlebars-group-by");
var sass = require("node-sass");
const sassPackageImporter = require("node-sass-package-importer");

function render(resume) {
  var tpl = fs.readFileSync(__dirname + "/resume.hbs", "utf-8");
  var partialsDir = path.join(__dirname, "partials");
  var filenames = fs.readdirSync(partialsDir);

  filenames.forEach(function (filename) {
    var matches = /^([^.]+).hbs$/.exec(filename);
    if (!matches) {
      return;
    }
    var name = matches[1];
    var filepath = path.join(partialsDir, filename);
    var template = fs.readFileSync(filepath, "utf8");

    Handlebars.registerPartial(name, template);
  });

  groupBy.register(Handlebars);

  Handlebars.registerHelper("expandCountryCode", function (countryCode) {
    switch (countryCode) {
      case "UK":
        return "United Kingdom";
      case "IT":
        return "Italy";
      default:
        return "Unknown country code";
    }
  });

  Handlebars.registerHelper("escape", function (email) {
    return email.replace("@", " at ");
  });

  Handlebars.registerHelper("lowerCase", function (string) {
    return string.toLowerCase();
  });

  return Handlebars.compile(tpl)({
    css: sass.renderSync({
      file: __dirname + "/style.scss",
      importer: sassPackageImporter(),
    }).css,
    resume: resume,
  });
}

module.exports = {
  render: render,
};
