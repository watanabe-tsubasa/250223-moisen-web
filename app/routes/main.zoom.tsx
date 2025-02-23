import { LoaderFunction, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { callEnv } from "~/utils/utils";
import { createZoomMeeting, getZoomAccessToken } from "~/utils/zoom";

/**
 * Remix の `loader` で Zoom のミーティングを作成
 */
export const loader: LoaderFunction = async ({ context }: LoaderFunctionArgs) => {
  try {
    const env = callEnv(context);
    const token = await getZoomAccessToken(env);
    const meeting = await createZoomMeeting(token);

    return { joinUrl: meeting.joinUrl, startUrl: meeting.startUrl };
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json({ error: 'an unknown error' }, { status: 500 });
  }
};


export function zoom () {
  return (
    <div>zoom</div>
  )
}