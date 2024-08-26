export type SpotifyArtist = {
  name: string;
};

export type SpotifyTrack = {
  id: number;
  name: string;
  artists: SpotifyArtist[];
  popularity: number;
  external_urls: {
    spotify: string;
  };
};
