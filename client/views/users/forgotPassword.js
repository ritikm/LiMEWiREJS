var submitForgotPasswordForm = function () {
  if ($('#forgot-pass-form').valid()) {
    var email = $('#email').val();

    Accounts.forgotPassword({ email: email }, function (err) {
      if (err) {
        console.log(err);
      } else {
        $('#success-message').fadeOut('slow');
        $('#success-message').fadeIn('slow');
        $('#success-message').text('Email sent! Click on the link to reset your password.');
      }
    });
  }
};

Template.forgotPassword.events = {
  'click button#forgot-pass-submit': function (e) {
    e.preventDefault();
    submitForgotPasswordForm();
  },

  'keyup #email': function (e) {
    if (e.keyCode == 13) {
      submitForgotPasswordForm();
    }
  }
};

Template.forgotPassword.rendered = function () {
  $('#email').focus(); // Place starting cursor there

  $('#forgot-pass-form').validate({
    rules: {
      email: { required: true, email: true },
    }
  });

  var wobbleElement = function (selector) {
    var wrapper = $($(selector));
    wrapper.addClass('wobble');
    wrapper.bind('webkitAnimationEnd animationEnd mozAnimationEnd', function() {
      wrapper.off('webkitAnimationEnd');
      return wrapper.removeClass('wobble');
    });
  };
};
