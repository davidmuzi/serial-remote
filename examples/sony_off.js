var fs = require('fs')
var path = require('path')
var Device = require('../lib/device.js')

var deviceSpec = JSON.parse(fs.readFileSync(path.join(__dirname, '../specs/sony_tv.json'), 'utf8'))
var device = new Device(deviceSpec, '/dev/cu.usbserial')

device.on('ready', function() {

	device.powerOff(function(error, results) {
		
		if (error) {
			console.log(error)
		}
	
		process.exit(0)
	});
});

