import ResultView from "./common";
import { DEFAULT_MODELS } from "./hooks/useModel";

const toastTitle = "Summarizing...";
const model = DEFAULT_MODELS.find((model) => model.id === "summarize");

export default function Summarize() {
  return ResultView(toastTitle, model);
}
