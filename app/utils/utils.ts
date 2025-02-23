import { AppLoadContext } from "@remix-run/cloudflare";

export const callEnv = (context: AppLoadContext) => {
  let env: Env;
  try {
    env = context.cloudflare.env as Env; // Cloudflare Pagesはcontext.cloudflare.env
  } catch {
    env = process.env as unknown as Env; // ローカルはnodeなのでprocess.env
  }
  return env;
};