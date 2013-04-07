Template.changePasswordSettings.events = {
  'click button.button-submit': function (e) {
    e.preventDefault();
    var oldPassword = $('#current-password').val();
    var newPassword = $('#new-password').val();
    Accounts.changePassword(oldPassword, newPassword);
  },

  'keyup input': function (e) {
    if (e.keyCode == 13) {
      $('button.button-submit').click();
    }
  }
};

Template.changePasswordSettings.rendered = function () {
  $("#change-password-form").validate({
    rules: {
      "currentPassword": { required: true },
      "newPassword": { required: true, minlength: 6 },
      "confirmPassword": { required: true, equalTo: "#new-password" },
    }
  });
};
