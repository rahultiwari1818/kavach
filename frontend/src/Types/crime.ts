import { UserRes } from "./user";

export interface Media {
  _id: string;
  url: string;
  type: "image" | "video";
}

export interface Crime {
  _id: string;
  title: string;
  type: string;
  description: string;
  datetime: string;
  verificationRemarks?: string;
  verificationStatus?: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  reportedBy: UserRes;
  verifiedBy: UserRes | null;
  mediaUrl?: Media[];
}
