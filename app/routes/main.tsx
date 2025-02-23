import { Link, Outlet } from "@remix-run/react";

export function main () {
  return (
    <div>
      <p>main page</p>
      <Link to="./main/zoom">ミーティング</Link>
      <Outlet />
    </div>
  )
}