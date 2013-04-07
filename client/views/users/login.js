var submitLoginForm = function () {
  if ($("#login-form").valid()) {
    var email = $('#email').val();
    var password = $('#password').val();
    Meteor.loginWithPassword(email, password, function (err) {
      if (err) {
        console.log(err);
        // throwError(err.reason);
      }
    });
  }
};

var bindEnterToSubmit = function (e) {
  if (e.keyCode == 13) {
    submitLoginForm();
  }
};

Template.login.events = {
  'click button#login-submit': function (e) {
    e.preventDefault();
    submitLoginForm();
  },
  'keyup #password': bindEnterToSubmit,
  'keyup #email': bindEnterToSubmit
};

Template.login.rendered = function () {
  $("#email").focus(); //Place starting cursor in here

  $("#login-form").validate({
    rules: {
      email: { required: true, email: true },
      password: { required: true },
    }
  });

  var wobbleElement = function (selector) {
    var wrapper = $($(selector));
    wrapper.addClass("wobble");
    wrapper.bind("webkitAnimationEnd animationEnd mozAnimationEnd", function() {
      wrapper.off("webkitAnimationEnd");
      return wrapper.removeClass("wobble");
    });
  };
}
