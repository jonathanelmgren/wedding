export type GoogleImagesResponse = {
  nextPageToken: string;
  mediaItems: GoogleImages;
};

export type GoogleImage = {
  id: string;
  productUrl: string;
  baseUrl: string;
  mimeType: string;
  mediaMetadata: {
    creationTime: string;
    width: string;
    height: string;
    photo: Record<string, unknown>; // Assuming 'photo' is an object with unknown structure
  };
  filename: string;
};

export type GoogleImages = GoogleImage[];

export type WeddingImage = {
  default: {
    url: string;
    width: number;
    height: number;
  };
  thumbnail: {
    url: string;
    width: number;
    height: number;
  };
  filename: string;
};
