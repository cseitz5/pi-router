var Cap = require('cap').Cap;
var decoders = require('cap').decoders;
var PROTOCOL = decoders.PROTOCOL;
var chalk = require("chalk");

var config = require(__dirname + "/../../config.json");
var rootaddrs = config["router-ip"];
var subnet = false;
subnet = rootaddr.split(".");
subnet.pop();
subnet = subnet.join(".");

var t = {
  uploads: 0,
  downloads: 0,
  total: 0,
  ignored: 0,
}

var factor = (1000 / rate);
function getTransfer() {
  var obj = Object.create(t);
  Object.keys(obj).forEach(key => {
    t[key] *= factor;
  });
  return obj;
}

try {
  var interfaces = rootaddrs;
  interfaces.forEach(rootaddr => {
    var c = new Cap();
    var device = Cap.findDevice(rootaddr);
    var filter = 'tcp';
    var bufSize = 10 * 1024 * 1024;
    var buffer = Buffer.alloc(65535);

    var linkType = c.open(device, filter, bufSize, buffer);

    c.setMinBytes && c.setMinBytes(0);

    var uploads = 0;
    var downloads = 0;

    var rate = config.rate;
    var factor = (1000 / rate);
    var lastUploads = 0;
    var lastDownloads = 0;
    setInterval(function() {
      t.uploads += uploads - lastUploads;
      t.downloads += downloads - lastDownloads;
      lastUploads = uploads;
      lastDownloads = downloads;
      uploads = 0;
      downloads = 0;
    }, rate);

    c.on('packet', function(nbytes, trunc) {
      var bf = (nbytes * factor);
      //total += bf;
      if (linkType === 'ETHERNET') {
        var ret = decoders.Ethernet(buffer);
        if (ret.info.type === PROTOCOL.ETHERNET.IPV4) {
          ret = decoders.IPV4(buffer, ret.offset);
          //console.log('from: ' + ret.info.srcaddr + ' to ' + ret.info.dstaddr);
          //console.log(ret);
          //process.exit(0);
          if (ret.info.srcaddr.indexOf(subnet) >= 0) {
            downloads += bf;
          } else if (ret.info.dstaddr.indexOf(subnet) >= 0) {
            uploads += bf;
          } else {
            //ignored += bf;
          }
        }
      }

  })
} catch(e) {
  log.error(e);
  setInterval(function() {
    Object.keys(t).forEach(key => {
      t[key] = Math.random() * (125000 * 100);
    })
  }, 1000)
}
