#!/usr/bin/env node

//Import packages
import moment from "moment-timezone";
import minimist from "minimist";
import fetch from "node-fetch";

//grab provide args
var args = minimist(process.argv.slice(2));

//PROCESS INPUTS
if(args.h){
    console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit.
    `);
    process.exit(0);
}

//set timezime
var timezone = moment.tz.guess(); 

if(args.z){
    timezone = args.z
} 

//settiing longitude and latitude
var latitude = args.n || (args.s * -1);
var longitude = args.e || (args.w * -1);



// Make a request
const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&timezone=" + timezone + "&daily=precipitation_hours");

// Get the data from the request
const data = await response.json();

if(args.j){
    console.log(data);
    process.exit(0);
}

let days; 

if (args.d == null) {
	days = 1;
} else {
	days = args.d;
}


if (days == 0) {
    console.log( data.daily.precipitation_hours[0] + " " +  "today.");
  } else if (days > 1) {
      console.log( data.daily.precipitation_hours[days] + " " + "in " + days + " days.");
  } else {
      console.log( data.daily.precipitation_hours[1] + " " +  "tomorrow.");
  }

