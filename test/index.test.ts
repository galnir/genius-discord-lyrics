import { GeniusLyrics } from '../src/index';
// there needs to be a config.json with a genius api key in order to run this test
import * as data from '../config.json';

const genius = new GeniusLyrics(data.genius_token);

describe('test that the API works', () => {
  it('Should be a non empty string', async () => {
    const lyrics = await genius.fetchLyrics('Never Gonna Give You Up');
    expect(typeof lyrics).toBe('string');
  });
});
