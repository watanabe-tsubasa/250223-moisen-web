import type { MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [
    { title: "お薬調剤即日便" },
    { name: "description", content: "LINEからメッセージがきて対応しないといけないやつ" },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen-header items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
            Welcome to <span className="sr-only">Remix</span>
          </h1>
          <div className="h-[144px] w-[434px]">
            <img
              src="/title-okusuri.png"
              alt="Remix"
              className="block w-full dark:hidden"
            />
            <img
              src="/logo-dark.png"
              alt="Remix"
              className="hidden w-full dark:block"
            />
          </div>
        </header>
        <Link to="./login">
          <Button variant="secondary">ログインして始める</Button>
        </Link>
      </div>
    </div>
  );
}
