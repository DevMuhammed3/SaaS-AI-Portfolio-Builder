import type { Meta, StoryObj } from "@storybook/nextjs";
import { LoadingSpinner } from "@/components/custom/loading-spinner";

const meta: Meta<typeof LoadingSpinner> = {
  title: "Custom/LoadingSpinner",
  component: LoadingSpinner,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "An accessible loading spinner with multiple sizes and customizable labels for screen readers.",
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the spinner",
    },
    label: {
      control: "text",
      description: "Loading message for screen readers",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: "md",
    label: "Loading...",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    label: "Loading content...",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    label: "Loading page...",
  },
};

export const CustomLabel: Story = {
  args: {
    size: "md",
    label: "Saving your changes...",
  },
};

export const InButton: Story = {
  args: {
    size: "sm",
    label: "Submitting form...",
  },
  decorators: [
    (Story) => (
      <button
        className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50"
        disabled
      >
        <Story />
        <span>Submitting...</span>
      </button>
    ),
  ],
};

export const InCard: Story = {
  args: {
    size: "lg",
    label: "Loading dashboard data...",
  },
  decorators: [
    (Story) => (
      <div className="border rounded-lg p-8 w-80 h-40 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Story />
          <p className="text-sm text-muted-foreground">Loading your data...</p>
        </div>
      </div>
    ),
  ],
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center space-x-8">
      <div className="text-center space-y-2">
        <LoadingSpinner size="sm" label="Small spinner" />
        <p className="text-xs text-muted-foreground">Small</p>
      </div>
      <div className="text-center space-y-2">
        <LoadingSpinner size="md" label="Medium spinner" />
        <p className="text-xs text-muted-foreground">Medium</p>
      </div>
      <div className="text-center space-y-2">
        <LoadingSpinner size="lg" label="Large spinner" />
        <p className="text-xs text-muted-foreground">Large</p>
      </div>
    </div>
  ),
};
