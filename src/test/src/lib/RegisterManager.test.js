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
	assert = require('chai').assert,
	RegisterManager = require('../../../lib/registerManager.js'),
	setings = require('../../../settings.js'),
	Provider = require('../../../lib/providers/'+setings.provider+'.provider.js'),
	Service = require('../../../lib/dto/service.js');

suite('RegisterManager', function () {
	var sut, provider, service;

	setup(function () {
		service = new Service('serv123', 'serv', 'localhost', '9999');
		provider = new Provider();
		sut = new RegisterManager(setings, provider);
	});

	teardown(function () {

	});

	test('RegisterManager should call addService on the provider with a valid service', sinon.test(function () {
		var stub = sinon.stub(provider, 'addService', function () {});
		sut.createService(service, function(){});
		sinon.assert.calledWithExactly(stub, service, sinon.match.func);
	}));

});
