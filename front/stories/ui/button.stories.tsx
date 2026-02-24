import type { Meta, StoryObj } from "@storybook/nextjs";
import { Button } from "@/components/ui/button";
import { ChevronRight, Download, Heart, Plus } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: [
        "default",
        "success",
        "primary",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
    },
    size: {
      control: { type: "select" },
      options: ["default", "sm", "lg", "icon"],
    },
    asChild: {
      control: { type: "boolean" },
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Button",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="success">Success</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button>
        <Download className="h-4 w-4" />
        Download
      </Button>
      <Button variant="outline">
        Continue
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon">
        <Heart className="h-4 w-4" />
      </Button>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button>Normal</Button>
      <Button disabled>Disabled</Button>
      <Button disabled>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        Loading...
      </Button>
    </div>
  ),
};

export const CallToAction: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-md">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Primary Actions</h3>
        <div className="flex gap-2">
          <Button variant="primary" size="lg">
            Get Started
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Form Actions</h3>
        <div className="flex gap-2">
          <Button variant="success">Save Changes</Button>
          <Button variant="destructive">Delete</Button>
          <Button variant="ghost">Cancel</Button>
        </div>
      </div>
    </div>
  ),
};

export const AsChild: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button asChild>
        <a href="#" className="no-underline">
          Link Button
        </a>
      </Button>
      <Button variant="outline" asChild>
        <a href="#" className="no-underline">
          <Download className="h-4 w-4" />
          Download Link
        </a>
      </Button>
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    children: "Click me",
    onClick: () => alert("Button clicked!"),
  },
};
