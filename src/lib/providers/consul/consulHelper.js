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

var settings = require('../../../settings.js'),
	http = require('http'),
	RequestRetry = require('node-request-retry');

var ConsulHelper = function () {

};


ConsulHelper.prototype.__registerRequest = function (options, data, callback) {
	var req = http.request(options, function (res) {
		if(res.statusCode !== 200) {
			callback(false, 'There was an error. Status code: ', res.statusCode);
		} else {
			callback(true);
		}

		var response = '';
		req.on('data', function (chunk) {
			response += chunk;
		});
	});

	req.on('error', function (error) {
		callback(false, 'Cannot contact Consul. Error: ' + error.message);
	});
	req.write(data);
	req.end();
};


ConsulHelper.prototype.registerService = function (consulService, callback) {
	var data = JSON.stringify(consulService);

	var options = {
		hostname: settings.providerHost,
		port: settings.providerPort,
		path: settings.providerServiceApiPath,
		method: 'PUT',
		agent: false,
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': data.length
		}
	};
	var self = this;
	var url = "http://" + settings.providerHost + ":" + settings.providerPort + "/" + settings.providerServiceApiPath;
	RequestRetry.MAX_RETRIES = 10;
	var reqRetry = new RequestRetry();
	reqRetry.post(url, data, function(err) {
		if(!err){
			self.__registerRequest(options, data, callback);
		} else {
			callback(false, "Error:" + err);
		}
	});
};

module.exports = ConsulHelper;
