// channel = null;

  requestFile = function (fileId, fromUser) {
    if (Meteor.userId() != fromUser) {
      channel = new DataChannel();
      channel.connect(fromUser);
      channel.onopen = function () {
        console.log("open channel request");
        channel.send({ "type": "request", "fileId": fileId, "toUser": Meteor.userId() });
        channel = new DataChannel();
        channel.open(Meteor.userId()); // prepare to receive file next
      }
    }
  };

  sendFile = function (fileId, toUser) {
    if (Meteor.userId() != toUser) {
      channel = new DataChannel();
      channel.connect(toUser);
      channel.onopen = function () {
        console.log("open channel send file");
        var fileName = Files.get({ "_id": fileId }, "name");
        fs.root.getFile(fileName, {}, function (fileEntry) {
          fileEntry.file(function (file) {
            channel.send(file);
          }, errorHandler);
        }, errorHandler);
      }
    }
  }

Meteor.startup(function () {

  var channel = new DataChannel();
  channel.open(Meteor.userId());

  // [optional] onmessage/onopen is for sending/receiving data/text
  channel.onmessage = function(data) {
      console.log(data);
      if (data.type == "request") {
        console.log("request data received");
        sendFile(data.fileId, data.toUser);
      }
  };

  channel.onopen = function() {
    console.log("open");
      // if (document.getElementById('chat-input')) document.getElementById('chat-input').disabled = false;
      // if (document.getElementById('file')) document.getElementById('file').disabled = false;

      // if (document.getElementById('init-RTCMultiConnection')) document.getElementById('init-RTCMultiConnection').disabled = true;
  };

  // [optional] onFileProgress/onFileSent/onFileReceived for sharing files
  channel.onFileProgress = function(packets) {
    console.log(packets.remaining + ' packets remaining');
    if (packets.sent) console.log(packets.sent + ' packets sent');
    if (packets.received) console.log(packets.received + ' packets received');
      // appendDIV(packets.remaining + ' packets remaining.', fileProgress);
      // if (packets.sent) appendDIV(packets.sent + ' packets sent.', fileProgress);
      // if (packets.received) appendDIV(packets.received + ' packets received.', fileProgress);
  };
  channel.onFileSent = function(file) {
    console.log(file.name + ' sent');
      // appendDIV(file.name + ' sent.', fileProgress);
  };

  channel.onFileReceived = function(fileName) {
    console.log(fileName + ' received');
      // appendDIV(fileName + ' received.', fileProgress);
  };


});

// Meteor.startup(function () {
//   channel = new DataChannel();
//   channel2 = new DataChannel();

//   channel.onFileReceived = function (fileName) {
//     console.log("file received!");
//   }

//   channel2.onFileReceived = function (fileName) {
//     console.log("file received!");
//   }

//   channel.onFileProgress = function (packets) {
//     console.log("Progress:", (0.0+packets.sent)/packets.length);
//   }

//   channel2.onFileProgress = function (packets) {
//     console.log("Progress:", (0.0+packets.sent)/packets.length);
//   }

//   channel.onFileSent = function (file) {
//     console.log("file sent!", file);
//   }

//   channel.onerror = function (e) {
//     console.log("Error:", e);
//   }

//   channel.onclose = function (e) {
//     console.log("Connection closed:", e);
//   }

//   channel.onmessage = function (data) {
//     console.log("message incoming1", data);
//     if (data.type && "request") {
//       console.log("received request1");
//       WebRTC.sendFile(data.fileId, data.toUser);
//     } else {
//       console.log("DATA1!!!!!!!!!");
//     }
//   }

//   channel2.onmessage = function (data) {
//     console.log("message incoming2", data);
//     if (data.type && "request") {
//       console.log("received request2");
//       WebRTC.sendFile(data.fileId, data.toUser);
//     } else {
//       console.log("DATA2!!!!!!!!!");
//     }
//   }

//   // WebRTC.initReceiveFileHandlers();

//   // to create/open a new channel
//   channel.open(Meteor.userId());
// });

// WebRTC = {
//   requestFile: function (fileId, fromUser) {
//     channel2.onopen = function (chan) {
//       console.log("open chan2 request");
//       channel2.send({ "type": "request", "fileId": fileId, "toUser": Meteor.userId() });
//     };
//     // if someone already created a channel; to join it: use "connect" method
//     console.log("request connect")
//     channel2.connect(fromUser);
//     console.log("request send");
//     // to send text/data or file
//   },

