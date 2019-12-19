const express = require('express');
const beast = express();
const fs = require('fs');
const port = 8080;
var convert = require('xml-js');
const cheerio = require('cheerio');
let request = require('request');
var tr = require('tor-request');
//process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
beast.use('/', express.static('public'))
//RUN TOR ON LAPTOP FIRST, "tor &" command on terminal
beast.use('/hunt', (req,res) => {
  let API_KEY = req.query.key;
  let playlistId = req.query.playlistId;
  let url = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=" + playlistId + "&key=" + API_KEY +"&maxResults=1"
  request(url, function(err, resp, body){
    let result;
    try {
      let jsonAll = JSON.parse(body);
      let title = jsonAll.items[0].snippet.title
      let href = jsonAll.items[0].snippet.resourceId.videoId
      let jsonResult = {
        title: title,
        link: href
      }
       res.json(jsonResult)
    } catch(e) {
      let jsonResult = {
        title: "none",
        link: "none"
      }
      console.log(jsonResult + e)
      res.json(jsonResult)
    }
});
});

beast.use('/hunt2/:idVal', (req,res) => {
  let url ="https://m.youtube.com/channel/"+ req.params.idVal + "/featured"
//  tr.reset_identity()
  request(url, function(err, resp, body)  {
    let result;
    //console.log(body)
    //console.log(err)
    try {
      $ = cheerio.load(body);
      links = $('a.yt-uix-tile-link');
      $(links).each(function(i, link){
       let title = $(link).attr('title')
       let href = $(link).attr('href')
       href = href.substring(9,href.length);
       let jsonResult = {
         title: title,
         link: href
       }
        console.log("hunt2: " + title + " - " + href)

        res.json(jsonResult)
        return false;
      });
    } catch(e) {
      let jsonResult = {
        title: "none",
        link: "none"
      }
      //console.log(jsonResult + e)
      res.json(jsonResult)
    }
});
});

beast.use('/hunt3/:idVal', (req,res) => {
  let url = "https://m.youtube.com/channel/"+ req.params.idVal + "/videos"
//  tr.reset_identity()
  request(url, function(err, resp, body){
    let result;
    try {
      $ = cheerio.load(body);
      links = $('a.yt-uix-tile-link');
      $(links).each(function(i, link){
       let title = $(link).attr('title')
       let href = $(link).attr('href')
       href = href.substring(9,href.length);
       let jsonResult = {
         title: title,
         link: href
       }
       console.log("hunt3: " + body)
        res.json(jsonResult)
        return false;
      });
    } catch(e) {
      let jsonResult = {
        title: "none",
        link: "none"
      }

      res.json(jsonResult)
    }
});
});

beast.use('/hunt4/:idVal', (req,res) => {
  let url = "https://www.youtube.com/feeds/videos.xml?channel_id="+ req.params.idVal;
//  tr.reset_identity()
  request(url, function(err, resp, body){
    let result;
    try {
      let jsonAll = convert.xml2js(body, {compact: true, spaces: 4});
      let title = jsonAll.feed.entry[0].title["_text"]
      let href = jsonAll.feed.entry[0]["yt:videoId"]["_text"]
      let jsonResult = {
        title: title,
        link: href
      }
      console.log("hunt4: " + title)
       res.json(jsonResult)
    } catch(e) {
      let jsonResult = {
        title: "none",
        link: "none"
      }

      res.json(jsonResult)
    }
});
});

beast.use('/hunt5/:idVal', (req,res) => {
  let url ="https://m.youtube.com/channel/"+ req.params.idVal + "/featured"
//  tr.reset_identity()
  tr.request(url, function(err, resp, body)  {
    let result;

    try {
      $ = cheerio.load(body);
      links = $('a.yt-uix-tile-link');
      $(links).each(function(i, link){
       let title = $(link).attr('title')
       let href = $(link).attr('href')
       href = href.substring(9,href.length);
       let jsonResult = {
         title: title,
         link: href
       }
       console.log("hunt2: " + title)
        res.json(jsonResult)
        return false;
      });
    } catch(e) {
      let jsonResult = {
        title: "none",
        link: "none"
      }
      //console.log(jsonResult + e)
      res.json(jsonResult)
    }
});
});

beast.use('/hunt6/:idVal', (req,res) => {
  let url = "https://m.youtube.com/channel/"+ req.params.idVal + "/videos"
//  tr.reset_identity()
  request(url, function(err, resp, body){
    let result;
    try {
      $ = cheerio.load(body);
      links = $('a.yt-uix-tile-link');
      $(links).each(function(i, link){
       let title = $(link).attr('title')
       let href = $(link).attr('href')
       href = href.substring(9,href.length);
       let jsonResult = {
         title: title,
         link: href
       }
       console.log("hunt3: " + title)
        res.json(jsonResult)
        return false;
      });
    } catch(e) {
      let jsonResult = {
        title: "none",
        link: "none"
      }

      res.json(jsonResult)
    }
});
});

beast.listen(port, () => console.log(`Beast server up and running on port ${port}!`))
