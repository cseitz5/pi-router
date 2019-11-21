var Cap = require('cap').Cap;
var decoders = require('cap').decoders;
var PROTOCOL = decoders.PROTOCOL;
var chalk = require("chalk");

var config = require(__dirname + "/../../config.json");
var rootaddr = config["router-ip"];
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

function getTransfer() {
  return Object.create(t);
}

try {
  var c = new Cap();
  var device = Cap.findDevice(rootaddr);
  var filter = 'tcp';
  var bufSize = 10 * 1024 * 1024;
  var buffer = Buffer.alloc(65535);

  var linkType = c.open(device, filter, bufSize, buffer);

  c.setMinBytes && c.setMinBytes(0);

  function formatBytes(bytes, decimals = 2) {
    /*if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];*/
    return Math.floor(bytes / 125000) + " Mbps";
  }


  var rate = config.rate;
  var factor = (1000 / rate);
  //process.stdout.write("INITIALIZING...");
  setInterval(function() {
    /*process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(
      "" + chalk.greenBright("▲ " + formatBytes(t.downloads)) +
      "  " + chalk.blueBright("▼ " + formatBytes(t.uploads)) +
      "  " + chalk.yellowBright("▲▼ " + formatBytes(t.total)) +
      "  " + chalk.redBright("⮾ " + formatBytes(t.ignored))
    );*/
    t.uploads = 0;
    t.downloads = 0;
    t.total = 0;
    t.ignored = 0;
  }, rate);

  c.on('packet', function(nbytes, trunc) {
    var bf = (nbytes * factor);
    total += bf;
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
          ignored += bf;
        }
      }
    }
  });
} catch(e) {
  log.error(e);
  setInterval(function() {
    Object.keys(t).forEach(key => {
      t[key] = Math.random() * (125000 * 100);
    })
  }, 1000)
}
