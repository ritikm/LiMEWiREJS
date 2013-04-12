Template.sidebar.helpers({
  pageIs: function (tab) {
    return Meteor.Router.page() === tab;
  }
});

// Template.sidebar.events = {
//   'click a': function (e) {
//     e.preventDefault();
//     console.log($(this))
//   }
// };
