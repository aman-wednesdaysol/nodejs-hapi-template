import supabaseConfig from '@config/supabase';

export const TIMESTAMP = 'YYYY-MM-DD HH:mm:ss';

export const ITUNES_BASE_URL = 'https://itunes.apple.com/search';

export const ITUNES_LOOKUP_URL = 'https://itunes.apple.com/lookup';

// Supabase headers

  export const SB_HEADER = {
      headers: {
        apikey: supabaseConfig.anonKey,
        'Content-Type': 'application/json',
      },
    };

    export const BEARER_REGEX = /^Bearer\s+(.+)$/i;


    export const SB_ERROR = "Error while signing up with Supabase"

    export const TOKEN_ERROR= "Error while creating access token"

    // Music service constants
    export const SEARCH_SONGS_PATH = '/songs';
    export const SONG_DETAILS_PATH = '/songs/{trackId}';
    export const DEFAULT_LIMIT = 25;
    export const DEFAULT_OFFSET = 0;
    export const DEFAULT_COUNTRY = 'US';
    export const SEARCH_SONGS_DESCRIPTION = 'Search songs';
    export const SEARCH_SONGS_NOTES = 'Search songs using iTunes API';
    export const SONG_DETAILS_DESCRIPTION = 'Get song details';
    export const SONG_DETAILS_NOTES = 'Get detailed information about a song by trackId from iTunes API';
    export const SERVICE_UNAVAILABLE_MESSAGE = 'iTunes service unavailable';
