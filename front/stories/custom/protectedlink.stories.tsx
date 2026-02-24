import type { Meta, StoryObj } from "@storybook/nextjs";
import { ProtectedLink } from "@/components/custom/protectedlink";

const meta: Meta<typeof ProtectedLink> = {
  title: "Custom/ProtectedLink",
  component: ProtectedLink,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A link component that requires authentication. Shows sign-in modal for unauthenticated users.",
      },
    },
  },
  argTypes: {
    href: {
      control: "text",
      description: "The destination URL for authenticated users",
    },
    children: {
      control: "text",
      description: "Link content",
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
    href: "/dashboard",
    children: "Go to Dashboard",
  },
};

export const ButtonStyle: Story = {
  args: {
    href: "/premium-features",
    children: "Access Premium Features",
    className:
      "inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors",
  },
};

export const InNavigation: Story = {
  decorators: [
    (Story) => (
      <nav className="flex items-center space-x-6 p-4 border-b">
        <div className="font-semibold">Portfolio App</div>
        <a href="#" className="hover:text-primary">
          Home
        </a>
        <a href="#" className="hover:text-primary">
          Templates
        </a>
        <Story />
        <a href="#" className="hover:text-primary">
          Pricing
        </a>
      </nav>
    ),
  ],
  args: {
    href: "/my-portfolios",
    children: "My Portfolios",
    className: "hover:text-primary",
  },
};

export const CallToAction: Story = {
  decorators: [
    (Story) => (
      <div className="text-center space-y-6 p-8">
        <h2 className="text-2xl font-bold">Ready to Get Started?</h2>
        <p className="text-muted-foreground">
          Create your professional portfolio in minutes
        </p>
        <Story />
      </div>
    ),
  ],
  args: {
    href: "/create-portfolio",
    children: "Create Your Portfolio",
    className:
      "inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors",
  },
};

export const FeatureAccess: Story = {
  decorators: [
    (Story) => (
      <div className="border rounded-lg p-6 space-y-4">
        <h3 className="font-semibold">Advanced Analytics</h3>
        <p className="text-sm text-muted-foreground">
          Get detailed insights about your portfolio performance and visitor
          engagement.
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Premium Feature</span>
          <Story />
        </div>
      </div>
    ),
  ],
  args: {
    href: "/analytics",
    children: "View Analytics",
    className:
      "text-sm px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors",
  },
};

export const MenuItems: Story = {
  decorators: [
    (Story) => (
      <div className="w-48 border rounded-lg shadow-lg bg-background">
        <div className="p-2 space-y-1">
          <a
            href="#"
            className="block px-3 py-2 text-sm hover:bg-muted rounded"
          >
            Profile
          </a>
          <a
            href="#"
            className="block px-3 py-2 text-sm hover:bg-muted rounded"
          >
            Settings
          </a>
          <Story />
          <hr className="my-1" />
          <a
            href="#"
            className="block px-3 py-2 text-sm hover:bg-muted rounded"
          >
            Help
          </a>
        </div>
      </div>
    ),
  ],
  args: {
    href: "/billing",
    children: "Billing",
    className: "block px-3 py-2 text-sm hover:bg-muted rounded",
  },
};
