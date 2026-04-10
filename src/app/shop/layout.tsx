import Link from "next/link";
import {
  Show,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
          <Link href="/shop" className="text-lg font-bold tracking-tight">
            バイスル
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/shop"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              商品一覧
            </Link>
            <Show when="signed-in">
              <Link
                href="/shop/history"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                購入履歴
              </Link>
              <UserButton />
            </Show>
            <Show
              when="signed-out"
              fallback={null}
            >
              <SignInButton mode="modal">
                <button className="rounded-md bg-blue-600 px-3 py-1.5 text-white text-sm font-medium hover:bg-blue-700 transition">
                  ログイン
                </button>
              </SignInButton>
            </Show>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-gray-200 py-6 text-center text-xs text-gray-400">
        &copy; 2026 バイスル &times; 埼玉西武ライオンズ
      </footer>
    </>
  );
}
