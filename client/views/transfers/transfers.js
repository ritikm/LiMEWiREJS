Template.transfers.helpers({
  transfers: function () {
    return Transfers.find({ $or: [{ "from._id": Meteor.userId() }, { "to._id": Meteor.userId() }] }).fetch();
  },

  getTransferStatus: function (fromUser) {
    return fromUser._id == Meteor.userId() ? "Uploading" : "Downloading";
  },

  getReadableSize: function (sizeInBytes) {
    return getReadableSize(sizeInBytes, 2);
  }
});
