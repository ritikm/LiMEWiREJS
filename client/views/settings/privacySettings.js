Template.privacySettings.helpers({
  privacyIs: function (privacy) {
    return Meteor.user().profile.defaultPrivacy === privacy;
  }
});

Template.privacySettings.events = {
  'click button.button-submit': function () {
    Users.set(Meteor.userId(), { 'profile.defaultPrivacy': $('#privacy').val() });
    // TODO: fire notification for confirmation
  }
}
