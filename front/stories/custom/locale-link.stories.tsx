import type { Meta, StoryObj } from "@storybook/nextjs";
import { LocaleLink } from "@/components/custom/locale-link";

const meta: Meta<typeof LocaleLink> = {
  title: "Custom/LocaleLink",
  component: LocaleLink,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A localized Link component that automatically prefixes URLs with the current locale.",
      },
    },
  },
  argTypes: {
    href: {
      control: "text",
      description: "The destination URL (will be automatically localized)",
    },
    children: {
      control: "text",
      description: "Link content",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: "/about",
    children: "About Us",
  },
};

export const ExternalLink: Story = {
  args: {
    href: "https://example.com",
    children: "External Link",
  },
};

export const InNavigation: Story = {
  decorators: [
    (Story) => (
      <nav className="flex items-center space-x-6 p-4 border-b">
        <div className="font-semibold">Logo</div>
        <LocaleLink href="/" className="hover:text-primary">
          Home
        </LocaleLink>
        <Story />
        <LocaleLink href="/contact" className="hover:text-primary">
          Contact
        </LocaleLink>
        <LocaleLink href="/pricing" className="hover:text-primary">
          Pricing
        </LocaleLink>
      </nav>
    ),
  ],
  args: {
    href: "/about",
    children: "About",
    className: "hover:text-primary",
  },
};

export const ButtonStyle: Story = {
  args: {
    href: "/get-started",
    children: "Get Started",
    className:
      "inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors",
  },
};

export const BreadcrumbUsage: Story = {
  decorators: [
    (Story) => (
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
        <LocaleLink href="/" className="hover:text-foreground">
          Home
        </LocaleLink>
        <span>/</span>
        <LocaleLink href="/products" className="hover:text-foreground">
          Products
        </LocaleLink>
        <span>/</span>
        <Story />
      </nav>
    ),
  ],
  args: {
    href: "/products/portfolio-builder",
    children: "Portfolio Builder",
    className: "text-foreground font-medium",
  },
};
