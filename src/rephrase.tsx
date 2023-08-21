import ResultView from "./common";
import { DEFAULT_MODELS } from "./hooks/useModel";

const model = DEFAULT_MODELS.find((model) => model.id === "rephrase");
const toastTitle = "Rephrase...";

export default function Rewrite() {
  return ResultView(toastTitle, model);
}
