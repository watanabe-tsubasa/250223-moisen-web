import { ZoomAccessTokenResponse, ZoomMeetingResponse } from "./types";

const ZOOM_AUTH_URL = "https://zoom.us/oauth/token";
const ZOOM_MEETING_URL = "https://api.zoom.us/v2/users/me/meetings";

/**
 * Zoom APIのアクセストークンを取得
 */
export const getZoomAccessToken = async (env: Env): Promise<string> => {
  const clientId = env.ZOOM_CLIENT_ID;
  const clientSecret = env.ZOOM_CLIENT_SECRET;
  const accountId = env.ZOOM_ACCOUNT_ID;

  if (!clientId || !clientSecret || !accountId) {
    throw new Error("Zoom Client ID, Client Secret, or Account ID is missing.");
  }

  const credentials = btoa(`${clientId}:${clientSecret}`);

  const response = await fetch(`${ZOOM_AUTH_URL}?grant_type=account_credentials&account_id=${accountId}`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get Zoom access token: ${response.status} - ${errorText}`);
  }

  const data: ZoomAccessTokenResponse = await response.json();
  return data.access_token;
}

/**
 * Zoom会議を作成する関数
 */
export const createZoomMeeting = async (accessToken: string) => {
  const response = await fetch(ZOOM_MEETING_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      topic: "Remix + Zoom API Meeting",
      type: 2,
      start_time: new Date().toISOString(),
      duration: 30,
      timezone: "Asia/Tokyo",
      settings: {
        host_video: true,
        participant_video: true,
        waiting_room: false,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create Zoom meeting: ${response.status} - ${errorText}`);
  }

  const data: ZoomMeetingResponse = await response.json();
  return { joinUrl: data.join_url, startUrl: data.start_url };
}

