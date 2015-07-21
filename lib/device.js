var SerialPort = require('serialport').SerialPort
var EventEmitter = require('events').EventEmitter
var util = require('util')

/**
 * Create a new device connection
 *
 * @param   options  options
 * @param   port     the serial port path ex. /dev/usbserial
 */
function device(options, port) {
	
	if (typeof port === 'undefined') {
    	throw 'define a port such as /dev/usbserial'
  	}
  
    if (typeof options.serial_config === 'undefined') {
    	throw 'define serial config'
	}
		  
	this.options = options

	this._serialPort = new SerialPort(port, options.serial_config)
	
	var self = this
	this._serialPort.on('open', function(){
 		console.log('serial port opened: ' + port)
		 
		self.emit('ready')
	});
	
	this._serialPort.on('error', function(error){
 		console.log('error opening serial port: ' + error)
	});
	
	this._serialPort.on('data', function(data) {
		console.log('response ' + data)
	});
}

module.exports = device
util.inherits(device, EventEmitter)

device.prototype.execute = function(command, callback) {

	var commandData = this.options.commands[command]
	
	if (commandData == undefined) {
		console.log('command not found: ' + command)
		callback(new Error('invalid command'), 0)
	}
	else {
		var buffer = new Buffer(commandData)
		this._sendBuffer(buffer, callback)
	}
}

device.prototype.powerOn = function(callback) {
	this.execute('power_on', callback)
}

device.prototype.powerOff = function(callback) {
	this.execute('power_off', callback)
}

device.prototype.hdmi1 = function(callback) {
	this.execute('input_hdmi1', callback)
}

device.prototype.hdmi2 = function(callback) {
	this.execute('input_hdmi2', callback)
}

device.prototype.hdmi3 = function(callback) {
	this.execute('input_hdmi3', callback)
}

device.prototype.hdmi4 = function(callback) {
	this.execute('input_hdmi4', callback)
}

device.prototype.mute = function(callback) {
	this.execute('mute', callback)
}

device.prototype.unmute = function(callback) {
	this.execute('unmute', callback)
}

device.prototype.volumeUp = function(callback) {
	this.execute('volume_up', callback)
}

device.prototype.volumeDown = function(callback) {
	this.execute('volume_down', callback)
}

device.prototype.setVolume = function(volume, callback) {
	
	// validate the input value
	if (volume < 0 || volume > 100) {
    	callback(new Error('Invalid volume, valid range is 0-100'))
    	return
  	}
  
	var commandData = this.options.commands['volume_set']
	
	// Find the index for the volume value
	for (i=0; i<commandData.length; i++) {
		if (commandData[i] == "n") {
			commandData[i] = volume
			break;
		}
	}
	
	var buffer = new Buffer(commandData)
	buffer[buffer.length - 1] = calculateSum(buffer)

	device.sendBuffer(buffer, callback)
}

device.prototype._calculateChecksum = function(buffer, callback) {
	
	var checksum = 0
	
	for (i=0; i<buffer.length-1; i++) {
		checksum+=buffer[i]
		console.log(checksum)	
	}
	
	return checksum
}

device.prototype._sendBuffer = function(buffer, callback) {
	
	console.log('writing buffer: ' + buffer.toJSON())
	this._serialPort.write(buffer, callback)
}

device.prototype.close = function() {
	this._serialPort.close()
}
