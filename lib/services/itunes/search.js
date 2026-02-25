import axios from 'axios';
import { badGateway } from '@hapi/boom';
import { SERVICE_UNAVAILABLE_MESSAGE } from '../../../utils/constants';

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

     const fetchLimit = Math.min(offset + limit, 200); // iTunes max is 200


    const response = await axios.get(ITUNES_BASE_URL, {
      params: {
        term,
        entity: 'song',
        media: 'music',
        limit : fetchLimit,
        offset,
        country,
      },
      timeout: 3000,
    });

    const { results = [] } = response.data;
    

    const paginated = results.slice(offset, offset + limit);


    // Normalize response
    return paginated.map((song) => ({
      trackId: song.trackId,
      trackName: song.trackName,
      artistName: song.artistName,
      albumName: song.collectionName,
      previewUrl: song.previewUrl,
      artworkUrl: song.artworkUrl100,
    }));
  } catch (error) {
    throw badGateway(SERVICE_UNAVAILABLE_MESSAGE);
  }
}
