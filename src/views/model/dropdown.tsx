import { List } from "@raycast/api";
import { ChangeModelProp } from "../../type";

export const ModelDropdown = (props: ChangeModelProp) => {
  const { models, onModelChange, selectedModel } = props;
  return (
    <List.Dropdown
      tooltip="Select Model"
      defaultValue={selectedModel}
      onChange={(id) => {
        onModelChange(id);
      }}
    >
      {models.map((model) => (
        <List.Dropdown.Item key={model.id} title={model.name} value={model.id} />
      ))}
    </List.Dropdown>
  );
};
