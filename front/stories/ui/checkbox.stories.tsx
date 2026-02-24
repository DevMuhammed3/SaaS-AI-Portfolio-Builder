import type { Meta, StoryObj } from "@storybook/nextjs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const meta: Meta<typeof Checkbox> = {
  title: "UI/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A checkbox component built on Radix UI with custom styling and accessibility features.",
      },
    },
  },
  argTypes: {
    checked: {
      control: "boolean",
      description: "The checked state of the checkbox",
    },
    disabled: {
      control: "boolean",
      description: "Whether the checkbox is disabled",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "default-checkbox",
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} />
      <Label htmlFor="default-checkbox">Accept terms and conditions</Label>
    </div>
  ),
};

export const Checked: Story = {
  args: {
    id: "checked-checkbox",
    checked: true,
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} />
      <Label htmlFor="checked-checkbox">Newsletter subscription</Label>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    id: "disabled-checkbox",
    disabled: true,
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} />
      <Label htmlFor="disabled-checkbox">Disabled option</Label>
    </div>
  ),
};

export const CheckedDisabled: Story = {
  args: {
    id: "checked-disabled-checkbox",
    checked: true,
    disabled: true,
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} />
      <Label htmlFor="checked-disabled-checkbox">Pre-selected (disabled)</Label>
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <form className="space-y-4 p-6 border rounded-lg max-w-md">
      <h3 className="text-lg font-semibold">Preferences</h3>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox id="notifications" />
          <Label htmlFor="notifications">Email notifications</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="marketing" />
          <Label htmlFor="marketing">Marketing emails</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="updates" defaultChecked />
          <Label htmlFor="updates">Product updates</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="security" defaultChecked disabled />
          <Label htmlFor="security">Security alerts (required)</Label>
        </div>
      </div>
    </form>
  ),
};

export const CheckboxList: Story = {
  render: () => (
    <div className="space-y-4 p-6 border rounded-lg max-w-sm">
      <h3 className="text-lg font-semibold">Skills</h3>
      <div className="grid grid-cols-2 gap-3">
        {[
          "JavaScript",
          "TypeScript",
          "React",
          "Node.js",
          "Python",
          "Design",
        ].map((skill) => (
          <div key={skill} className="flex items-center space-x-2">
            <Checkbox id={skill.toLowerCase()} />
            <Label htmlFor={skill.toLowerCase()} className="text-sm">
              {skill}
            </Label>
          </div>
        ))}
      </div>
    </div>
  ),
};
