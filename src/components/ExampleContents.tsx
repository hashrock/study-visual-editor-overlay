import { Button, Card, CheckListItem } from "./ui";

export default function ExampleContents() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* ヒーローセクション */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            革新的なソリューションで
            <br />
            未来を創造する
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            あなたのビジネスを次のレベルへ。最先端のテクノロジーと
            優れたデザインで、成功への道をサポートします。
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="primary">今すぐ始める</Button>
            <Button variant="outline">詳細を見る</Button>
          </div>
        </div>
      </section>

      {/* 特徴セクション（3カラム） */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            主な特徴
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card variant="default">
              <div className="w-12 h-12 bg-blue-600 rounded-lg mb-4 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                高速パフォーマンス
              </h3>
              <p className="text-gray-600">
                最新のテクノロジーを使用して、驚くほど高速なパフォーマンスを実現。
                あなたのワークフローを効率化します。
              </p>
            </Card>
            <Card variant="default">
              <div className="w-12 h-12 bg-green-600 rounded-lg mb-4 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                セキュリティ重視
              </h3>
              <p className="text-gray-600">
                企業レベルのセキュリティで、あなたのデータを保護。
                安心してご利用いただけます。
              </p>
            </Card>
            <Card variant="default">
              <div className="w-12 h-12 bg-purple-600 rounded-lg mb-4 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                カスタマイズ可能
              </h3>
              <p className="text-gray-600">
                あなたのニーズに合わせて自由にカスタマイズ可能。
                柔軟な設定で最適な環境を構築できます。
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 機能セクション（2カラム） */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                あなたのビジネスを
                <br />
                サポートする機能
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                充実した機能セットで、あらゆるニーズに対応します。
                直感的なインターフェースと強力な機能の組み合わせで、
                作業効率を大幅に向上させます。
              </p>
              <ul className="space-y-4">
                <CheckListItem>リアルタイム同期機能</CheckListItem>
                <CheckListItem>包括的な分析ダッシュボード</CheckListItem>
                <CheckListItem>24/7サポート体制</CheckListItem>
                <CheckListItem>モバイルアプリ対応</CheckListItem>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-24 h-24 text-white opacity-80"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 価格セクション（3カラム） */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            シンプルな価格設定
          </h2>
          <p className="text-center text-gray-600 mb-12">
            あなたのニーズに合わせてプランを選択してください
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {/* ベーシックプラン */}
            <Card variant="outlined">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                ベーシック
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">¥2,980</span>
                <span className="text-gray-600">/月</span>
              </div>
              <ul className="space-y-4 mb-8">
                <CheckListItem iconSize="sm">基本的な機能</CheckListItem>
                <CheckListItem iconSize="sm">5プロジェクトまで</CheckListItem>
                <CheckListItem iconSize="sm">メールサポート</CheckListItem>
              </ul>
              <Button variant="outline" fullWidth>
                選択する
              </Button>
            </Card>

            {/* プロプラン */}
            <Card variant="highlighted" hover={false}>
              <div className="bg-yellow-400 text-yellow-900 text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                人気
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">プロ</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">¥9,800</span>
                <span className="text-blue-200">/月</span>
              </div>
              <ul className="space-y-4 mb-8">
                <CheckListItem variant="light" iconSize="sm">
                  全機能へのアクセス
                </CheckListItem>
                <CheckListItem variant="light" iconSize="sm">
                  無制限のプロジェクト
                </CheckListItem>
                <CheckListItem variant="light" iconSize="sm">
                  優先サポート
                </CheckListItem>
                <CheckListItem variant="light" iconSize="sm">
                  高度な分析ツール
                </CheckListItem>
              </ul>
              <Button variant="white" fullWidth>
                選択する
              </Button>
            </Card>

            {/* エンタープライズプラン */}
            <Card variant="outlined">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                エンタープライズ
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  ¥29,800
                </span>
                <span className="text-gray-600">/月</span>
              </div>
              <ul className="space-y-4 mb-8">
                <CheckListItem iconSize="sm">カスタム機能開発</CheckListItem>
                <CheckListItem iconSize="sm">
                  専任アカウントマネージャー
                </CheckListItem>
                <CheckListItem iconSize="sm">24/7専用サポート</CheckListItem>
                <CheckListItem iconSize="sm">SLA保証</CheckListItem>
              </ul>
              <Button variant="outline" fullWidth>
                お問い合わせ
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            今すぐ始めませんか？
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            無料トライアルで、すべての機能を14日間お試しいただけます。
            クレジットカードは不要です。
          </p>
          <Button variant="white" size="lg">
            無料で始める
          </Button>
        </div>
      </section>
    </div>
  );
}
