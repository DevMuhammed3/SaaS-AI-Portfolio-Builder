import type { Meta, StoryObj } from "@storybook/nextjs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const meta: Meta<typeof Label> = {
  title: "UI/Label",
  component: Label,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A label component for form inputs with proper accessibility attributes.",
      },
    },
  },
  argTypes: {
    htmlFor: {
      control: "text",
      description: "The ID of the form element this label is associated with",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    htmlFor: "email",
    children: "Email Address",
  },
  render: (args) => (
    <div className="space-y-2">
      <Label {...args} />
      <Input id="email" type="email" placeholder="Enter your email" />
    </div>
  ),
};

export const Required: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="password">
        Password <span className="text-destructive">*</span>
      </Label>
      <Input id="password" type="password" placeholder="Enter your password" />
    </div>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="username" className="text-sm font-medium">
        Username
      </Label>
      <p className="text-xs text-muted-foreground">
        Choose a unique username that will be visible to other users
      </p>
      <Input id="username" placeholder="Enter username" />
    </div>
  ),
};

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms" className="text-sm">
        I agree to the{" "}
        <a href="#" className="underline hover:no-underline">
          terms and conditions
        </a>
      </Label>
    </div>
  ),
};

export const WithRadioGroup: Story = {
  render: () => (
    <div className="space-y-3">
      <Label className="text-base font-medium">Preferred contact method</Label>
      <RadioGroup defaultValue="email">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="email" id="contact-email" />
          <Label htmlFor="contact-email">Email</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="phone" id="contact-phone" />
          <Label htmlFor="contact-phone">Phone</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="sms" id="contact-sms" />
          <Label htmlFor="contact-sms">SMS</Label>
        </div>
      </RadioGroup>
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <form className="space-y-6 p-6 border rounded-lg max-w-md">
      <h3 className="text-lg font-semibold">Contact Information</h3>

      <div className="space-y-2">
        <Label htmlFor="full-name">
          Full Name <span className="text-destructive">*</span>
        </Label>
        <Input id="full-name" placeholder="John Doe" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email-form" className="text-sm font-medium">
          Email Address <span className="text-destructive">*</span>
        </Label>
        <Input id="email-form" type="email" placeholder="john@example.com" />
        <p className="text-xs text-muted-foreground">
          We&apos;ll never share your email with anyone else
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone-form">Phone Number</Label>
        <Input id="phone-form" type="tel" placeholder="+1 (555) 123-4567" />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="newsletter-form" />
        <Label htmlFor="newsletter-form" className="text-sm">
          Subscribe to our newsletter for updates and promotions
        </Label>
      </div>
    </form>
  ),
};
