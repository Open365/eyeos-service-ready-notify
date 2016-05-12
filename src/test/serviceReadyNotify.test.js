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
var ServiceReadyNotify = require('../serviceReadyNotify.js'),
    RegisterManager = require('../lib/registerManager.js'),
    Service = require('../lib/dto/service.js');

suite('ServiceReadyNotify', function () {
    var sut, registerManager, service, id, name, ip, port, getIp;
    setup(function () {
        id = 'lerele';
        name = 'eyeosService';
        ip = '255.255.255.255';
        port = '1111';

		process.env.WHATAMI = name;
		process.env.PUBLIC_IP = ip;
		process.env.PORT = port;
        registerManager = new RegisterManager();
		sinon.stub(registerManager, 'createService');

        sut = new ServiceReadyNotify(registerManager);
        getIp = sinon.stub(sut, '__getIp');
        getIp.callsArgOnWith(0, sut, ip);
    });

    teardown(function () {
		process.env.WHATAMI = null;
    });

    test('ServiceReadyNotify must call createService with a valid service', sinon.test(function () {
        var service = new Service(id, name, ip, port);
        sut.registerService(id, name, ip, port, function(){});
        sinon.assert.calledWithExactly(registerManager.createService, service, sinon.match.func);
    }));

	test('Should pick from process.env.HOSTNAME the id if it is empty', function () {
		process.env.HOSTNAME = 'process_id';
		var service = new Service(process.env.HOSTNAME, name, ip, port);
		sut.registerService(null, name, ip, port, function(){});
		sinon.assert.calledWithExactly(registerManager.createService, service, sinon.match.func);
	});

	test('Should pick from process.env.WHATAMI the name if it is empty', function () {
		var service = new Service(id, name, ip, port);
		sut.registerService(id, null, ip, port, function(){});
		sinon.assert.calledWithExactly(registerManager.createService, service, sinon.match.func);
	});

	test('Should pick from process.env.PUBLIC_IP the ip if it is empty', function () {
		var service = new Service(id, name, ip, port);
		sut.registerService(id, name, null, port, function(){});
		sinon.assert.calledWithExactly(registerManager.createService, service, sinon.match.func);
	});

	test('Should set ip from getIp is PUBLIC_IP is empty', function () {
		var service = new Service(id, name, ip, port);
		delete process.env.PUBLIC_IP;
		sut.registerService(id, name, null, port, function(){});
		sinon.assert.calledWithExactly(registerManager.createService, service, sinon.match.func);
	});

	test('Should pick from process.env.PORT the port if it is empty', function () {
		var service = new Service(id, name, ip, port);
		sut.registerService(id, name, ip, null, function(){});
		sinon.assert.calledWithExactly(registerManager.createService, service, sinon.match.func);
	});

	test('Should set port to 0 if no port provided', function () {
		var service = new Service(id, name, ip, 0);
		delete process.env.PORT;
		sut.registerService(id, name, ip, null, function(){});
		sinon.assert.calledWithExactly(registerManager.createService, service, sinon.match.func);
	});
});
