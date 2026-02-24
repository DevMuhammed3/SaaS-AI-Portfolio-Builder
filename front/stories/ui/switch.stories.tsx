import type { Meta, StoryObj } from "@storybook/nextjs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const meta: Meta<typeof Switch> = {
  title: "UI/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A switch component built on Radix UI for toggling between two states.",
      },
    },
  },
  argTypes: {
    checked: {
      control: "boolean",
      description: "The checked state of the switch",
    },
    disabled: {
      control: "boolean",
      description: "Whether the switch is disabled",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "default-switch",
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Switch {...args} />
      <Label htmlFor="default-switch">Enable notifications</Label>
    </div>
  ),
};

export const Checked: Story = {
  args: {
    id: "checked-switch",
    checked: true,
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Switch {...args} />
      <Label htmlFor="checked-switch">Dark mode enabled</Label>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    id: "disabled-switch",
    disabled: true,
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Switch {...args} />
      <Label htmlFor="disabled-switch">Feature unavailable</Label>
    </div>
  ),
};

export const CheckedDisabled: Story = {
  args: {
    id: "checked-disabled-switch",
    checked: true,
    disabled: true,
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Switch {...args} />
      <Label htmlFor="checked-disabled-switch">Always enabled</Label>
    </div>
  ),
};

export const SettingsPanel: Story = {
  render: () => (
    <div className="space-y-6 p-6 border rounded-lg max-w-md">
      <h3 className="text-lg font-semibold">Privacy Settings</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="profile-visibility">Public Profile</Label>
            <p className="text-sm text-muted-foreground">
              Make your profile visible to other users
            </p>
          </div>
          <Switch id="profile-visibility" />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive updates via email
            </p>
          </div>
          <Switch id="email-notifications" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="analytics">Analytics</Label>
            <p className="text-sm text-muted-foreground">
              Help improve our service with usage data
            </p>
          </div>
          <Switch id="analytics" />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="two-factor">Two-Factor Authentication</Label>
            <p className="text-sm text-muted-foreground">
              Enhanced security for your account
            </p>
          </div>
          <Switch id="two-factor" defaultChecked disabled />
        </div>
      </div>
    </div>
  ),
};

export const CompactList: Story = {
  render: () => (
    <div className="space-y-3 p-4 border rounded-lg max-w-xs">
      <h4 className="font-medium">Quick Settings</h4>

      {[
        { id: "wifi", label: "Wi-Fi", checked: true },
        { id: "bluetooth", label: "Bluetooth", checked: false },
        { id: "location", label: "Location", checked: true },
        { id: "airplane", label: "Airplane Mode", checked: false },
      ].map((setting) => (
        <div key={setting.id} className="flex items-center justify-between">
          <Label htmlFor={setting.id} className="text-sm">
            {setting.label}
          </Label>
          <Switch id={setting.id} defaultChecked={setting.checked} />
        </div>
      ))}
    </div>
  ),
};
