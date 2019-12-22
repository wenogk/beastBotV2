# BeastBot, the angry youtube commentor bot (version 2)
## Trying to win Mr Beast's 1000 dollars for being one of the earliest 10 commenters on his youtube video that comes out on the 19th December 2019. 

_*DISCLAIMER* To the best of my knowledge, I am not violating any Youtube Guidelines, please do not replicate unless you know what you're doing._

## Raw first thoughts and research
* Set up an interval loop that runs every second as long as we have not already commented on the latest video. Also set up a txt file with just a boolean to show if we have commented on the latest video or not. 
* Write up a function that returns the latest youtube video from Mr. Beast's channel and check if the latest video is not the, "Last To Stop Biking Wins $1,000,000 (Part 4)" video with video id wMuYiLby3-s as that was the previous video and we're looking for the one after this.
  * This API call gives out the latest videos: https://www.googleapis.com/youtube/v3/search?key={your_key_here}&channelId={channel_id_here}&part=snippet,id&order=date&maxResults=20
* If latest video is the one we want to comment on from the previous function. We call the comment function which takes in parameters videoId and comment. 
  * This is the API documentation for adding new top level comments to a youtube video:
https://developers.google.com/youtube/v3/docs/commentThreads/insert
* The bot will comment three times and then set the boolean to true, therefore breaking the loop

## Huge updates - Version 2
* In terms of the Youtube Data API quota, each query on the search API takes 100 points per request out of the total 10,000 maximum per day. This quota usage was not good as it would limit the frequency of requests possible therefore had to alternate to the playlist API where the upload playlist of MrBeast's channel was queried for the latest video, this had a quota of 3 points per request which is a **97% reduction in quota usage**
* Something noticed when testing on my own channel by adding new videos is that the Youtube Data API is very slow in terms of updating its lists of videos (it took around **5 minutes on average** to add a new video) therefore further alternatives were required. 
* The first alternative I found was that youtube has an RSS XML service where they provide channel videos to RSS Readers. For example if you go to https://www.youtube.com/feeds/videos.xml?channel_id={channelIDHere} it would give you a xml list of videos. The cool thing about this method is that it doesn't require API keys or authorization which is neat. Although accessing it programmatically is only possible through a server (cross browser origin problems) which is why I had to create a node.js express server endpoint to get data from the RSS url. The RSS url was however also not fast enough in terms of getting the latest video as it took around **3 minutes on average** after testing.
* The second alternative was the one I didn't think I'd have to implement having the API's but due to their inefficiency I had to build my own web scraper. If first inspected the youtube channel's, "videos" page and "featured" page and noticed that the latest video comes up there quite quickly and noted down the classes of the links pointing to the youtube videos. I also noticed after testing that sometimes the video would first pop up in the featured page and sometimes on the videos page which meant using both would be a good idea. I built a scraper that opens the youtube channel videos url, get's the latest url link and title by finding the first .yt-uix-tile-link class and returns it. I did the same for the youtube featured videos url. This brought down the time to around **1 minute on average**
  * I used cheerio, which is a "Fast, flexible & lean implementation of core jQuery designed specifically for the server" in order to quickly find elements on the pages I am scraping on.
  * I noticed after a couple thousand scraping requests, my ip used to scraped was blocked from making any further requests. I then used the TOR-request library on node.js that allows requests to be made anonymously using the TOR network, this proved to be a bit slower as the requests go through other people's computers around the world. Towards the time the video waas released I switched computers and got the code running on that instead as it had a fresh ip instead of using the TOR request.
 * **To make the beast as powerful as possible I used ALL of the methods above into its workflow. I had a total of 6, "hunt" methods that would ALL be run at each loop:**
 1. hunt() method is to request the latest video from the Youtube API through the playlistItems API
 1. hunt2() method is to request the latest video from the RSS XML url for a channels videos from Youtube
 1. hunt3() method is to request the latest video by scraping the youtube channel's "videos" page from my local computer
 1. hunt4() method is to request the latest video by scraping the youtube channel's "featured" page from my local computer
 1. hunt5() method does the same as the hunt3() except its anonymous using the tor-request module. This method is slower than hunt3() however was put in as a preqecaution in case my local computer ip was blocked.
 1. hunt6() method does the same as the hunt4() except its anonymous using the tor-request module. This method is slower than hunt4() however was put in as a preqecaution in case my local computer ip was blocked.
 At every loop, all 6 of these methods would be carried out and the first to get the latest video would call the execute() method to call the Youtube comment API and comment on the video.
   * To make the code more organized, all of the 6 hunt() methods return a json object as follows.
 `{
 title: "title",
 link: "videoID"
 }`
 When an error occurs in any of the hunt methods, the title and link would default to "none" making it easier to ignore when handling the response.
 



## Steps / Pseudocode
1. Google data API key, client ID, Current latest video id, channelID, upload playlistID have to be hardcoded in the webConfig.js file (not on the repo as has sensitive info)
1. Authorize BeastBot to comment by logging in with Youtube account. 
1. State is set up, with a commented boolean to set if executed succesfully, current latest video id variable and quota usage variable.
1.  Hunting loop
   1. If boolean commented is true,  break loop
   1. hunt() 
     1. If latest video id returned not equal to current latest video id, call execute(latestVideoID) to comment
     1. hunt2()
      If latest video id returned not equal to current latest video id, call execute(latestVideoID) to comment
     1. hunt3()
      If latest video id returned not equal to current latest video id, call execute(latestVideoID) to comment
     1. hunt4()
      If latest video id returned not equal to current latest video id, call execute(latestVideoID) to comment
     1. hunt5()
      If latest video id returned not equal to current latest video id, call execute(latestVideoID) to comment
     1. hunt6()
      If latest video id returned not equal to current latest video id, call execute(latestVideoID) to comment

1. If videoID returned from latestVideo(function) then run comment function, beastComment(videoId, "Comment text") three times and set beastState.txt to, "happy"

## Precautions
* Youtube Data API V3 has quota limitations, therefore loop should ideally start running from 3:55PM ET, hopefully MrBeast is on time. Quota is 10,000 requests per day. ( 10,000 requests / 60 seconds ) = 166.666666667 minutes. That would be more than two hours of pinging which is great. 
  * https://www.youtube.com/watch?v=RjUlmco7v2M
    * need to use playlist api, current search api call is 100 quota points
