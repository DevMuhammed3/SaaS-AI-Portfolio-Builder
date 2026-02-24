import type { Meta, StoryObj } from "@storybook/nextjs";
import { within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import Heading from "@/components/custom//heading";

const meta: Meta<typeof Heading> = {
  title: "Custom/Heading",
  component: Heading,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A page header component with navigation buttons and title/description display.",
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      description: "The main heading text",
    },
    description: {
      control: "text",
      description: "The description text below the heading",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Page Title",
    description: "This is a description of the current page content.",
  },
};

export const LongTitle: Story = {
  args: {
    title: "This is a Very Long Page Title That Might Wrap to Multiple Lines",
    description:
      "A longer description that explains more about the page content and what users can expect to find here.",
  },
};

export const ShortContent: Story = {
  args: {
    title: "Settings",
    description: "Manage your preferences.",
  },
};

export const ProjectPage: Story = {
  args: {
    title: "Project Dashboard",
    description: "View and manage all your portfolio projects in one place.",
  },
};

export const Interactive: Story = {
  args: {
    title: "Interactive Example",
    description: "Click the navigation buttons to test functionality.",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test that navigation buttons are present
    const backButton = canvas.getByLabelText("Go back");
    const dashboardButton = canvas.getByLabelText("Dashboard");

    expect(backButton).toBeInTheDocument();
    expect(dashboardButton).toBeInTheDocument();
  },
};
