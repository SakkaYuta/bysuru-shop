"use client";

export default function ShopError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
        <span className="text-3xl text-red-600">!</span>
      </div>
      <h2 className="text-xl font-bold">エラーが発生しました</h2>
      <p className="mt-2 text-gray-500 text-sm">
        申し訳ございません。問題が発生しました。
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-white text-sm font-medium hover:bg-blue-700 transition cursor-pointer"
      >
        もう一度試す
      </button>
    </div>
  );
}
