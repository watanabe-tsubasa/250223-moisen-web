import { Outlet } from "@remix-run/react";
import { Tabs, TabType } from "~/components/FunctionalComponents";

export default function ApproveDashboard() {
  const tabs: TabType[] = [
    {"label": "配送開始", "to": "/dashboard/main"},
    {"label": "配送終了", "to": "/dashboard/end"},
  ]
  return (
    <div className="h-screen-header p-2 md:p-4 flex flex-1">
      <Tabs tabs={tabs}>
        <div className="">
          <Outlet />
        </div>
      </Tabs>
    </div>
  );
}