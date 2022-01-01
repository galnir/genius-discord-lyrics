# genius-discord-lyrics
A utility that fetches song lyrics from Genius

## Installation

```sh-session
npm install genius-discord-lyrics
yarn add genius-discord-lyrics
```

## Usage

```javascript
const { GeniusLyrics } = require('genius-discord-lyrics');

const genius = new GeniusLyrics('Genius-API-key');

const lyrics = await genius.fetchLyrics('Never Gonna Give You Up');
```
