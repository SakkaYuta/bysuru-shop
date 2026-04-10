const requests = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60_000; // 1分
const MAX_REQUESTS = 10; // 1分あたり最大10リクエスト

export function rateLimit(key: string): { success: boolean } {
  const now = Date.now();
  const entry = requests.get(key);

  if (!entry || now >= entry.resetAt) {
    requests.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { success: true };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { success: false };
  }

  entry.count++;
  return { success: true };
}

// 古いエントリを定期クリーンアップ（メモリリーク防止）
if (typeof globalThis !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of requests) {
      if (now > entry.resetAt) requests.delete(key);
    }
  }, WINDOW_MS * 2);
}
