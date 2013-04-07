Template.accountSettings.helpers({
  email: function () {
    return Meteor.user().profile.email;
  },

  firstName: function () {
    return Meteor.user().profile.firstName;
  },

  lastName: function () {
    return Meteor.user().profile.lastName;
  }
});

Template.accountSettings.rendered = function () {
  $.validator.addMethod("validateNewEmail", function (email, element) {
    var currentEmail = Meteor.user().profile.email;
    if (email.toLowerCase() != currentEmail) {
      return typeof Users.findOne({ 'emails.address': email }) === 'undefined';
    } else {
      return true;
    }
  }, "This email address is already in use!");

  $("#account-settings-form").validate({
    rules: {
      "email": { required: true, email: true, validateNewEmail: true }
    }
  });
};
