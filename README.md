# OSUMOTO

LINEグループ用のbotです。<br>
直近3件のチャットを保持して、ChatGPTに投げます。

`.env`に以下の情報を設定してください

```sh
CHANNEL_ACCESS_TOKEN=
CHANNEL_SECRET=
CHANNEL_BOT_NAME=任意（LINEで話しかけるとき、これを冒頭につけることで答えてくれる）
OPENAI_API_KEY=
PORT=任意
SYSTEM_SETTINGS=任意
```