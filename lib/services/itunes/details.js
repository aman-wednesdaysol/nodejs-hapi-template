import axios from 'axios';
import { badGateway, notFound } from '@hapi/boom';
import { ITUNES_LOOKUP_URL, SERVICE_UNAVAILABLE_MESSAGE } from '@utils/constants';


/**
 * Get song details from iTunes API by trackId
 *
 * @param {Object} params
 * @param {Number} params.trackId
 */
export default async function getSongDetails({ trackId }) {
  try {
    const response = await axios.get(ITUNES_LOOKUP_URL, {
      params: { id: trackId },
      timeout: 3000,
    });

    const { results = [] } = response.data;

    if (!results.length) {
      throw notFound('Song not found');
    }

    const song = results[0];

    return {
      trackId: song.trackId,
      trackName: song.trackName,
      artistName: song.artistName,
      albumName: song.collectionName,
      previewUrl: song.previewUrl,
      artworkUrl: song.artworkUrl100,
      trackPrice: song.trackPrice,
      currency: song.currency,
      releaseDate: song.releaseDate,
      genre: song.primaryGenreName,
      durationMs: song.trackTimeMillis,
      trackUrl: song.trackViewUrl,
    };
  } catch (error) {
    if (error.isBoom) throw error;
    throw badGateway(SERVICE_UNAVAILABLE_MESSAGE);
  }
}
