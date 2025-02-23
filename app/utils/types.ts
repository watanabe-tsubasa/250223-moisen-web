// zoom OAuth token API
export interface ZoomAccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}
 
// zoom create meeting API
export interface ZoomMeetingResponse {
  id: number;
  join_url: string;
  start_url: string;
  topic: string;
  type: number;
  start_time: string;
  duration: number;
  timezone: string;
}
