export type SpotifyArtist = {
  name: string;
};

export type SpotifyTrack = {
  name: string;
  artists: SpotifyArtist[];
  external_urls: {
    spotify: string;
  };
};
