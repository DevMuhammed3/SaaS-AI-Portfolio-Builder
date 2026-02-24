import type { Meta, StoryObj } from "@storybook/nextjs";
import { SkipLink } from "@/components/custom/skip-link";

const meta: Meta<typeof SkipLink> = {
  title: "Custom/SkipLink",
  component: SkipLink,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "An accessibility skip link that allows keyboard users to jump to main content.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SkipLink>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div>
        <Story />
        <nav className="bg-muted p-4">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Navigation</div>
            <div className="flex space-x-4">
              <a href="#" className="hover:underline">
                Home
              </a>
              <a href="#" className="hover:underline">
                About
              </a>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </div>
          </div>
        </nav>
        <main id="main-content" className="p-8">
          <h1 className="text-2xl font-bold mb-4">Main Content</h1>
          <p className="text-muted-foreground">
            Press Tab to focus the skip link, then Enter to jump to this main
            content area.
          </p>
        </main>
      </div>
    ),
  ],
};

export const WithInstructions: Story = {
  decorators: [
    (Story) => (
      <div>
        <div className="bg-blue-50 border border-blue-200 p-4 text-sm text-blue-800">
          <strong>Accessibility Demo:</strong> Press Tab to reveal the skip
          link, then Enter to jump to main content.
        </div>
        <Story />
        <header className="bg-muted p-4">
          <nav className="flex items-center justify-between">
            <div className="font-semibold">Site Header</div>
            <div className="flex space-x-4">
              <a href="#" className="hover:underline">
                Link 1
              </a>
              <a href="#" className="hover:underline">
                Link 2
              </a>
              <a href="#" className="hover:underline">
                Link 3
              </a>
              <a href="#" className="hover:underline">
                Link 4
              </a>
            </div>
          </nav>
        </header>
        <main id="main-content" className="p-8 min-h-96">
          <h1 className="text-3xl font-bold mb-6">Main Content Area</h1>
          <div className="space-y-4">
            <p>This is the main content that users want to access quickly.</p>
            <p>
              The skip link helps keyboard users bypass navigation and jump
              directly here.
            </p>
          </div>
        </main>
      </div>
    ),
  ],
};
