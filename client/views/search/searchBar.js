Template.searchBar.helpers({
  searchQuery: function () {
    var searchQuery = Session.get('searchQuery');
    if (typeof searchQuery === 'object') {
      return "";
    } else {
      return searchQuery;
    }
  }
});

var performSearch = function () {
  var searchQuery = escape($("#search-input").val());
  Meteor.Router.to('/search/' + searchQuery);
};

var bindEnterToSearch = function (e) {
  console.log("enter")
  performSearch();
}

Template.searchBar.events = {
  'click #search-button': function (e) {
    e.preventDefault();
    performSearch();
  },

  'keyup #search-input': bindEnterToSearch
};
