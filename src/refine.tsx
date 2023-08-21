import ResultView from "./common";
import { DEFAULT_MODELS } from "./hooks/useModel";

const model = DEFAULT_MODELS.find((model) => model.id === "refine");
const toastTitle = "Refine...";

export default function Rewrite() {
  return ResultView(toastTitle, model);
}
