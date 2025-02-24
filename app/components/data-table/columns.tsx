import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "~/components/ui/dialog";
import { Prescription } from "~/lib/types";
import { Form, useNavigation } from "@remix-run/react";

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
    cell: ({ row }) => {
      const userId = row.original.user_id;
      const userName = encodeURIComponent(row.original.user_name);
      const queryParams = new URLSearchParams({ userId, userName }).toString();

      return (
        <div className="flex items-center justify-around space-x-2">
          <span>{row.getValue("online_guidance_time")}</span>
          <Button asChild variant="outline" size="sm">
            <a href={`/dashboard/main/zoom?${queryParams}`}>開始</a>
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "medicine_delivery_time",
    header: "薬の配送時間",
    cell: ({ row }) => (
      <DeliveryCompleteButton 
        prescriptionId={row.original.id} 
        userId={row.original.user_id}
        deliveryTime={row.getValue("medicine_delivery_time")}
      />
    ),
  },
];

/**
 * 画像モーダルを開くボタンコンポーネント
 */
const ImageModalTrigger = ({ imageUrl }: { imageUrl: string }) => {
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

/**
 * 配送完了ボタンコンポーネント
 */
const DeliveryCompleteButton = ({
  prescriptionId,
  userId,
  deliveryTime
}: {
  prescriptionId: number;
  userId: string;
  deliveryTime: string;
}) => {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // 🌟 フォーム送信完了時にモーダルを閉じる
  useEffect(() => {
    if (navigation.state === "idle") {
      setOpen(false);
    }
  }, [navigation.state]);

  return (
    <>
      <div className="flex items-center justify-around space-x-2">
        <span>{deliveryTime}</span>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>配送完了</Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <p>「{deliveryTime}」の配送を完了しますか？</p>
          <Form method="post">
            <input type="hidden" name="prescriptionId" value={prescriptionId} />
            <input type="hidden" name="userId" value={userId} />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "処理中..." : "完了"}
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>キャンセル</Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
