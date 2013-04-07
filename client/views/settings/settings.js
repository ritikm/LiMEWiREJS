Template.settings.helpers({
  activeTabIs: function (tab) {
    return Session.get('activeSettingsTab') === tab;
  }
});

Template.settings.events = {
  'click ul.nav-tabs li': function (e) {
    e.preventDefault();
    var tab = $(e.currentTarget).attr('id');
    tab = tab.substring(0, tab.length - 4);
    Meteor.Router.to('/settings/' + tab)
  }
}

Template.settings.rendered = function () {
  var activeTab = Session.get('activeSettingsTab');
  $('.active').removeClass('active');
  $('#' + activeTab + '-tab').addClass('active');
  $('#' + activeTab + '-pane').addClass('active');
}
