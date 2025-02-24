import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Prescription } from "~/lib/types";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";

/**
 * 完了済みの処方箋テーブルのカラム定義
 */
export const columns: ColumnDef<Prescription>[] = [
  {
    accessorKey: "user_name",
    header: "患者名",
    cell: ({ row }) => <div className="font-medium">{row.getValue("user_name")}</div>,
  },
  {
    accessorKey: "prescription_image_url",
    header: "処方箋",
    cell: ({ row }) => <ImageModalTrigger imageUrl={row.getValue("prescription_image_url")} />,
  },
  {
    accessorKey: "online_guidance_time",
    header: "オンライン服薬指導時間",
    cell: ({ row }) => <div>{row.getValue("online_guidance_time")}</div>,
  },
  {
    accessorKey: "medicine_delivery_time",
    header: "薬の配送時間",
    cell: ({ row }) => <div>{row.getValue("medicine_delivery_time")}</div>,
  },
];

/**
 * 画像モーダルを開くボタンコンポーネント
 */
function ImageModalTrigger({ imageUrl }: { imageUrl: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>確認</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg p-4">
          <button
            onClick={() => setOpen(false)}
            onKeyDown={(e) => e.key === "Enter" && setOpen(false)}
            tabIndex={0}
            className="focus:outline-none"
            aria-label="処方箋画像を閉じる"
          >
            <img src={imageUrl} alt="処方箋" className="max-w-full h-auto rounded-lg" />
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}
