


```
       _______       ___           _______. __    __         __       _______. 
      |       \     /   \         /       ||  |  |  |       |  |     /       | 
      |  .--.  |   /  ^  \       |   (----`|  |__|  |       |  |    |   (----` 
      |  |  |  |  /  /_\  \       \   \    |   __   | .--.  |  |     \   \ 
      |  '--'  | /  _____  \  .----)   |   |  |  |  | |  `--'  | .----)   | 
      |_______/ /__/     \__\ |_______/    |__|  |__|  \______/  |_______/ 
```

--

Channel based dashboard powered by node and socket.io.

In other words, instead of showing a dashboard crammed full of widgets, the
emphasis is on a screen that subscribes to a channel and then that channel
rotates between content.  This channel approach also allows for interruptible
content to be injected as needed.

--

# setup

- clone this repo
- npm install # to install the dependencies
- node app.js

# dashboard api

## channel creation

POST to /channel

## broadcasting

The dashboard accepts a json object defining a `type` and `data`.

At present, `type` is limited to either `pane`, `url` or `text`.

### Panes

A pane is a piece of information displayed by the dash that will fit into the
billboard component provided by the channel. It lacks header and footer, so
depends on the page setup it's injected into.

**Example Pane request**
```
POST http://dashboard/broadcast/CHANNEL_NAME
Content-Type: application/json
{
  "type": "pane",
  "data": "/flag/SOME_FLAG_HASH"
}
```

### URLs

A URL will inject an iframe into the billboard of the channel and therefore
will not inherit any js libraries or styles.  The content needs to be
considered "self-contained".

**Example URL request**
```
POST http://dashboard/broadcast/CHANNEL_NAME
Content-Type: application/json
{
  "type": "url",
  "data": "http://github.com"
}
```
### Text

This is similar to a Pane but will be wrapped in some billboard type styling.

**Example text request**
```
POST http://dashboard/broadcast/MYCHAN
Content-Type: application/json
{
  "type": "text",
  "data": "dashboards are ggggrrreeaatt!"
}
```

## defining content

Right now, there is one type of content that dash can track: Flags.

### Flags

A flag is basically a visual state machine that is one of `fail`, `stale`,
`ok`.  An expiration for `stale` and `fail` are available.

An `ok` flag will move to the `stale` state if no update has been received
within `stale` seconds.  A `stale` flag will move to `fail` if no update has been
received within `fail` seconds after `ok`.

**NOTICE** the `fail` timer and the `stale` timer begin at the same time so if
`fail` is smaller than `stale`, then stale will be skipped.

__At present, the API for `stale` is not available.__

**example flag creation**
```
POST http://dashboard/flag
Content-Type: application/json
{
  "name": "my new flag",
  "stale": SECONDS,
  "expire": SECONDS
}
```

would return `{flag: SOME_UNIQ_HASH}`.  This hash provides the key used to
interact with this flag.

The flag depends on an external reporter to set the state of the flag. 

**example flag set**
```
POST http://dashboard/flag/SOME_UNIQ_HASH
Content-Type: application/json
{
  "state": "ok"
}
```
The proper values are one of `[0,1,2]` or `[fail,stale,ok]`.

Flags can be retrieved with the following:

**example flag retrieval**
```
GET http://dashboard/flag/SOME_UNIQ_HASH
Content-Type: application/json
{
  "flag": "ok", "name":"Bocephus Flaggerton"
}
```
`flag` can be one of `[ok,stale, fail]`.

OR

**example flag retrieval, html**
```
GET http://dashboard/flag/SOME_UNIQ_HASH
Content-Type: text/html
<div><i class="icon-flag flag-ok"></i></div>
```

This returns an html version of the same flag.  The html may change a bit
depending on styling, so for parsing purposes it's best to use the json.


