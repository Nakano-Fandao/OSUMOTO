import {
  Client,
  WebhookEvent,
  TextMessage,
  MessageAPIResponseBase,
} from '@line/bot-sdk';
import { load } from 'ts-dotenv';
import { ask } from './gpt';

const env = load({
  CHANNEL_ACCESS_TOKEN: String,
  CHANNEL_SECRET: String,
  CHANNEL_BOT_NAME: String,
  PORT: Number,
});

const lineBotConfig = {
  channelAccessToken: env.CHANNEL_ACCESS_TOKEN || '',
  channelSecret: env.CHANNEL_SECRET || '',
};
const channelBotName = env.CHANNEL_BOT_NAME || "BOT";

const lineClient = new Client(lineBotConfig);
const groupMemberMap = new Map<string, string>();

const textEventHandler = async (event: WebhookEvent): Promise<MessageAPIResponseBase | undefined> => {
  if (event.type !== 'message' || event.message.type !== 'text') return;

  const { text } = event.message;
  // 冒頭がbotの名前でなければ、return
  if (!text.startsWith(channelBotName)) return;

  // groupチャットでなければ、return
  if (event.source.type !== 'group') return;
  const { userId, groupId } = event.source;
  if (!userId) return

  // 直前の送信者の名前を抽出
  const senderName = await extractSenderName(userId, groupId);

  // chatGPTに投げる
  let res = await ask(`${senderName}:${text}`)

  // 回答文を加工
  if (new RegExp(`^${channelBotName}[:：]*`).test(res)) {
    res = res.replace(channelBotName, '').substring(1);
  }

  const response: TextMessage = {type: 'text', text: res.trim()};
  await lineClient.replyMessage(event.replyToken, response);
};

/**
 * 送信者の名前を抽出して返す
 * @param userId
 * @param groupId
 * @returns
 */
const extractSenderName = async (userId: string, groupId: string) => {
  if (groupMemberMap.has(groupId)) {
    return groupMemberMap.get(userId);
  }
  groupMemberMap.clear();

  await lineClient
    .getGroupMemberProfile(groupId, userId)
    .then( profile => {
      if (profile) groupMemberMap.set(userId, profile.displayName);
    })
    .catch( err => console.error(err) );

  return groupMemberMap.get(userId);
}

export {
  lineBotConfig,
  textEventHandler
}