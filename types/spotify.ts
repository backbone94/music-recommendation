export type Artist = {
  name: string;
};

export type Track = {
  id: number;
  name: string;
  artists: Artist[];
  external_urls: {
    spotify: string;
  };
  album: {
    images: [
      {
        url: string;
      },
    ],
  },
};

export type TrackClient = {
  id: number;
  name: string;
  artists: string;
  albumImageUrl: string;
  url?: string;
};
