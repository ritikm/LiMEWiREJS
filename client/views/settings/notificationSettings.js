Template.notificationSettings.helpers({
  options: function () {
    return Meteor.user().profile.notificationDecider;
  },

  label: function () {
    var labelMappings = {
      friendRequestReceived: "A friend sends you a friend-request",
      friendRequestAccepted: "Someone accepts a friend-request you sent",
      transferStarted: "You start a download",
      transferCompleted: "One of your downloads finishes",
      friendCompletedTransfer: "One of your friends downloads a file", // for now -- eventually weekly digest
      friendJoined: "One of your other Facebook friends joins Grepnet",
      friendWatched: "One of your friends watch a video", // for now -- eventually weekly digest
      passwordReset: "Your password is changed"
    };

    return labelMappings[this.key];
  },

  currentEmailSetting: function () {
    return this.value.email ? true : false;
  },

  currentPopupSetting: function () {
    return this.value.popup ? true : false;
  }
});

Template.notificationSettings.events = {

  'click button.button-submit': function () {
    var settingsUpdate = $('#notifications-form').serializeArray();
    var currentSettings = Meteor.user().profile.notificationDecider;
    var settingsResults = {};

    for (var i = 0, len = settingsUpdate.length; i < len; i++) {
      settingsResults['profile.notificationDecider.' + settingsUpdate[i].name] = settingsUpdate[i].value === "on";
    }

    for (var key in currentSettings) {
      if (!settingsResults['profile.notificationDecider.' + key + ".email"]) {
        settingsResults['profile.notificationDecider.' + key + ".email"] = false;
      }

      if (!settingsResults['profile.notificationDecider.' + key + ".popup"]) {
        settingsResults['profile.notificationDecider.' + key + ".popup"] = false;
      }
    }

    var result = Users.set(Meteor.userId(), settingsResults);
    // TODO: fire notification to indicate settings were saved
  }

}
