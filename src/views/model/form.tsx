import { Action, ActionPanel, Form } from "@raycast/api";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Model, ModelHook } from "../../type";

export const ModelForm = (props: { model?: Model; use: { models: ModelHook }; name?: string }) => {
  const { use } = props;

  const [data, setData] = useState<Model>(
    props?.model ?? {
      id: uuidv4(),
      updated_at: "",
      created_at: new Date().toISOString(),
      name: props?.name ?? "",
      prompt: "",
      pinned: false,
    }
  );

  const [error, setError] = useState<{ name: string; prompt: string; option: string; temperature: string }>({
    name: "",
    prompt: "",
    option: "",
    temperature: "",
  });

  const onSubmit = async (model: Model) => {
    const updatedModel: Model = { ...model, updated_at: new Date().toISOString() };

    if (props.model) {
      use.models.update({ ...updatedModel, id: props.model.id, created_at: props.model.created_at });
    } else {
      use.models.add({ ...updatedModel, id: data.id, created_at: data.created_at });
    }
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Submit" onSubmit={onSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="name"
        title="Name"
        placeholder="Name your model"
        defaultValue={data.name}
        error={error.name.length > 0 ? error.name : undefined}
        onChange={(value) => setData({ ...data, name: value })}
        onBlur={(event) => {
          if (event.target.value?.length == 0) {
            setError({ ...error, name: "Required" });
          } else {
            if (error.name && error.name.length > 0) {
              setError({ ...error, name: "" });
            }
          }
        }}
      />
      <Form.TextArea
        id="prompt"
        title="Prompt"
        placeholder="Describe your prompt"
        defaultValue={data.prompt}
        error={error.prompt.length > 0 ? error.prompt : undefined}
        onChange={(value) => setData({ ...data, prompt: value })}
        onBlur={(event) => {
          if (event.target.value?.length == 0) {
            setError({ ...error, prompt: "Required" });
          } else {
            if (error.prompt && error.prompt.length > 0) {
              setError({ ...error, prompt: "" });
            }
          }
        }}
      />

      {data.id !== "default" && (
        <Form.Checkbox
          id="pinned"
          title="Pinned"
          label="Pin model"
          defaultValue={data.pinned}
          onChange={(value) => setData({ ...data, pinned: value })}
        />
      )}
    </Form>
  );
};
