# SBI証券 日付範囲ボタンアドオン
Firefox用のアドオンで、SBI証券の配当金・分配金履歴ページと損益計算ページに「直近1年」と「全期間」ボタンを追加します。

## 機能

- SBI証券の以下のページにアクセスした際に動作:
  - 配当金・分配金履歴ページ（`https://site.sbisec.co.jp/account/assets/dividends`）
  - 損益計算ページ（`https://site.sbisec.co.jp/account/assets/profits`）
- 「今年」ボタンの横に「直近1年」と「全期間」ボタンを追加
- 「直近1年」ボタンをクリックすると、終了日から1年前の日付を開始日に自動設定
- 「全期間」ボタンをクリックすると、開始日の日付入力フィールドに「2021/08/01」を自動入力
- 他の期間ボタン（今日、今週、今月、今年）との排他制御
- ページタイプを自動判別し、適切なURLパターンでリダイレクト

## インストール方法

### Firefoxでの開発者モードインストール

1. Firefoxを開き、`about:debugging` にアクセス
2. 「このFirefox」をクリック
3. 「一時的なアドオンを読み込む」をクリック
4. `addon` フォルダ内の `manifest.json` ファイルを選択

### パッケージングしてインストール

1. `addon` フォルダをZIP圧縮
2. Firefoxのアドオンマネージャーで「アドオンをインストール」からZIPファイルを選択

## ファイル構成

```
addon/
├── content.js      # メインのスクリプト
├── manifest.json   # アドオン設定
└── icon48.png      # アイコン
```

## 動作確認方法

1. SBI証券の実際のページにアクセスして動作確認:
   - 配当金・分配金履歴ページ: `https://site.sbisec.co.jp/account/assets/dividends`
   - 損益計算ページ: `https://site.sbisec.co.jp/account/assets/profits`

## 技術仕様

- **対象ページ**:
  - `https://site.sbisec.co.jp/account/assets/dividends*`
  - `https://site.sbisec.co.jp/account/assets/profits*`
- **動作タイミング**: DOMContentLoaded + MutationObserverによる動的コンテンツ対応
- **変更内容**:
  - 「今年」ボタンの横に「直近1年」と「全期間」ボタンを追加
  - 「直近1年」ボタン: 終了日から1年前の日付を計算して開始日に設定
  - 「全期間」ボタン: 開始日を「2021/08/01」に設定
  - ページタイプに応じたURLパターンでリダイレクト:
    - 配当金ページ: `https://site.sbisec.co.jp/account/assets/dividends?dispositionDateFrom=<開始日>&dispositionDateTo=<終了日>`
    - 損益計算ページ: `https://site.sbisec.co.jp/account/assets/profits?baseDateType=CONTRACT&baseDateFrom=<開始日>&baseDateTo=<終了日>&product=ALL`

## 注意事項

- このアドオンはSBI証券のWebサイトの構造に依存しています。サイトのデザイン変更により動作しなくなる可能性があります。
- 開発者モードでのインストールは一時的なもので、Firefoxを再起動すると無効になります。
- 本番環境での使用は自己責任でお願いします。

## ライセンス

MIT License