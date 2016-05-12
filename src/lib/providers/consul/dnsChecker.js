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

var dns = require("native-dns"),
	settings = require('../../../settings.js');

var DnsChecker = function () {

};

DnsChecker.prototype.verifyEntryExists = function (entry, callback) {
	var question = dns.Question({
		name: entry,
		type: 'A'
	});

	var req = dns.Request({
		question: question,
		server: { address: settings.providerHost, port: 8600, type: 'udp' },
		timeout: 1000
	});

	req.on('timeout', function () {
		callback(false);
	});

	req.on('message', function (err, answer) {
		if(answer.answer.length > 0) {
			answer.answer.forEach(function (a) {
				if (!a.address) {
					callback(false);
				} else {
					callback(true);
				}
			});
		} else {
			callback(false);
		}
	});
	req.send();
};


module.exports = DnsChecker;
