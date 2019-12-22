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
* The second alternative was the one I didn't think I'd have to implement having the API's but due to their inefficiency I had to build my own web scraper. If first inspected the youtube channel's, "videos" page and "featured" page and noticed that the latest video comes up there quite quickly and noted down the classes of the links pointing to the youtube videos. I built a scraper that first opens the youtube channel videos url, get's the latest url link by finding the first .yt-uix-tile-link class and returns it. I did the same for the youtube featured videos url. This brought down the time to around **1 minute on average**
  * I used cheerio, which is a "Fast, flexible & lean implementation of core jQuery designed specifically for the server" in order to quickly find elements on the pages I am scraping on.
  * I noticed after a couple thousand scraping requests, my ip used to scraped was blocked from making any further requests. I then used the TOR-request library on node.js that allows requests to be made anonymously using the TOR network, this proved to be a bit slower as the requests go through other people's computers around the world. Towards the time the video waas released I switched computers and got the code running on that instead as it had a fresh ip instead of using the TOR request.
* To make the beast as powerful as possible I used all of the methods above into its workflow. I had a total of 6, "hunt" methods:
 1. Hunt method 1
 1. Hunt method 2



## Steps / Pseudocode
1) Start loop, if time is > 3:59pm ET 19th December 2019, then continue with step 2
2) If beastState.txt is, "happy" stop loop. If, "angry", continue to step 3
3) Call latestVideo() function which will either be falsey or have a value returned for videoID
4) If videoID returned from latestVideo(function) then run comment function, beastComment(videoId, "Comment text") three times and set beastState.txt to, "happy"

## Precautions
* Youtube Data API V3 has quota limitations, therefore loop should ideally start running from 3:55PM ET, hopefully MrBeast is on time. Quota is 10,000 requests per day. ( 10,000 requests / 60 seconds ) = 166.666666667 minutes. That would be more than two hours of pinging which is great. 
  * https://www.youtube.com/watch?v=RjUlmco7v2M
    * need to use playlist api, current search api call is 100 quota points
