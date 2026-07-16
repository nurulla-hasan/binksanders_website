export type AdminBroadcastData = {
  title: string;
  message: string;
  target: string;
};

export type AdminBroadcastPayload = {
  data: AdminBroadcastData;
  image?: Blob;
};

export type CompanyBroadcastPayload = {
  title: string;
  message: string;
} & (
  | { targetType: "global"; companyId?: never }
  | { targetType: "targeted"; companyId: string }
);
