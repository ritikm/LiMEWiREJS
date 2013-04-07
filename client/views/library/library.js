Template.library.helpers({
  files: function () {
    return Files.find({ "owners": Meteor.userId() });
  },

  getReadableSize: function (sizeInBytes) {
    return getReadableSize(sizeInBytes, 2);
  }
});

Template.library.events = {
  'click .button-remove': function (e) {
    e.preventDefault();
    var fileId = this._id;
    FileLibrary.removeFile(fileId);
  }
}
