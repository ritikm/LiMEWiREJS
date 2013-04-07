FileTransfer = {
  startTransfer: function (fileId, fromUser, toUser) {
    console.log("starting transfer");
    var file = Files.find({ "_id": fileId });

    console.log("going to add a transfer");

    Transfers.create({
      "from": {
        "_id": fromUser,
        "username": Users.get({ "_id": fromUser }, "username"),
      },
      "to": {
        "_id": toUser,
        "username": Users.get({ "_id": toUser }, "username"),
      },
      "file": {
        "_id": fileId,
        "name": file.username,
        "size": file.size
      },
      "progress": 0,
      "status": "transferring"
    });

    console.log("about to WebRTC it");

    requestFile(fileId, fromUser);

    console.log("control is to WebRTC now");
  },

  updateProgress: function (fileId, progress) {
    Transfers.set({ "_id": fileId }, { "progress": progress }, errorHandler);
  },

  finishTransfer: function (fileId, fromUser, toUser) {
    Users.push({ "_id": Meteor.userId() }, "profile.files", fileId, errorHandler);
    Files.push({ "_id": fileId }, "owners", toUser, errorHandler);
    Transfers.set({ "_id": fileId }, { "status": "complete", "progress": 100 }, errorHandler);
  },

  cancelTransfer: function (fileId, fromUser, toUser) {
    Transfers.set({ "_id": fileId }, { "status": "canceled" }, errorHandler);
  }
}
