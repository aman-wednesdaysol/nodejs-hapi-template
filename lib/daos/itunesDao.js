import axios from 'axios';
import { badGateway } from '@hapi/boom';

const ITUNES_BASE_URL = 'https://itunes.apple.com/search';

/**
 * Search songs from iTunes API
 *
 * @param {Object} params
 * @param {String} params.term
 * @param {Number} params.limit
 * @param {Number} params.offset
 * @param {String} params.country
 */
export default async function searchSongsFromItunes ({
  term,
  limit = 25,
  offset = 0,
  country = 'US',
}) {
  try {
    // console.log("Request reached here successfully with term:", term);
    const response = await axios.get(ITUNES_BASE_URL, {
      params: {
        term,
        entity: 'song',
        media: 'music',
        limit,
        offset,
        country,
      },
      timeout: 3000,
    });

    const { results = [] } = response.data;

    // Normalize response
    return results.map((song) => ({
      trackId: song.trackId,
      trackName: song.trackName,
      artistName: song.artistName,
      albumName: song.collectionName,
      previewUrl: song.previewUrl,
      artworkUrl: song.artworkUrl100,
    }));
  } catch (error) {
    throw badGateway('iTunes service unavailable');
  }
}
