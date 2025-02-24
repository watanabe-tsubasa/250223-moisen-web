import { Outlet, useNavigate, useLocation, useLoaderData } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunction, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { DataTable } from "~/components/data-table/DataTable";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { Prescription } from "~/lib/types";
import { callEnv, sendLineNotification } from "~/lib/utils";
import { completeDelivery, getPrescriptions } from "~/lib/database";

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
    const prescriptions = await getPrescriptions(db);

    return Response.json({ userData: prescriptions }); // Remix の `json` を使用
  } catch (error) {
    return Response.json({ error: "データの取得に失敗しました" }, { status: 500 });
  }
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const prescriptionId = formData.get("prescriptionId");
  const userId = formData.get("userId") as string;
  const env = callEnv(context);

  if (!prescriptionId) {
    return new Response("処方箋 ID がありません", { status: 400 });
  }
  if (!userId) {
    return new Response("ユーザー ID がありません", { status: 400 });
  }

  const db = env.DB;
  await completeDelivery(db, Number(prescriptionId));
  await sendLineNotification(env, userId, 'お薬が配送されました')

  return null;
};

export default function Main() {
  const data = useLoaderData<LoaderData>(); // 型を明示
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="h-screen-header p-4">
      <h1 className="text-2xl font-bold">注文処理</h1>
      { "error" in data ? (
        <p className="text-red-500">{data.error}</p>
      ) : (
        <>
          <DataTable data={data.userData} />
        </>
      )}

      {/* `/dashboard/main/zoom` のときだけモーダルを開く */}
      {location.pathname === "/dashboard/main/zoom" && (
        <Dialog open={true} onOpenChange={() => navigate("/dashboard/main")}>
          <DialogContent>
            <Outlet />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}