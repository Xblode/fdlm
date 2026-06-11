export type SubmissionType = "artist" | "venue";

export type VenueArtistEntry = {
  name: string;
  hoursStart: string;
  hoursEnd: string;
  style: string;
};

export type ArtistEventSubmission = {
  type: "artist";
  name: string;
  venue: string;
  hoursStart: string;
  hoursEnd: string;
  style: string;
  cityId: string;
};

export type VenueEventSubmission = {
  type: "venue";
  venueName: string;
  hoursStart: string;
  hoursEnd: string;
  cityId: string;
  artists: VenueArtistEntry[];
};

export type EventSubmission = ArtistEventSubmission | VenueEventSubmission;

export type SubmissionStatus = "pending" | "approved" | "rejected";

export type StoredSubmission = {
  id: string;
  status: SubmissionStatus;
  createdAt: string;
  reviewedAt?: string;
  payload: EventSubmission;
};
