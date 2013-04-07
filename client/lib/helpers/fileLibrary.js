filer = null, fs = null;

FileLibrary = {
  addFile: function (file) {
    // Copy file to sandboxed FileSystem (w/ IndexedDB fallback)
    // Cannot use filer.js here since it only takes Blobs when creating a file
    console.log("fs", fs);
    fs.root.getFile(file.name, { create: true, exclusive: true }, function (fileEntry) {
      fileEntry.createWriter(function (fileWriter) {
        fileWriter.write(file); // write() can take a File or Blob object.
      }, errorHandler);
    }, errorHandler);

    // Insert file details into database
    Files.create({
      "name": file.name,
      "nameParts": file.name.match(/[a-zA-Z0-9]+/g) || [],
      "size": file.size,
      "type": file.type,
      "owners": [ Meteor.userId() ],
      "ownersOnline": 1
    });
  },

  removeFile: function (fileId) {
    var fileName = Files.get({ "_id": fileId }, "name");
    filer.rm(fileName);
    Files.destroy({ "_id": file._id });
  }
}

Meteor.startup(function () {
  // Initialize Filer.js (HTML5 File API Wrapper)
  var filerInit = new Filer();

  filerInit.init({ persistent: true, size: 5*1024*1024*1024 }, function (filerFs) {
    console.log("Filer initialized!");
    fs = filerFs;
    filer = filerInit;
  }, errorHandler);
});
