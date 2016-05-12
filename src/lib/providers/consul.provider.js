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

var ConsulHelper = require('./consul/consulHelper.js'),
    DnsChecker = require('./consul/dnsChecker.js');

var ConsulProvider = function (consulHelper, dnsChecker) {
	this.consulHelper = consulHelper || new ConsulHelper();
    this.dnsChecker = dnsChecker || new DnsChecker();
};

ConsulProvider.prototype.addService = function (service, callback) {
    var self = this;
    var consulService = this.__addPortCheck(service);
    this.consulHelper.registerService(consulService, function(result, error){
        if(!error) {
            var dnsEntry = service.getName() + '.service.consul';
            self.dnsChecker.verifyEntryExists(dnsEntry, function(resultDns){
                if(resultDns === true){
                    callback(true);
                } else {
                    setTimeout(function(){
                        self.addService(service, callback);
                    }, 1000);
                }
            });
        } else {
            callback(error);
        }
    });
};

ConsulProvider.prototype.__addPortCheck = function (service) {
    var result = {
        "ID": service.getId(),
        "Name": service.getName(),
        "Address": service.getIp(),
        "Port": service.getPort(),
        "Check": {
            "id": service.getId() + '_check',
            "name": service.getName(),
            "service_id": service.getId(),
            "script": "netstat -antp 2>&1 | grep " + service.getPort() + " | grep LISTEN > /tmp/dacheck ; if [[ $? != 0 ]]; then exit 2; fi",
            "interval": "10s"
        }
    };
    return result;
};


module.exports = ConsulProvider;
