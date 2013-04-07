Template.bandwidthStorageStats.helpers({
  bandwidthLeft: function () {
    var bandwidth = Meteor.user().profile.bandwidth;
    var amountLeft = bandwidth.limit - bandwidth.used;
    return getReadableSize(amountLeft, 2);
  },

  bandwidthLimit: function () {
    return getReadableSize(Meteor.user().profile.bandwidth.limit, 2);
  }
});
