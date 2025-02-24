import { useLoaderData } from "@remix-run/react";
import { LoaderFunction, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Prescription } from "~/lib/types";
import { callEnv } from "~/lib/utils";
import { getFinishedPrescriptions } from "~/lib/database";
import { FinishedTable } from "~/components/finished-table/FinishedTable";

type LoaderData = {
  userData: Prescription[];
} | {
  error: string;
}
/**
 * D1 からデータを取得する `loader`
 */
export const loader: LoaderFunction = async ({ context }: LoaderFunctionArgs) => {
  try {
    const env = callEnv(context);
    const db = env.DB; // Cloudflare D1 のデータベース
    const prescriptions = await getFinishedPrescriptions(db);

    return Response.json({ userData: prescriptions }); // Remix の `json` を使用
  } catch (error) {
    return Response.json({ error: "データの取得に失敗しました" }, { status: 500 });
  }
};

export default function End() {
  const data = useLoaderData<LoaderData>(); // 型を明示

  return (
    <div className="h-screen-header p-4">
      <h1 className="text-2xl font-bold">注文確認</h1>
      { "error" in data ? (
        <p className="text-red-500">{data.error}</p>
      ) : (
        <>
          <FinishedTable data={data.userData} />
        </>
      )}
    </div>
  );
}