export type SpotifyArtist = {
  name: string;
};

export type SpotifyTrack = {
  name: string;
  artists: SpotifyArtist[];
  popularity: number;
  external_urls: {
    spotify: string;
  };
};
