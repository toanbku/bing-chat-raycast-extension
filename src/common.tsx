import "isomorphic-fetch";
import { getSelectedText, Detail, showToast, Toast } from "@raycast/api";
import { useEffect, useMemo, useState } from "react";
import Ask from "./ask";
import { v4 as uuidv4 } from "uuid";
import { Model } from "./type";
import { DEFAULT_MODEL } from "./hooks/useModel";

export default function ResultView(toastTitle: string, model?: Model) {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");

  async function getResult() {
    const toast = await showToast(Toast.Style.Animated, toastTitle);

    async function getStream() {
      let text = "";
      try {
        text = await getSelectedText();
        setQuestion(text);
        toast.style = Toast.Style.Success;
        toast.title = "Finished";
      } catch (error: any) {
        toast.title = "Error";
        toast.style = Toast.Style.Failure;
        setLoading(false);
        setResponse(
          `⚠️ Raycast was unable to get the selected text. You may try copying the text to a text editor and try again. Error: ${error.message}`
        );
        return;
      }
    }

    getStream();
  }

  useEffect(() => {
    getResult();
  }, []);

  const conversation = useMemo(
    () => ({
      id: uuidv4(),
      chats: [],
      model: model || DEFAULT_MODEL,
      pinned: false,
      updated_at: "",
      created_at: new Date().toISOString(),
      context: null,
    }),
    []
  );

  if (!question) {
    return <Detail isLoading={loading} markdown={response} />;
  }
  return <Ask conversation={conversation} questionData={question} />;
}
