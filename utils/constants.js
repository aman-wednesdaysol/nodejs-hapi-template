import supabaseConfig from '@config/supabase';

export const TIMESTAMP = 'YYYY-MM-DD HH:mm:ss';

export const ACCESS_DENIED = 'ACCESS_DENIED';

export const SCOPE_TYPE = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
  INTERNAL_SERVICE: 'INTERNAL_SERVICE',
};
export const ADMINS = [
  SCOPE_TYPE.SUPER_ADMIN,
  SCOPE_TYPE.ADMIN,
  SCOPE_TYPE.INTERNAL_SERVICE,
];
export const SLIDING_WINDOW = 1 * 24 * 60 * 60; // days * hours * minutes * seconds *
export const INVALID_CLIENT_CREDENTIALS = 'Invalid client credentials';
export const OAUTH_CLIENT_ID = 'OAUTH_CLIENT_ID';

export const SUPER_SCOPES = [
  SCOPE_TYPE.SUPER_ADMIN,
  SCOPE_TYPE.INTERNAL_SERVICE,
];

export const GET_USER_PATH = '/users/{userId}';
export const LOGIN_PATH = '/'
export const SIGNUP_PATH = '/';
export const LIBRARY_PATH = '/';
export const LIKE_SONG_PATH = '/like';
export const UNLIKE_SONG_PATH = '/unlike/{trackId}';
export const LOGOUT_PATH = '/';

export const USER_ID = 'USER_ID';

export const DEFAULT_METADATA_OPTIONS = {
  scope: SCOPE_TYPE.ADMIN,
  resourceType: OAUTH_CLIENT_ID,
};

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
    export const HAPI_RATE_LIMIT_OPTIONS = 'hapi-rate-limit';

    export const TABLE = 'liked_songs';
    export const SUPABASE_NOT_CONFIGURED = 'Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.';

    export const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
    }

    export const RATE_LIMIT_OPTIONS = {
  userPathLimit: 5,
  expiresIn: 60000, // 1 minute
    }

    // Login tags 
    export const AUTH_OPT ={
LOGIN_OPT :{
  description: 'login',
  notes: 'API to login and create access token',
  tags: ['api', 'auth', 'login'],
    },

LOGOUT_OPT :{
  description: 'logout',
  notes: 'API to logout and revoke access token',
  tags: ['api', 'auth', 'logout'],
    },

  SIGNUP_OPT :{
    description: 'signup',
    notes: 'API to signup user via Supabase',
    tags: ['api', 'auth', 'signup'],
      },

 
  } 


  export const MUSIC_OPT = {
          LIBRARY_OPT :{
        description: 'music library',
        notes: 'APIs to manage user music library',
        tags: ['api', 'music-library'],
          },


          SEARCH_SONG : {
            description: 'search songs',
            notes: 'API to search songs using iTunes API',
            tags: ['api', 'music', 'search'],
          },
          LIKED_SONGS : {
            description: 'liked songs',
            notes: 'API to get user liked songs',
            tags: ['api', 'music', 'liked-songs'],
          },
          SONG_DETAILS : {
            description: 'song details',
            notes: 'API to get song details by trackId', 
            tags: ['api', 'music', 'song-details'],
          },
  }
