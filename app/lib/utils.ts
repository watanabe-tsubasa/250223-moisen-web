import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { AppLoadContext } from "@remix-run/cloudflare";
import { LoginResponseType } from "./types";

export const callEnv = (context: AppLoadContext) => {
  let env: Env;
  try {
    env = context.cloudflare.env as Env; // Cloudflare Pagesはcontext.cloudflare.env
  } catch {
    env = process.env as unknown as Env; // ローカルはnodeなのでprocess.env
  }
  return env;
};

export const getLoginDataFromCookie = (request: Request<unknown, CfProperties<unknown>>) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookies = Object.fromEntries(
    cookieHeader?.split("; ").map((c) => c.split("=")) || []
  );

  return cookies.user ? JSON.parse(decodeURIComponent(cookies.user)) as LoginResponseType : null;
};

const LINE_API_URL = "https://api.line.me/v2/bot/message/push";

/**
 * Cloudflare Workers 上で動作する `pushMessage` API
 */
export async function sendLineNotification(env: Env, userId: string, message: string) {
  const accessToken = env.LINE_ACCESS_TOKEN; // Cloudflare Workers の環境変数
  console.log(userId);
  console.log(accessToken);
  if (!accessToken) {
    throw new Error("LINE_ACCESS_TOKEN が設定されていません");
  }

  const response = await fetch(LINE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      to: userId,
      messages: [{ type: "text", text: message }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to send LINE message: ${response.status} - ${errorText}`);
  }

  return response.json();
}