//   sendFile: function (fileId, toUser) {
//     // WebRTC.initReceiveFileHandlers();
//     channel2.onopen = function (chan) {
//       console.log("prepping actual file");
//       var fileInfo = Files.findOne({ "_id": fileId });
//       var fileName = fileInfo.name;
//       var fileSize = fileInfo.size;
//       console.log("about to go");
//       fs.root.getFile(fileName, {}, function (fileEntry) {
//         console.log("reading file");
//         fileEntry.file(function (file) {
//           console.log("file", file);
//           chan.send(file);
//           // console.log("time for file reader");
//           // var reader = new FileReader();
//           // reader.onload = function (e) {
//           //   console.log("sending file...");
//           //   chan.send({ "type": "file", "fileId": fileId, "file": e.target.result });
//           // }
//           // console.log("reading file as array buffer");
//           // reader.readAsArrayBuffer(file);
//         }, errorHandler);
//       }, errorHandler);
//     };

//     console.log("going to send file");
//     channel2.connect(toUser);
//     console.log("about to open");
//   },

//   // initReceiveFileHandlers: function () {
//   //   console.log("init handlers");
//   //   channel.onmessage = function (data) {
//   //     console.log("message incoming");
//   //     if (data.type == "request") {
//   //       console.log("received request");
//   //       WebRTC.sendFile(data.fileId, data.toUser);
//   //     } else if (data.type == "file") {
//   //       console.log("receiving file...");
//   //       var fileInfo = Files.findOne({ "_id": data.fileId });
//   //       var fileName = fileInfo.name;
//   //       var fileType = fileInfo.type;
//   //       console.log("received file");
//   //       // filer.write(fileName, { data: data.chunk, type: fileType, append: true });
//   //       // filer.write(fileName, { "data": data.file, type: fileType }, function (fileEntry, fileWriter) {
//   //       //   console.log("fileURL", fileURL);
//   //       //   var fileURL = fileEntry.toURL();
//   //       //   Files.set({ "_id": data.fileId }, { "url": fileURL });
//   //       //   console.log("fileURL:", fileURL);
//   //       // }, errorHandler);
//   //     } else {
//   //       console.log("Data:", data);
//   //     }
//   //   }
//   // }
// };



// peer = null;

// Meteor.startup(function () {
//   peer = new Peer("" + Meteor.userId(), { host: 'localhost', port: 9000 });
//   WebRTC.initReceiveFileHandlers();
// });

// WebRTC = {
//   requestFile: function (fileId, fromUser) {
//     console.log("request file");
//     var conn = peer.connect(fromUser, {});
//     console.log("about to open", conn);
//     conn.on('open', function () {
//       console.log("gonna hi");
//       conn.send("HI");
//       console.log("going to open");
//       // conn.send({ "type": "request", "fileId": fileId, "toUser": Meteor.userId() });
//       console.log("request sent");
//     });
//   },

//   sendFile: function (fileId, toUser) {
//     console.log("going to send file");
//     var conn = peer.connect(toUser, { reliable: true });
//     console.log("about to open");
//     conn.on('open', function () {
//       var fileInfo = Files.findOne({ "_id": fileId });
//       var fileName = fileInfo.name;
//       var fileSize = fileInfo.size;

//       filer.open(fileName, function (file) {
//         var reader = new FileReader();
//         reader.onload = function (e) {
//           console.log("sending file...");
//           conn.send({ "type": "file", "fileId": fileId, "file": e.target.result });
//         }
//         reader.readAsArrayBuffer(file);
//         // var chunkSize = 1000;
//         // for (var i = 0; i < fileSize; i += chunkSize) {
//         //   (function (fil, start) {
//         //     var reader = new FileReader();
//         //     var blob = fil.slice(start, chunkSize + start);
//         //     reader.onload = function (e) {
//         //       var chunk = e.target.result;
//         //       conn.send({ "type": "chunk", "fileId": fileId, "chunk": chunk });
//         //     }
//         //     reader.readAsArrayBuffer(blob);
//         //   })(file, i);
//         // }

//       });
//     });
//   },

//   initReceiveFileHandlers: function () {
//     peer.on('connection', function (conn) {
//       conn.on('data', function (data) {
//         if (data.type == "request") {
//           console.log("received request");
//           WebRTC.sendFile(data.fileId, data.toUser);
//         } else if (data.type == "file") {
//           console.log("receiving file...");
//           var fileInfo = Files.findOne({ "_id": data.fileId });
//           var fileName = fileInfo.name;
//           var fileType = fileInfo.type;
//           // filer.write(fileName, { data: data.chunk, type: fileType, append: true });
//           filer.write(fileName, { "data": data.file, type: fileType }, function (fileEntry, fileWriter) {
//             console.log("fileURL", fileURL);
//             var fileURL = fileEntry.toURL();
//             Files.set({ "_id": data.fileId }, { "url": fileURL });
//             console.log("fileURL:", fileURL);
//           }, errorHandler);
//         } else {
//           console.log("Data:", data);
//         }
//       });
//     });
//   }
// }

