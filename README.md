# Departure Times with 511 API

A pretty basic site for getting the predicted departure times for a bus by stop
id from the 511 API. 

## Server Setup

1. Copy `myConf-template.js` to `myConf.js` and fill it with the required info.
2. Run the server with `node server.js`4

## Usage

Go to "/[stopId]" to the server location. E.g. "http://localhost:8080/54321"
will give you the departure times for stop "54321".

---
This was one of my first attempts at using node.js, so I apologize if something
doesn't work and for some messy code. I'll try to update it at some point. 
