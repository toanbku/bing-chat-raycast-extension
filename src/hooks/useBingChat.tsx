import "isomorphic-fetch";
import { getPreferenceValues } from "@raycast/api";
import { BingChat } from "bing-chat";

export const configuration = {
  apiKey: getPreferenceValues().api,
  conversationStyle: getPreferenceValues().conversationStyle,
};

export function useBingChat() {
  const apiKey = getPreferenceValues().api;

  const bingChat = new BingChat({
    cookie: apiKey,
  });

  return bingChat;
}
