var submitRegisterForm = function () {
  if ($('#register-form').valid()) {
    var email = $('#email').val();
    var password = $('#password').val();
    var confirmPassword = $('#confirm-password').val();
    // TODO: put this password check on the server
    if (password == confirmPassword) {
      Accounts.createUser({
        email: email,
        password: password
      }, function (err) {
        if (err) {
          console.log(err);
        } else {
          Meteor.Router.to('/'); // TODO: change to /media once it's made
        }
      });
    }
  }
};

var bindEnterToSubmit = function (e) {
  if (e.keyCode == 13) {
    submitRegisterForm();
  }
};

Template.register.events = {
  'click button#register-submit': function (e) {
    e.preventDefault();
    submitRegisterForm();
  },
  'keyup #password': bindEnterToSubmit,
  'keyup #email': bindEnterToSubmit
};

Template.register.rendered = function () {
  $('#email').focus(); //Place starting cursor in here

  $('#register-form').validate({
    rules: {
      email: { required: true, email: true },
      password: { required: true, minlength: 6 },
      'confirm-password': { required: true, equalTo: '#password' },
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
}
