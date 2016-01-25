var awsIot = require('aws-iot-device-sdk');
var config = require('./config.json');

var thingShadows = awsIot.thingShadow(config);

// Load Grove module
var groveSensor = require('jsupm_grove');



// Create the light sensor object using AIO pin 0
var light = new groveSensor.GroveLight(0);

// Create the temperature sensor object using AIO pin 1
var temp = new groveSensor.GroveTemp(1);

//Define your device name
var Device_Name = 'intel-edison';

//create global state variable

var reported_state = { lux: 0, temp: 0};

//create global sensor value variables:

var read_lux = 0;
var read_temp = 0;


// Thing shadow state

var rgbLedLampState = {"state":{"desired":{"red":187,"green":114,"blue":222}}};


// Client token value returned from thingShadows.update() operation

var clientTokenUpdate;

thingShadows.on('connect', function() {

 console.log('registering device: '+ Device_Name);

  // After connecting to the AWS IoT platform, register interest in the
  // Thing Shadow named 'RGBLedLamp'.

  thingShadows.register( 'hueLamp' );

  // 2 seconds after registering, update the Thing Shadow named
  // 'RGBLedLamp' with the latest device state and save the clientToken
  // so that we can correlate it with status or timeout events.

  // Note that the delay is not required for subsequent updates; only
  // the first update after a Thing Shadow registration using default
  // parameters requires a delay.  See API documentation for the update
  // method for more details.

  setTimeout( function() {
    clientTokenUpdate = thingShadows.update('hueLamp', rgbLedLampState  );
  }, 2000 );
});

thingShadows.on('status',
function(thingName, stat, clientToken, stateObject) {
  console.log('received ' + stat + ' on ' + thingName + ': ' +
  JSON.stringify(stateObject));
});

thingShadows.on('delta',
function(thingName, stateObject) {
  console.log('received delta '+' on '+thingName+': '+
  JSON.stringify(stateObject));
});

thingShadows.on('timeout',
function(thingName, clientToken) {
  console.log('received timeout '+' on '+operation+': '+
  clientToken);
});
