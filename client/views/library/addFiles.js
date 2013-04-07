
Template.addFiles.rendered = function () {
  $('#add-folder').change(function (e) {
    var files = e.target.files;

    for (var i = 0, len = files.length; i < len; i++) {
      FileLibrary.addFile(files[i]);
    }
  });
}
