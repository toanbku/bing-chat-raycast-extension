import { Action, ActionPanel, Icon, openExtensionPreferences } from "@raycast/api";

export const PreferencesActionSection = () => (
  <ActionPanel.Section title="Preferences">
    <Action
      icon={Icon.Gear}
      title="Open Extension Preferences"
      onAction={openExtensionPreferences}
      shortcut={{ modifiers: ["cmd", "shift"], key: "p" }}
    />
  </ActionPanel.Section>
);
