Template.search.helpers({
  searchResults: function () {
    var searchQuery = Session.get('searchQuery');
    if (typeof searchQuery != 'object' && searchQuery && searchQuery.length >= 2) {
      var regex = new RegExp(["^", searchQuery].join(""), "i");
      return Files.find({ "nameParts": regex }).fetch();
    } else {
      return [];
    }
  },

  getReadableSize: function (sizeInBytes) {
    return getReadableSize(sizeInBytes, 2);
  },

  filterOnlineUser: function (users) {
    console.log("users", users);
    for (var i = 0, len = users.length; i < len; i++) {
      var user = Users.find({ "_id": users[i]._id, "profile.online": true }).fetch();
      if (user[0]) {
        return user[0].username;
      }
    }
    return "Not Available";
  }
});

Template.search.events = {
  'click button.button-download': function (e) {
    e.preventDefault();
    var fileId = this._id;
    var username = $("#" + fileId).children('.username').text();
    var fromUser = Users.get({ "username": username }, "_id");

    console.log("FileTransfer.startTransfer(\"" + fileId + "\", \"" + fromUser + "\", \"" + Meteor.userId() + "\");");

    FileTransfer.startTransfer(fileId, fromUser, Meteor.userId());

    // Meteor.Router.to('/transfers');
  },
};
