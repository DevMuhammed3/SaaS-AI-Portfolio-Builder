import type { Meta, StoryObj } from "@storybook/nextjs"
import { ThemeToggle } from "@/components/custom//theme-toggle"

const meta: Meta<typeof ThemeToggle> = {
  title: "Custom/ThemeToggle",
  component: ThemeToggle,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A theme toggle button that switches between light and dark modes.",
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const InNavigation: Story = {
  decorators: [
    (Story) => (
      <nav className="flex items-center justify-between p-4 border-b w-full max-w-md">
        <div className="font-semibold">Settings</div>
        <Story />
      </nav>
    ),
  ],
}

export const InToolbar: Story = {
  decorators: [
    (Story) => (
      <div className="flex items-center space-x-2 p-2 border rounded-lg">
        <button className="p-2 hover:bg-muted rounded">
          <span className="sr-only">Settings</span>
          ⚙️
        </button>
        <button className="p-2 hover:bg-muted rounded">
          <span className="sr-only">Help</span>❓
        </button>
        <Story />
      </div>
    ),
  ],
}
