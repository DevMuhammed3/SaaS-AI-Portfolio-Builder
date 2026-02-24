import type { Meta, StoryObj } from "@storybook/nextjs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const meta: Meta<typeof RadioGroup> = {
  title: "UI/RadioGroup",
  component: RadioGroup,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A radio group component built on Radix UI for selecting one option from multiple choices.",
      },
    },
  },
  argTypes: {
    defaultValue: {
      control: "text",
      description: "The default selected value",
    },
    disabled: {
      control: "boolean",
      description: "Whether the radio group is disabled",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="space-y-3">
      <Label className="text-base font-medium">Choose your plan</Label>
      <RadioGroup defaultValue="pro">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="free" id="free" />
          <Label htmlFor="free">Free</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="pro" id="pro" />
          <Label htmlFor="pro">Pro</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="enterprise" id="enterprise" />
          <Label htmlFor="enterprise">Enterprise</Label>
        </div>
      </RadioGroup>
    </div>
  ),
};

export const WithDescriptions: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <Label className="text-base font-medium">
        Select notification frequency
      </Label>
      <RadioGroup defaultValue="weekly">
        <div className="flex items-start space-x-3">
          <RadioGroupItem value="daily" id="daily" className="mt-1" />
          <div className="space-y-1">
            <Label htmlFor="daily" className="font-medium">
              Daily
            </Label>
            <p className="text-sm text-muted-foreground">
              Get notified every day
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <RadioGroupItem value="weekly" id="weekly" className="mt-1" />
          <div className="space-y-1">
            <Label htmlFor="weekly" className="font-medium">
              Weekly
            </Label>
            <p className="text-sm text-muted-foreground">Get a weekly digest</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <RadioGroupItem value="monthly" id="monthly" className="mt-1" />
          <div className="space-y-1">
            <Label htmlFor="monthly" className="font-medium">
              Monthly
            </Label>
            <p className="text-sm text-muted-foreground">
              Get a monthly summary
            </p>
          </div>
        </div>
      </RadioGroup>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="space-y-3">
      <Label className="text-base font-medium">
        Payment method (unavailable)
      </Label>
      <RadioGroup disabled defaultValue="card">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="card" id="card-disabled" />
          <Label htmlFor="card-disabled">Credit Card</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="paypal" id="paypal-disabled" />
          <Label htmlFor="paypal-disabled">PayPal</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="bank" id="bank-disabled" />
          <Label htmlFor="bank-disabled">Bank Transfer</Label>
        </div>
      </RadioGroup>
    </div>
  ),
};

export const PricingCards: Story = {
  render: () => (
    <div className="space-y-4 max-w-2xl">
      <Label className="text-lg font-semibold">Choose your plan</Label>
      <RadioGroup defaultValue="pro" className="grid gap-4 md:grid-cols-3">
        <div className="relative">
          <RadioGroupItem
            value="free"
            id="plan-free"
            className="peer sr-only"
          />
          <Label
            htmlFor="plan-free"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
          >
            <div className="text-center space-y-2">
              <h3 className="font-semibold">Free</h3>
              <div className="text-2xl font-bold">$0</div>
              <p className="text-sm text-muted-foreground">
                Perfect for getting started
              </p>
            </div>
          </Label>
        </div>
        <div className="relative">
          <RadioGroupItem value="pro" id="plan-pro" className="peer sr-only" />
          <Label
            htmlFor="plan-pro"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
          >
            <div className="text-center space-y-2">
              <h3 className="font-semibold">Pro</h3>
              <div className="text-2xl font-bold">$9</div>
              <p className="text-sm text-muted-foreground">
                For growing businesses
              </p>
            </div>
          </Label>
        </div>
        <div className="relative">
          <RadioGroupItem
            value="enterprise"
            id="plan-enterprise"
            className="peer sr-only"
          />
          <Label
            htmlFor="plan-enterprise"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
          >
            <div className="text-center space-y-2">
              <h3 className="font-semibold">Enterprise</h3>
              <div className="text-2xl font-bold">$29</div>
              <p className="text-sm text-muted-foreground">
                For large organizations
              </p>
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  ),
};
