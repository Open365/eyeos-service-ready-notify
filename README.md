Service Ready Notifier Library
==============================

## Overview

This library can be used to notify(to consul for example) when a service is ready.

## How to use it

Websockify for example:

```javascript
var Notifier = require('eyeos-service-ready-notify');

this.notifier = new Notifier();
this.notifier.registerService('websockify123','websockify', '192.168.1.2', '8010', function(res){
	if(res){
		console.log('success');
	} else {
		console.log('error: ', res);
	}
});
```

## Quick help

* Install modules

```bash
	$ npm install
```

* Check tests

```bash
    $ grunt test
    $ npm test
```