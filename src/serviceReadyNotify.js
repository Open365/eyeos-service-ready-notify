/*
    Copyright (c) 2016 eyeOS

    This file is part of Open365.

    Open365 is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

var Service = require('./lib/dto/service.js'),
	RegisterManager = require('./lib/registerManager.js'),
	childProcess = require('child_process');
var ServiceReadyNotify = function (registerManager) {
	this.registerManager = registerManager || new RegisterManager();
};

ServiceReadyNotify.prototype.__getIp = function (cb) {
	console.log('ServiceReadyNotify.__getIp');
	childProcess.exec('hostname -i', function(err, stdOut, stdErr) {

	    var arr = stdOut.split('\n');
	    var ip = '';
	    if (arr[0].indexOf(' ') > -1){
	        var firstIp = arr[0].split(' ');
	        ip = firstIp[0];
	    } else {
	        ip = arr[0];
	    }
	    console.log('Got ip', ip);

	    cb(ip);
	});
};

ServiceReadyNotify.prototype.registerService = function (id, name, ip, port, callback) {
	if (!id && process.env.HOSTNAME) {
		id = process.env.HOSTNAME;
	}

	if (!name && process.env.WHATAMI) {
		name = process.env.WHATAMI;
	}

	if (!port) {
		if (process.env.PORT) {
			port = process.env.PORT;
		} else {
			port = 0;
		}
	}

	ip = ip || process.env.PUBLIC_IP;
	if (!ip) {
		this.__getIp(function (ip) {
			this.__finishRegistering(id, name, ip, port, callback);
		}.bind(this));
	} else {
		this.__finishRegistering(id, name, ip, port, callback);
	}
};

ServiceReadyNotify.prototype.__finishRegistering = function (id, name, ip, port, callback) {
	var service = new Service(id, name, ip, port);
	this.registerManager.createService(service, callback);
};

module.exports = ServiceReadyNotify;
