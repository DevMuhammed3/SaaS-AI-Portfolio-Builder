import type { Meta, StoryObj } from "@storybook/nextjs";
import Logo from "@/components/custom/logo";

const meta: Meta<typeof Logo> = {
  title: "Custom/Logo",
  component: Logo,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "The main application logo with branding and navigation link to home page.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InNavigation: Story = {
  decorators: [
    (Story) => (
      <nav className="flex items-center justify-between p-4 border-b">
        <Story />
        <div className="flex items-center space-x-4">
          <button className="text-sm">Login</button>
          <button className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded">
            Sign Up
          </button>
        </div>
      </nav>
    ),
  ],
};

export const InFooter: Story = {
  decorators: [
    (Story) => (
      <footer className="bg-muted p-8">
        <div className="flex flex-col items-center space-y-4">
          <Story />
          <p className="text-sm text-muted-foreground">
            © 2024 10minportfolio. All rights reserved.
          </p>
        </div>
      </footer>
    ),
  ],
};

export const OnDarkBackground: Story = {
  decorators: [
    (Story) => (
      <div className="bg-slate-900 p-8 rounded-lg">
        <Story />
      </div>
    ),
  ],
};
