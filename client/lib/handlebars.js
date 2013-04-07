var handlebarsHelpers = {
  'eachProperty': function (context, options) {
    var ret = "";
    for (var key in context) {
      ret = ret + options.fn({ key: key, value: context[key] });
    }
    return ret;
  }
};

for (var name in handlebarsHelpers) {
  Handlebars.registerHelper(name, handlebarsHelpers[name]);
}
