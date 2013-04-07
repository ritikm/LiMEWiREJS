var RouterFunctions = {
  searchQuery: function (query) {
    if (typeof query !== undefined) {
      Session.set('searchQuery', query);
    }
    return 'search';
  },

  settingsTab: function (tab) {
    Session.set('activeSettingsTab', tab);
    return 'settings';
  }
};

Meteor.Router.add({
  '/': 'index',
  '/library': 'library',
  '/transfers': 'transfers',
  '/register': 'register',
  '/forgot-pass': 'forgotPassword',
  '/settings/:tab': RouterFunctions.settingsTab,
  '/search/:query?': RouterFunctions.searchQuery
});

Meteor.startup(function () {
  Meteor.autorun(function () {
    // grab the current page from the router, so this re-runs every time it changes
    var page = Meteor.Router.page();
    console.log("page:", page);
  });
});
