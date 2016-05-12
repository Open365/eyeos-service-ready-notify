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

var SerfProvider = function (exec) {
	this.exec = exec || require('child_process').exec;
};

SerfProvider.prototype.addService = function (service, callback) {
	console.log('Going to register service into serf', service);
	var tag = service.getId() + '=' + service.getName() + ':' + service.getIp() + ':' + service.getPort();
	this.__setTag(tag, callback);
};

SerfProvider.prototype.__setTag = function (tag, callback) {
	var command = 'serf tags -set ' + tag;
	console.log('Executing:', command);
	var self = this;
	this.exec(command, function (error, stdout, stderr) {
		console.log('Command executed', error, stdout, stderr);
		if(error){
			setTimeout(function(){
				self.__setTag(tag, callback);
			}, 1000);
		} else {
			if (typeof callback == "function") {
				callback(true);
			}
		}
	});
};

module.exports = SerfProvider;
