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

var sinon = require('sinon'),
    assert = require('chai').assert;
var	ConsulHelper = require('../../../../../lib/providers/consul/consulHelper.js'),
    DnsChecker = require('../../../../../lib/providers/consul/dnsChecker.js'),
    ConsulProvider = require('../../../../../lib/providers/consul.provider.js'),
    Service = require('../../../../../lib/dto/service.js');

suite('ConsulHelper', function () {
	var sut, consulHelper, service, id, name, ip, port, consulService, dnsChecker, dnsEntry;

    setup(function () {
        id = 'lerele';
        name = 'eyeosService';
        ip = '255.255.255.255';
        port = '1111';
        service = new Service(id, name, ip, port);
        consulService = {
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
        dnsEntry = service.getName() + '.service.consul';
        dnsChecker = new DnsChecker();
        consulHelper = new ConsulHelper();
		sut = new ConsulProvider(consulHelper, dnsChecker);
    });

    teardown(function () {

    });

    test('AddService calls RegisterService', sinon.test(function () {
        var stub = sinon.stub(consulHelper,'registerService', function(){});
        sut.addService(service, function(){});
        sinon.assert.calledWithExactly(stub, consulService, sinon.match.func)
    }));

    test('AddService calls verifyEntryExists', sinon.test(function () {
        var stubForTriggering = sinon.stub(consulHelper,'registerService', function(consulService, cb){
            cb(true);
        });
        var stub = sinon.stub(dnsChecker,'verifyEntryExists', function(){});
        sut.addService(service, function(){});
        sinon.assert.calledWithExactly(stub, dnsEntry, sinon.match.func)
    }));
});
