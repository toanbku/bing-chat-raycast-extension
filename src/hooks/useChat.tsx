import { clearSearchBar, showToast, Toast } from "@raycast/api";
import { useCallback, useMemo, useState } from "react";
import say from "say";
import { v4 as uuidv4 } from "uuid";
import { Chat, ChatHook, Model } from "../type";
import { useAutoTTS } from "./useAutoTTS";
import { useBingChat, configuration } from "./useBingChat";
import { useHistory } from "./useHistory";
import { ChatMessage } from "bing-chat";

export function useChat<T extends Chat>(props: T[], ctx: ChatMessage | null): ChatHook {
  const [data, setData] = useState<Chat[]>(props);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [context, setContext] = useState<ChatMessage | null>(ctx);
  const [isLoading, setLoading] = useState<boolean>(false);

  const history = useHistory();
  const isAutoTTS = useAutoTTS();

  const chatGPT = useBingChat();

  async function ask(question: string, model: Model) {
    setLoading(true);
    const toast = await showToast({
      title: "Getting your answer...",
      style: Toast.Style.Animated,
    });

    let chat: Chat = {
      id: uuidv4(),
      question,
      answer: "",
      created_at: new Date().toISOString(),
    };

    setData((prev) => {
      return [...prev, chat];
    });

    setTimeout(async () => {
      setSelectedChatId(chat.id);
    }, 30);

    try {
      const ans = await chatGPT.sendMessage(context ? question : `${model.prompt}\n${question}`, {
        ...context,
        onProgress: (partialResponse) => {
          chat.answer = partialResponse.text;

          // FIXME: improve perf here
          setData((prev) => {
            return prev.map((a) => {
              if (a.id === chat.id) {
                return chat;
              }
              return a;
            });
          });
        },
        variant: configuration.conversationStyle,
      });

      if (!ans.text) {
        ans.text =
          "⚠️ There was an error getting response. \n Try to start another conversation or update your Bing cookie (Cmd + Shift + P) \n\n [Document for how to get Bing Cookie](https://github.com/toanbku/bing-chat-raycast-extension#how-to-use)";
      }

      ans.text = ans.text.replaceAll(/\[\^(\d+)\^\]/g, "");

      chat = { ...chat, answer: ans.text };

      toast.title = "Got your answer!";
      toast.style = Toast.Style.Success;
      if (isAutoTTS) {
        say.stop();
        say.speak(chat.answer);
      }
      setContext(ans);
    } catch (err) {
      toast.title = "Error";
      if (err instanceof Error) {
        chat = {
          ...chat,
          answer:
            "⚠️ Cookie expired. Please update your Bing cookies using hotkey Cmd + Shift + P \n\n [Document for how to get Bing Cookie](https://github.com/toanbku/bing-chat-raycast-extension#how-to-use)",
        };
        toast.message = err.message;
      }
      toast.style = Toast.Style.Failure;
    } finally {
      setLoading(false);
      clearSearchBar();
      setData((prev) => {
        return prev.map((a) => {
          if (a.id === chat.id) {
            return chat;
          }
          return a;
        });
      });
      history.add(chat);
    }
  }

  const clear = useCallback(async () => {
    setData([]);
  }, [setData]);

  return useMemo(
    () => ({ data, context, setData, isLoading, setLoading, selectedChatId, setSelectedChatId, ask, clear }),
    [data, setData, isLoading, setLoading, selectedChatId, setSelectedChatId, ask, clear]
  );
}
