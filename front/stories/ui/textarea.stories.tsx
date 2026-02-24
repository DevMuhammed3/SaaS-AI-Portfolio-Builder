import type { Meta, StoryObj } from "@storybook/nextjs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const meta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A textarea component for multi-line text input with custom styling.",
      },
    },
  },
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    disabled: {
      control: "boolean",
      description: "Whether the textarea is disabled",
    },
    rows: {
      control: { type: "number", min: 2, max: 10 },
      description: "Number of visible text lines",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter your message...",
  },
  render: (args) => (
    <div className="w-80 space-y-2">
      <Label htmlFor="message">Message</Label>
      <Textarea id="message" {...args} />
    </div>
  ),
};

export const WithRows: Story = {
  args: {
    placeholder: "Tell us about yourself...",
    rows: 6,
  },
  render: (args) => (
    <div className="w-80 space-y-2">
      <Label htmlFor="bio">Biography</Label>
      <Textarea id="bio" {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    placeholder: "This field is disabled",
    disabled: true,
    value: "This content cannot be edited",
  },
  render: (args) => (
    <div className="w-80 space-y-2">
      <Label htmlFor="readonly">Read-only content</Label>
      <Textarea id="readonly" {...args} />
    </div>
  ),
};

export const ContactForm: Story = {
  render: () => (
    <form className="space-y-4 p-6 border rounded-lg max-w-md">
      <h3 className="text-lg font-semibold">Contact Us</h3>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Textarea
          id="subject"
          placeholder="Brief description of your inquiry"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="details">Details</Label>
        <Textarea
          id="details"
          placeholder="Please provide more details about your request..."
          rows={5}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="feedback">Additional Feedback</Label>
        <Textarea
          id="feedback"
          placeholder="Any other comments or suggestions? (optional)"
          rows={3}
        />
      </div>
    </form>
  ),
};
