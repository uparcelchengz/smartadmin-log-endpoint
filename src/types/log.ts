export interface WebhookLog {
  _id?: string;
  timestamp: Date;
  method: string;
  headers: Record<string, string>;
  body: any;
  query: Record<string, string>;
  ip?: string;
  userAgent?: string;
}
