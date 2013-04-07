Users.allow({
  update: function (userId, docs, fields, modifier) {
    return true;
  },
  fetch: ['owner']
})
