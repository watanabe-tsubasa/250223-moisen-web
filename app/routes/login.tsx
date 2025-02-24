import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { Form, Link, useActionData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "~/components/ui/card";
import { getLoginDataFromCookie } from "~/lib/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const loginData = getLoginDataFromCookie(request);
  // const url = new URL(request.url);
  const redirectTo = "/dashboard/main";

  if (loginData) {
    return redirect(redirectTo);
  }
  return new Response(null, { status: 200 });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const userName = formData.get("userName")?.toString();
  const password = formData.get("password")?.toString();
  // const url = new URL(request.url);
  const redirectTo = "/dashboard/main";

  if (!userName || !password) {
    return new Response(JSON.stringify({ error: "すべてのフィールドを入力してください" }), { status: 400 });
  }

  // **固定のユーザー情報**
  if (userName === "admin" && password === "password") {
    const userData = {
      id: "test",
      lastName: "翼",
      firstName: "渡邊",
      storeCode: "0000",
      storeName: "イオン浦和美園店",
      role: "admin",
    };

    const encodedUserData = encodeURIComponent(JSON.stringify(userData));

    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": `user=${encodedUserData}; HttpOnly; Path=/; SameSite=Strict`,
      },
    });
  }

  return new Response(JSON.stringify({ error: "無効な氏名またはパスワードです" }), { status: 401 });
};

export default function Login() {
  const actionData = useActionData<{ error: string }>();

  return (
    <div className="flex items-center justify-center min-h-screen-header bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-center text-2xl">管理者ログイン</CardTitle>
        </CardHeader>
        <CardContent>
          {actionData?.error && <p className="text-red-500 text-center">{actionData.error}</p>}
          <Form method="post" className="space-y-4">
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                ユーザーネーム
              </label>
              <Input type="text" id="userName" name="userName" required placeholder="admin" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                パスワード
              </label>
              <Input type="password" id="password" name="password" required placeholder="password" />
            </div>
            <Button type="submit" className="w-full">
              ログイン
            </Button>
          </Form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-gray-600">
            アカウントをお持ちでないですか？
            <Link to="/register" className="ml-1 text-blue-600 hover:underline">
              新規登録
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
