# OSUMOTO

LINEグループ用のbotです。<br>
以下の機能があります。
- 特定の性格を持ったチャットAI

直近3件のチャットを保持して、ChatGPTに投げます。
文頭に「`CHANNEL_BOT_NAME`」をつけてグループで話すと返答します。

- 画像生成AI

Stable Diffusionで画像生成し、返します。
文頭に「`CHANNEL_BOT_NAME`画伯」をつけて、続けてプロンプトを入力します。

<hr>

`.env`に以下の情報を設定してください

```sh
CHANNEL_ACCESS_TOKEN=
CHANNEL_SECRET=
CHANNEL_BOT_NAME=任意（LINEで話しかけるとき、これを冒頭につけることで答えてくれる）
OPENAI_API_KEY=
STABILITY_API_KEY=
PORT=任意
SYSTEM_SETTINGS=任意
```