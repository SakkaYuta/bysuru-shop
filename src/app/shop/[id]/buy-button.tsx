"use client";

import { useUser, SignInButton } from "@clerk/nextjs";
import { useState } from "react";

export function BuyButton({
  productId,
  inStock,
  maxQuantity,
}: {
  productId: string;
  inStock: boolean;
  maxQuantity: number;
}) {
  const { isSignedIn, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (!isLoaded) {
    return (
      <button
        disabled
        className="w-full rounded-lg bg-gray-200 py-3 text-gray-400 font-bold"
      >
        読み込み中...
      </button>
    );
  }

  if (!inStock) {
    return (
      <button
        disabled
        className="w-full rounded-lg bg-gray-200 py-3 text-gray-400 font-bold cursor-not-allowed"
      >
        売り切れ
      </button>
    );
  }

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <button className="w-full rounded-lg bg-blue-600 py-3 text-white font-bold hover:bg-blue-700 transition cursor-pointer">
          ログインして購入する
        </button>
      </SignInButton>
    );
  }

  const handleBuy = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "エラーが発生しました。");
      }
    } catch (err) {
      console.error("[BuyButton]", err);
      alert("エラーが発生しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  const max = Math.min(maxQuantity, 10);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">数量</label>
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition cursor-pointer"
          >
            -
          </button>
          <span className="px-4 py-2 text-center font-bold min-w-[3rem] border-x border-gray-300">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(max, q + 1))}
            disabled={quantity >= max}
            className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition cursor-pointer"
          >
            +
          </button>
        </div>
        <span className="text-xs text-gray-400">最大{max}枚</span>
      </div>
      <button
        onClick={handleBuy}
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 py-3 text-white font-bold hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
      >
        {loading ? "処理中..." : `購入する（${quantity}枚）`}
      </button>
    </div>
  );
}
