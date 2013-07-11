


```
         _______       ___           _______. __    __         __       _______. 
        |       \     /   \         /       ||  |  |  |       |  |     /       | 
        |  .--.  |   /  ^  \       |   (----`|  |__|  |       |  |    |   (----` 
        |  |  |  |  /  /_\  \       \   \    |   __   | .--.  |  |     \   \ 
        |  '--'  | /  _____  \  .----)   |   |  |  |  | |  `--'  | .----)   | 
        |_______/ /__/     \__\ |_______/    |__|  |__|  \______/  |_______/ 
```

--

Screen based dashboard powered by node and socket.io.

In other words, instead of showing a dashboard crammed full of widgets, the
emphasis is on a screen that subscribes to a channel and then that channel
rotates between content.  This screen approach also allows for interruptible
content to be injected as needed.

--

# setup

- clone this repo
- npm install # to install the dependencies
- node app.js

#### Broadcast to the Dashboard

The dashboard currently accepts a `url` and `text` key in the JSON payload

**Example URL request**
```
POST http://dashboard/broadcast
Content-Type: application/json
{
    "url": "http://github.com"
}
```

** Example text request**
```
POST http://dashboard/broadcast
Content-Type: application/json
{
    "text": "dashboards are ggggrrreeaatt!"
}
```