// var preset = false;
// preset.checked = false;

// var pc1 = null;
// var pc2 = null;
// var dc1 = null;
// var dc2 = null;
// var channel1 = null;
// var channel2 = null;
// var num_channels = 0
// var datachannels = new Array(0);

// var pc1_offer;
// var pc2_answer;
// var iter = 0;
// var iter2 = 0;

// var fake_audio;

// function log(msg) {
//   console.log(msg);
// }

// var fancy_log = function(msg,color) {
//   console.log(msg);
// };

// function submitenter(myfield,e)
// {
//   var keycode;
//   if (window.event) keycode = window.event.keyCode;
//   else if (e) keycode = e.which;
//   else return true;

//   if (keycode == 13) {
//     myfield.form.submit();
//     return false;
//   } else {
//     return true;
//   }
// }

// var sendit = function (which, msg) {
//   iter = iter + 1;
//   //log("Sending message #" + iter + " this = " + this);
//   console.log("dc1", dc1);
//   if (which == 1) {
//     dc1.send(msg);
//     // text_pc1.value = "";
//   } else if (which == 2) {
//     dc2.send(msg);
//     // text_pc2.value = "";
//   } else {
//     log("Unknown send " + which);
//   }
// };

// var sendblob = function (which) {
//   iter = iter + 1;
//   //log("Sending blob #" + iter + " this = " + this);
//   if (which == 1) {
//     dc1.send(blob_pc1.files[0]);
//     blob_pc1.value = "";
//   } else if (which == 2) {
//     dc2.send(blob_pc2.files[0]);
//     blob_pc2.value = "";
//   } else {
//     log("Unknown sendblob " + which);
//   }
// };

// function failed(code) {
//   log("Failure callback: " + code);
// }

// // pc1.createOffer finished, call pc1.setLocal
// function step1(offer) {
//   pc1_offer = offer;
//   log("Offer: " + offer.sdp);
//   pc1.setLocalDescription(offer, step1_5, failed);
// }

// function step1_5() {
//   setTimeout(step2,0);
// }

// // pc1.setLocal finished, call pc2.setRemote
// function step2() {
//   pc2 = new mozRTCPeerConnection();

//   pc2.ondatachannel = function(event) {
//     channel = event.channel;
//     log("pc2 onDataChannel [" +num_channels + "] = " + channel +
//         ", label='" + channel.label + "'" +
//         ", protocol='" + channel.protocol + "'");
//     datachannels[num_channels] = channel;
//     num_channels++;
//     channel.binaryType = "blob";

//     channel.onmessage = function(evt) {
//       iter2 = iter2 + 1;
//       if (evt.data instanceof Blob) {
//         fancy_log("*** pc1 sent Blob: " + evt.data + ", length=" + evt.data.size,"red");
//       } else {
//         fancy_log("pc1 said: " + evt.data,"red");
//       }
//     };
//     channel.onopen = function() {
//       log("*** pc2 onopen fired, sending to " + channel);
//       channel.send("pc2 says Hi there!");
//     };
//     channel.onclose = function() {
//       log("*** pc2 onclose fired");
//     };
//   };
//   pc2.onconnection = function() {
//     log("pc2 onConnection ");
//   }
//   pc2.onclosedconnection = function() {
//     log("pc2 onClosedConnection ");
//   }

//   pc2.addStream(fake_audio);
//   pc2.onaddstream = function(obj) {
//     log("pc2 got remote stream from pc1 " + obj.type);
//   }
//   pc2.setRemoteDescription(pc1_offer, step3, failed);
// };

// // pc2.setRemote finished, call pc2.createAnswer
// function step3() {
//   pc2.createAnswer(step4, failed);
// }

// // pc2.createAnswer finished, call pc2.setLocal
// function step4(answer) {
//   pc2_answer = answer;
//   pc2.setLocalDescription(answer, step5, failed);
// }

// // pc2.setLocal finished, call pc1.setRemote
// function step5() {
//   pc1.setRemoteDescription(pc2_answer, step6, failed);
// }

// // pc1.setRemote finished, make a data channel
// function step6() {
//   log("HIP HIP HOORAY");
// }

