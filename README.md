# BeastBot, the angry youtube commentor bot
## Trying to win Mr Beast's 1000 dollars for being one of the earliest 10 commenters on his youtube video that comes out on the 19th. 

_*DISCLAIMER* To the best of my knowledge, I am not violating any Youtube Guidelines, please do not replicate unless you know what you're doing._

## Raw first thoughts and research
* Set up an interval loop that runs every second as long as we have not already commented on the latest video. Also set up a txt file with just a boolean to show if we have commented on the latest video or not. If time is > 3:59pm ET 19th December 2019, then continue
* Write up a function that returns the latest youtube video from Mr. Beast's channel and check if the latest video is not the, "Last To Stop Biking Wins $1,000,000 (Part 4)" video with video id wMuYiLby3-s as that was the previous video and we're looking for the one after this.
This API call gives out the latest videos: https://www.googleapis.com/youtube/v3/search?key={your_key_here}&channelId={channel_id_here}&part=snippet,id&order=date&maxResults=20
* If latest video is the one we want to comment on from the previous function. We call the comment function which takes in parameters videoId and comment. This is the API documentation for adding new top level comments to a youtube video:
https://developers.google.com/youtube/v3/docs/commentThreads/insert
* The bot will comment three times and then set the boolean to true, therefore breaking the loop

## Steps / Pseudocode
1) Start loop, if time is > 3:59pm ET 19th December 2019, then continue with step 2
2) If beastState.txt is, "happy" stop loop. If, "angry", continue to step 3
3) Call latestVideo() function which will either be falsey or have a value returned for videoID
4) If videoID returned from latestVideo(function) then run comment function, beastComment(videoId, "Comment text") three times and set beastState.txt to, "happy"

## Precautions
* Youtube Data API V3 has quota limitations, therefore loop should ideally start running from 3:55PM ET, hopefully MrBeast is on time. Quota is 10,000 requests per day. ( 10,000 requests / 60 seconds ) = 166.666666667 minutes. That would be more than two hours of pinging which is great. 
  * https://www.youtube.com/watch?v=RjUlmco7v2M
    * need to use playlist api, current search api call is 100 quota points
