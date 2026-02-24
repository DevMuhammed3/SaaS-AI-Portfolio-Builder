import type { Meta, StoryObj } from "@storybook/nextjs";
import Container from "@/components/custom/container";

const meta: Meta<typeof Container> = {
  title: "Custom/Container", // appears in Storybook sidebar
  component: Container,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A flexible container component that provides responsive layout with optional fluid width and customizable HTML element type.",
      },
    },
  },
  argTypes: {
    children: {
      control: "text",
      description: "Content to be rendered inside the container",
    },
    fluid: {
      control: "boolean",
      description:
        "Whether the container should take full width or be constrained to max-w-6xl",
    },
    as: {
      control: "select",
      options: [
        "div",
        "section",
        "main",
        "article",
        "aside",
        "header",
        "footer",
      ],
      description: "HTML element type to render as",
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply",
    },
  },
  args: {
    children: "Container content goes here",
    fluid: false,
    as: "div",
  },
};

export default meta;
type Story = StoryObj<typeof Container>;

// Default Container story
export const Default: Story = {
  args: {
    children: (
      <div className="bg-blue-100 p-4 text-center border-red-500">
        This is a default Container
      </div>
    ),
  },
};

// Fluid Container story
export const Fluid: Story = {
  args: {
    fluid: true,
    children: (
      <div className="bg-green-500 p-4 text-center border-red-500">
        This is a fluid Container
      </div>
    ),
  },
};

// Custom element story
export const SectionAsDiv: Story = {
  args: {
    as: "section",
    children: (
      <div className="bg-purple-100 p-4 text-center">
        This Container renders as a section
      </div>
    ),
  },
};
