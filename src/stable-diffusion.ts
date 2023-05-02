import fs from 'node:fs'
import path from 'path';
import fetch from 'node-fetch'
import { load } from 'ts-dotenv';
import { uploadImage } from './google';

const env = load({
  STABILITY_API_KEY: String,
});
const stablityApiKey = env.STABILITY_API_KEY || "";
const engineId = 'stable-diffusion-v1-5'

export const generateArt = async (prompt: string) => {
  const response = await fetch(
    `https://api.stability.ai/v1/generation/${engineId}/text-to-image`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${stablityApiKey}`,
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: prompt,
            weight: 0.5,
          },
          {
            text: "lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts,signature, watermark, username, blurry, artist name",
            weight: -0.9,
          },
        ],
        cfg_scale: 7,
        height: 512,
        width: 512,
        samples: 1,
        steps: 30,
      }),
    }
  )

  if (!response.ok) {
    throw new Error(`Non-200 response: ${await response.text()}`)
  }

  interface GenerationResponse {
    artifacts: Array<{
      base64: string
      seed: number
      finishReason: string
    }>
  }

  const responseJSON = (await response.json()) as GenerationResponse
  const imageUrl = await uploadImage(prompt.substring(0, 10), responseJSON.artifacts[0].base64)
  return imageUrl;
}

export const checkGenerateArt = async (prompt: string) => {
  const content = fs.readFileSync(path.join(__dirname, '../public/images/sample.png'))
  const imageUrl = await uploadImage(prompt.substring(0, 10), content.toString('base64'))
  return imageUrl;
}