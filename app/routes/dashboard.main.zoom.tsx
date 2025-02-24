import { LoaderFunction, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, useNavigate } from "@remix-run/react";

import { createZoomMeeting, getZoomAccessToken } from "~/lib/zoom";
import { Button } from "~/components/ui/button";
import { callEnv, sendLineNotification } from "~/lib/utils";

/**
 * `loader` の戻り値の型定義
 */
type LoaderData = {
  joinUrl: string;
  startUrl: string;
} | {
  error: string;
};

/**
 * Remix の `loader` で Zoom のミーティングを作成
 */
export const loader: LoaderFunction = async ({ context, request }: LoaderFunctionArgs) => {
  try {
    const env = callEnv(context); // 🌟 Cloudflare Workers の環境変数取得
    const url = new URL(request.url);
    const lineUserId = url.searchParams.get("userId"); // LINE ユーザー ID を取得

    const token = await getZoomAccessToken(env);
    const meeting = await createZoomMeeting(token);

    // **LINE に通知**
    if (lineUserId) {
      const res = await sendLineNotification(env, lineUserId, `オンライン服薬指導を開始します。\n10分以内に参加してください。\n参加リンク: ${meeting.joinUrl}`);
      console.log(res)
    }

    return new Response(JSON.stringify({ joinUrl: meeting.joinUrl, startUrl: meeting.startUrl }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "An unknown error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

/**
 * Zoom ミーティングのモーダル
 */
export default function ZoomMeetingPage() {
  const data = useLoaderData<LoaderData>(); // 🌟 型を明示
  const navigate = useNavigate();

  return (
    <div>
      <h1>オンライン服薬指導</h1>
      {"error" in data ? ( // 🌟 型ガードを使用
        <p>エラー: {data.error}</p>
      ) : (
        <>
          <Button onClick={() => window.open(data.startUrl, "_blank", "noopener,noreferrer")}>
            Zoom を開く
          </Button>
          {/* <p>
            <a href={data.joinUrl} target="_blank" rel="noopener noreferrer">
              参加用 URL
            </a>
          </p> */}
        </>
      )}
      <Button variant="secondary" onClick={() => navigate("/dashboard/main")}>閉じる</Button>
    </div>
  );
}
