import { LocalStorage, showToast, Toast } from "@raycast/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Model, ModelHook } from "../type";

export const DEFAULT_MODELS: Model[] = [
  {
    id: "default",
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    name: "Default",
    prompt: "",
    pinned: false,
  },
  {
    id: "summarize",
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    name: "Summarize",
    prompt: "Summarize the following text using native language of input text: ",
    pinned: false,
  },
  {
    id: "rephrase",
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    name: "Rephrase",
    prompt: "Rephrase this using an academic tone:",
    pinned: false,
  },
  {
    id: "refine",
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    name: "Refine",
    prompt: "Refine the writing and correct grammar mistakes:",
    pinned: false,
  },
];

export const DEFAULT_MODEL = DEFAULT_MODELS[0];

export function useModel(): ModelHook {
  const [data, setData] = useState<Model[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const storedModels = await LocalStorage.getItem<string>("models");

      if (storedModels?.length) {
        setData((previous) => [...previous, ...JSON.parse(storedModels)]);
      } else {
        setData(DEFAULT_MODELS);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    LocalStorage.setItem("models", JSON.stringify(data));
  }, [data]);

  const add = useCallback(
    async (model: Model) => {
      const toast = await showToast({
        title: "Saving your model...",
        style: Toast.Style.Animated,
      });
      const newModel: Model = { ...model, created_at: new Date().toISOString() };
      setData([...data, newModel]);
      toast.title = "Model saved!";
      toast.style = Toast.Style.Success;
    },
    [setData, data]
  );

  const update = useCallback(
    async (model: Model) => {
      setData((prev) => {
        return prev.map((x) => {
          if (x.id === model.id) {
            return model;
          }
          return x;
        });
      });
    },
    [setData, data]
  );

  const remove = useCallback(
    async (model: Model) => {
      const toast = await showToast({
        title: "Remove your model...",
        style: Toast.Style.Animated,
      });
      const newModels: Model[] = data.filter((oldModel) => oldModel.id !== model.id);
      setData(newModels);
      toast.title = "Model removed!";
      toast.style = Toast.Style.Success;
    },
    [setData, data]
  );

  const clear = useCallback(async () => {
    const toast = await showToast({
      title: "Clearing your models ...",
      style: Toast.Style.Animated,
    });
    toast.title = "Models cleared!";
    toast.style = Toast.Style.Success;
  }, [setData]);

  return useMemo(
    () => ({ data, isLoading, add, update, remove, clear }),
    [data, isLoading, add, update, remove, clear]
  );
}
