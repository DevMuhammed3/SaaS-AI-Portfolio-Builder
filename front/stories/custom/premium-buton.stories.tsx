import type { Meta, StoryObj } from "@storybook/nextjs";
import PremiumButton from "@/components/custom/premium-button";

const meta: Meta<typeof PremiumButton> = {
  title: "Custom/PremiumButton",
  component: PremiumButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A premium access overlay that blocks content and prompts users to upgrade to premium.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OverContent: Story = {
  decorators: [
    (Story) => (
      <div className="relative w-80 h-60 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Premium Feature</h3>
        <p className="text-sm text-muted-foreground mb-4">
          This is some premium content that would be visible to premium users.
        </p>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
        <Story />
      </div>
    ),
  ],
};

export const InCard: Story = {
  decorators: [
    (Story) => (
      <div className="relative border rounded-lg p-6 w-96 h-48">
        <h4 className="font-medium mb-2">Advanced Analytics</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Get detailed insights about your portfolio performance.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted rounded">
            <div className="text-2xl font-bold">1.2K</div>
            <div className="text-xs text-muted-foreground">Views</div>
          </div>
          <div className="text-center p-3 bg-muted rounded">
            <div className="text-2xl font-bold">85%</div>
            <div className="text-xs text-muted-foreground">Engagement</div>
          </div>
        </div>
        <Story />
      </div>
    ),
  ],
};
