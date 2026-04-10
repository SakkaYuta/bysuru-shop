export type Product = {
  id: string;
  name: string;
  category: "suite" | "ground";
  categoryLabel: string;
  description: string;
  features: string[];
  capacity: string;
  price: number; // JPY
  points: number;
  stock: number;
  image: string;
};

export const products: Product[] = [
  // スイートルーム観戦
  {
    id: "suiteroom-1950",
    name: 'スイートルーム「1950」',
    category: "suite",
    categoryLabel: "スイートルーム観戦",
    description: "最上位スイート（3室限定）。お食事付き（Premium plan）で最高の観戦体験を。",
    features: [
      "最上位スイート（3室限定）",
      "お食事付き（Premium plan）",
      "専用ラウンジ利用可",
    ],
    capacity: "4名さま",
    price: 675000,
    points: 675000,
    stock: 4,
    image: "/images/suite-1950.jpg",
  },
  {
    id: "suiteroom-1979",
    name: 'スイートルーム「1979」',
    category: "suite",
    categoryLabel: "スイートルーム観戦",
    description: "最上位スイート（3室限定）。最大6名で贅沢な観戦を。",
    features: [
      "最上位スイート（3室限定）",
      "お食事付き（Premium plan）",
      "最大6名まで利用可能",
    ],
    capacity: "最大6名さま",
    price: 675000,
    points: 675000,
    stock: 6,
    image: "/images/suite-1979.jpg",
  },
  {
    id: "suiteroom-2019",
    name: 'スイートルーム「2019」',
    category: "suite",
    categoryLabel: "スイートルーム観戦",
    description: "最新のスイートルーム。最大8名で最新設備の空間をお楽しみください。",
    features: [
      "最新のスイートルーム",
      "お食事付き（Premium plan）",
      "最大8名まで利用可能",
    ],
    capacity: "最大8名さま",
    price: 697500,
    points: 697500,
    stock: 8,
    image: "/images/suite-2019.jpg",
  },
  // グラウンド内イベント
  {
    id: "ground-practice",
    name: "練習見学会",
    category: "ground",
    categoryLabel: "グラウンド内イベント",
    description: "打撃練習を間近で見学。試合開始3時間〜2時間半前の約30分間。",
    features: [
      "打撃練習を間近で見学",
      "試合開始3時間〜2時間半前",
      "約30分間のプログラム",
    ],
    capacity: "最大50名",
    price: 99000,
    points: 99000,
    stock: 50,
    image: "/images/ground-practice.jpg",
  },
  {
    id: "ground-family",
    name: "親子ベースランニング",
    category: "ground",
    categoryLabel: "グラウンド内イベント",
    description: "試合前のグラウンドで親子ラン。かけがえのない思い出を。",
    features: [
      "試合前のグラウンドで親子ラン",
      "お子さまと一緒に特別体験",
      "記念写真撮影あり",
    ],
    capacity: "最大8名",
    price: 620000,
    points: 620000,
    stock: 8,
    image: "/images/ground-family.jpg",
  },
  {
    id: "ground-kids",
    name: "スターティングキッズ",
    category: "ground",
    categoryLabel: "グラウンド内イベント",
    description: "スタメン選手からボールをプレゼント。5歳以上〜中学生以下のお子さま限定。",
    features: [
      "スタメン選手からボールをプレゼント",
      "5歳以上かつ中学生以下限定",
      "自走可能なお子さま対象",
    ],
    capacity: "18名",
    price: 275000,
    points: 275000,
    stock: 18,
    image: "/images/ground-kids.jpg",
  },
  {
    id: "ground-balloon",
    name: "ラッキーセブン応援隊",
    category: "ground",
    categoryLabel: "グラウンド内イベント",
    description: "7回にフィールドでジェット風船を飛ばそう！",
    features: [
      "7回にフィールドでジェット風船",
      "最大50名参加可能",
      "球場一体の応援体験",
    ],
    capacity: "最大50名",
    price: 99000,
    points: 99000,
    stock: 50,
    image: "/images/ground-balloon.jpg",
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory() {
  const suites = products.filter((p) => p.category === "suite");
  const grounds = products.filter((p) => p.category === "ground");
  return { suites, grounds };
}
