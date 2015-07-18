# serial-remote
utility for controlling AV devices using the serial port

## Purpose
Many home theater devices (tvs, projectors, receivers) can be controlled via their RS232 port.  This module is designed to be evolve to control devices from any brand via a spec file, which is a json representation of the control protocol.

## Installation
```bash
npm install serial-remote
```

## Example
```javascript
var Device = require('device');

var deviceSpec = JSON.parse(fs.readFileSync(path.join(__dirname, '../specs/sony_tv.json'), 'utf8'));
var device = new Device(deviceSpec, "/dev/cu.usbserial");

device.on('ready', function() {
	
	device.powerOn(function(error, results) {
		
	});
});
```

## Contributions
If you have a device that can be controlled via RS232, create a spec file containing the  supported commands
