Template.header.helpers({
  transfers: function () {
    return Transfers.find({ $or: [{ "from._id": Meteor.userId() }, { "to._id": Meteor.userId() }] }).fetch().slice(0, 5);
  },

  username: function () {
    return Meteor.user().username;
  }
});
