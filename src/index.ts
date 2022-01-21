import cheerio from 'cheerio';
import axios from 'axios';

export class GeniusLyrics {
  token: string;
  constructor(token: string) {
    this.token = token;
  }

  private cleanSongName = (songName: string): string => {
    return songName
      .replace(/ *\([^)]*\) */g, '')
      .replace(
        /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
        ''
      );
  };

  private searchSong = (query: string): Promise<string> => {
    const token = this.token;
    return new Promise(async function (resolve, reject) {
      const searchURL = `https://api.genius.com/search?q=${encodeURI(query)}`;
      const headers = {
        Authorization: `Bearer ${token}`
      };
      try {
        const result = (await axios.get(searchURL, { headers })) as any;
        const url = result.data.response.hits[0].result.url;
        resolve(`${url}`);
      } catch (e) {
        console.log(e);
        reject(':x: No song has been found for this query');
      }
    });
  };

  public fetchLyrics = async (query: string): Promise<string> => {
    const url = await this.searchSong(this.cleanSongName(query));
    return new Promise(async function (resolve, reject) {
      try {
        const response = await axios.get(url);
        const text = await response.data;
        const $ = cheerio.load(text);
        let lyrics = $('.lyrics').text().trim();
        if (!lyrics) {
          $('.Lyrics__Container-sc-1ynbvzw-6').find('br').replaceWith('\n');
          lyrics = $('.Lyrics__Container-sc-1ynbvzw-6').text();
          if (!lyrics) {
            reject(
              'There was a problem fetching lyrics for this song, please try again'
            );
          } else {
            resolve(lyrics.replace(/(\[.+\])/g, ''));
          }
        } else {
          resolve(lyrics.replace(/(\[.+\])/g, ''));
        }
      } catch (e) {
        console.log(e);
        reject(
          'There was a problem fetching lyrics for this song, please try again'
        );
      }
    });
  };
}
