const fetch = require("node-fetch"); // run npm i node-fetch --save
//npm install googleapis --save
//npm install google-auth-library --save
var readline = require('readline');
var {google} = require('googleapis');
var OAuth2 = google.auth.OAuth2;
const https = require('https');
var fs = require('fs');
var config = require("./config.js"); //setup config.js with export API_KEY for Google API KEY

function getBeastState() {
return fs.readFileSync('beastState.txt','utf8')
}

function setBeastState(state) {
  fs.writeFileSync("beastState.txt", state);
}


https.get("https://www.googleapis.com/youtube/v3/search?key=" + config.API_KEY + "&channelId=UCX6OQ3DkcsbYNE6H8uQQuVA&part=snippet,id&order=date&maxResults=1"
, (resp) => {
  let data = '';
  resp.on('data', (chunk) => {
    data += chunk;
  });

  resp.on('end', () => {
    console.log(JSON.parse(data).items[0].id.videoId);
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});

function beastComment(data) {
console.log("data: " +data)
}


//latestVideo()