// function start() {
//   // button.innerHTML = "Stop!";
//   // button.onclick = stop;
//   // while (datawindow.firstChild) {
//   //   datawindow.removeChild(datawindow.firstChild);
//   // }

//   pc1 = new mozRTCPeerConnection();

//   pc1.onaddstream = function(obj) {
//     log("pc1 got remote stream from pc2 " + obj.type);
//   }

//   pc1.ondatachannel = function(event) {
//     channel = event.channel;
//     // In case pc2 opens a channel
//     log("pc1 onDataChannel [" +num_channels + "] = " + channel +
//         ", label='" + channel.label + "'" +
//         ", protocol='" + channel.protocol + "'");
//     datachannels[num_channels] = channel;
//     num_channels++;

//     channel.onmessage = function(evt) {
//       if (evt.data instanceof Blob) {
//         fancy_log("*** pc2 sent Blob: " + evt.data + ", length=" + evt.data.size,"blue");
//       } else {
//         fancy_log('pc2 said: ' + evt.data,"blue");
//       }
//     }

//     channel.onopen = function() {
//       log("pc1 onopen fired for " + channel);
//       channel.send("pc1 says Hello out there...");
//       log("pc1 state: " + channel.state);
//     }
//     channel.onclose = function() {
//       log("pc1 onclose fired");
//     };
//   }
//   pc1.onconnection = function() {
//     log("pc1 onConnection ");
//     dict = preset.checked ? {protocol:"text/chat", preset:true, stream:5} : {}; // reliable (TCP-like)
//     dc2 = pc2.createDataChannel("This is pc2", dict);
//     channel = dc2;
//     channel.binaryType = "blob";

//     channel.onmessage = function(evt) {
//       if (evt.data instanceof Blob) {
//         fancy_log("*** pc1 sent Blob: " + evt.data,"blue");
//       } else {
//         fancy_log('pc1 said: ' + evt.data,"blue");
//       }
//     }
//     channel.onopen = function() {
//       log("pc1 onopen fired for " + channel);
//      channel.send("pc2 says Hello...");
//     }
//     channel.onclose = function() {
//       log("pc2 onclose fired");
//     };
//   }
//   pc1.onclosedconnection = function() {
//     log("pc1 onClosedConnection ");
//   }

//   navigator.mozGetUserMedia({audio:true, fake:true}, function(s) {
//     pc1.addStream(s);
//     fake_audio = s;

//     dict = preset.checked ? {protocol: "text/plain", preset:true, stream:5} : {}; // reliable (TCP-like)
//     dc1 = pc1.createDataChannel("This is pc1", dict);
//     channel = dc1;
//     channel.binaryType = "blob";

//     channel.onmessage = function(evt) {
//       if (evt.data instanceof Blob) {
//         fancy_log("*** pc2 sent Blob: " + evt.data,"blue");
//       } else {
//         fancy_log('pc2 said: ' + evt.data,"blue");
//       }
//     }
//     channel.onopen = function() {
//       log("pc1 onopen fired for " + channel);
//      channel.send("pc1 says Hello...");
//     }
//     channel.onclose = function() {
//       log("pc1 onclose fired");
//     };

//     pc1.createOffer(step1, failed);
//   }, function(err) { alert("Error " + err); });
// }

// function stop() {
//   log("closed");
//   pc1.close();
//   pc2.close();

//   // button.innerHTML = "Start!";
//   // button.onclick = start;
// }






// channel = null;

// Meteor.startup(function () {
//   channel = new DataChannel();
//   channel.open("" + Meteor.userId());

//   channel.direction = 'one-to-one';

//   channel.onopen = function(channel) {
//     console.log("open");
//   };

//   channel.onmessage = function (message) {
//     console.log("message:", message);
//   };

//   channel.onerror = function (e) {
//     console.log("error:", e);
//   };

//   channel.onclose = function (e) {
//     console.log("connection closed");
//   };
// });

// WebRTC = {
//   requestFile: function (fileId, fromUser) {
//     console.log("requesting file");
//     var conn = new DataChannel();
//     conn.connect("" + fromUser);
//     conn.direction = 'one-to-one';
//     console.log("connected");
//     conn.send("hi");
//     console.log("done");
//   }
// };

// peer = null;
// sender = null;
// WebRTC = null;

// // Establish WebRTC connection
// Meteor.startup(function () {
//   if (navigator.mozGetUserMedia) {
//     WebRTC = MozWebRTC;
//     console.log("moz");
//   } else if (navigator.webkitGetUserMedia) {
//     WebRTC = WebkitWebRTC;
//   }

