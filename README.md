# firebase-word-assassin
Used at the internationally-renowned Wingo Game of Thrones party

## Setup

### Server

1. Load all files into public folder on server (known error, hard coded in some places to be in `x.com/got`).
1. Run `composer install`

### Firebase

This program uses [Firebase](https://firebase.google.com/) as its database.

1. Sign into [Firebase](https://console.firebase.google.com)
1. Make a new project
1. Go to database and copy url for config

### Config

Not included here is a `config.json` file that needs to be in the root directory.

```
{
  "hash": {
    "key": "hashkeyofjustice",
    "salt": "hawaiianredsalt"
  },
  "twilio": {
    "sid": "go to Twilio for this",
    "token": "yes this will cost a little money it's worth it",
    "number": "+15551231234"
  },
  "firebase": {
    "apiKey": "Get your key from Getting Started",
    "databaseURL": "https://YOUR-PROJECT.firebaseio.com/"
  }
}
```

## Rules

1. Each player must make their target say the target word they are given.
1. When a player is eliminated, they give their target and target word to their assassin.
1. For shorter games, you may want to figure out an alternative way to find a victor when you get down to 2 or 3 players.
