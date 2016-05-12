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

var Service = function (id, name, ip, port) {
    this.id = id;
    this.name = name;
    this.ip = ip;
    this.port = parseInt(port);
};

Service.prototype.setId = function (id) {
    this.id = id;
};

Service.prototype.getId = function () {
    return this.id;
};

Service.prototype.setName = function(name){
    this.name = name;
};

Service.prototype.getName = function(){
    return this.name;
};

Service.prototype.setIp = function(ip){
    this.ip =  ip;
};

Service.prototype.getIp = function(){
    return this.ip;
};

Service.prototype.setPort = function (port) {
    this.port = parseInt(port);
};

Service.prototype.getPort = function () {
    return this.port;
};

module.exports = Service;