//   WebRTC.init();
// });


// // Helper functions to send and receive files

// PeerFiles = {
//   requestFile: function (fileId, fromUser) {
//     console.log("in reqFile", fileId, fromUser);
//     WebRTC.connect(fromUser);
//     console.log("connected", WebRTC);
//     WebRTC.send(JSON.stringify({ "type": "request", "fileId": fileId, "toUser": Meteor.userId() }));
//     console.log("sent");
//   },

//   sendFile: function (fileId, toUser) {
//     WebRTC.connect(toUser);
//     WebRTC.send();

//     console.log("now in webrtc", fileId, toUser);
//     var conn = peer.connect(toUser);
//     console.log("conn ready", conn);
//     conn.on('open', function () {
//       console.log("conn open!");
//       conn.send('hi!');
//     });
//   },

//   receiveFile: function (username, fileId) {

//   }
// }

// WebkitWebRTC = {
//   conn: null,

//   init: function () {
//     peer = new Peer(Meteor.userId(), { host: 'localhost', port: 9000 });
//     peer.on('connection', function (conn) {
//       conn.on('data', function (data) {
//         data = JSON.parse(data);
//         if (data.type == "request") {
//           PeerFiles.sendFile(data.fileId, data.toUser);
//         } else {
//           console.log(data);
//         }
//       });
//     });
//   },

//   connect: function (id) {
//     this.conn = peer.connect(id);
//   },

//   send: function (data) {
//     this.conn.on('open', function () {
//       this.conn.send(data);
//     });
//   }
// };

// MozWebRTC = {
//   dict: {},

//   channel: null,

//   conn: null,

//   init: function () {
//     console.log("init");
//     var iceServers = {
//       iceServers: [{
//             url: 'stun:stun.l.google.com:19302'
//         }
//       ]
//     };

//     var sender, senderDC, receiverDC;
//     sender = new mozRTCPeerConnection(iceServers);
//     senderDC = sender.createDataChannel("" + Meteor.userId(), {}); // receiving data through this
//     senderDC.binaryType = 'blob':

//     senderDC.onmessage = function (e) {
//       console.log("Msg:", e);
//     };

//     senderDC.onopen = function () {
//       console.log("opened");
//     };

//     senderDC.onclose = function (e) {
//       console.log("close", e);
//     };

//     senderDC.onerror = function (e) {
//       console.log("error", e);
//     }

//     // senderDC.ondatachannel = function(event) {
//     //   console.log("e", event);
//     //   this.channel = event.channel;
//     //   this.channel.onmessage = function(e) {
//     //     if (evt.data instanceof Blob) {
//     //       console.log("*** pc2 sent Blob: " + e.data + ", length=" + e.data.size,"blue");
//     //     } else {
//     //       console.log('pc2 said: ' + e.data,"blue");
//     //     }
//     //   }
//     //   this.channel.onopen = function() {
//     //     console.log("pc onopen fired for " + channel);
//     //     // channel.send("pc says Hello out there...");
//     //     console.log("pc state: " + channel.state);
//     //   }
//     //   this.channel.onclose = function() {
//     //     console.log("pc onclose fired");
//     //   };
//     // };

//     // peer.onconnection = function() {
//     //   console.log("pc onConnection");
//     //   // this.dict = preset.checked ? {protocol:"text/chat", preset:true, stream:5} : {}; // reliable (TCP-like)
//     // }

//     // peer.onclosedconnection = function() {
//     //   console.log("pc onClosedConnection");
//     // }

//     // console.log("peer", peer);
//   },

//   connect: function (id) {
//     console.log("connecting to", id, this.dict);
//     conn = sender.createDataChannel(id, this.dict); // sending data through this
//     conn.binaryType = "blob";

//     console.log("conn", conn);

//     this.channel.onmessage = function (e) {
//       if (e.data instanceof Blob) {
//         console.log("*** pc1 sent Blob: " + e.data + ", length=" + e.data.size,"blue");
//       } else {
//         console.log('pc1 said: ' + e.data,"blue");
//       }
//     }
//     this.channel.onopen = function() {
//       console.log("pc1 onopen fired for " + channel);
//       // this.channel.send("pc2 says Hello...");
//     }
//     this.channel.onclose = function() {
//       console.log("pc2 onclose fired");
//     };
//   },

//   send: function (data) {
//     console.log("send", data);
//     this.conn.onopen = function() {
//       this.conn.send(data);
//     }
//   }
// }
