Accounts.onCreateUser(function (options, user) {
  user.profile = options.profile || {};

  user.profile = _.extend(user.profile, {
    files: []
  });

  return user;
});
