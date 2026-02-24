import type { Meta, StoryObj } from "@storybook/nextjs";
import { GridBackground } from "@/components/custom/grid-background";

const meta: Meta<typeof GridBackground> = {
  title: "Custom/GridBackground",
  component: GridBackground,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A customizable grid background component with configurable dot patterns.",
      },
    },
  },
  argTypes: {
    dotColor: {
      control: "color",
      description: "Color of the grid dots",
    },
    dotSize: {
      control: { type: "range", min: 0.5, max: 3, step: 0.1 },
      description: "Size of the grid dots in pixels",
    },
    dotSpacing: {
      control: { type: "range", min: 12, max: 48, step: 2 },
      description: "Spacing between grid dots in pixels",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <h1 className="text-4xl font-bold">Welcome</h1>
          <p className="text-lg text-muted-foreground">
            Beautiful grid background
          </p>
        </div>
      </div>
    ),
  },
};

export const CustomColors: Story = {
  args: {
    dotColor: "rgba(59, 130, 246, 0.2)",
    dotSize: 1.5,
    dotSpacing: 32,
    children: (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 text-center space-y-4">
          <h2 className="text-2xl font-semibold">Blue Grid</h2>
          <p className="text-muted-foreground">Custom blue dot pattern</p>
        </div>
      </div>
    ),
  },
};

export const DenseGrid: Story = {
  args: {
    dotColor: "rgba(168, 85, 247, 0.1)",
    dotSize: 0.8,
    dotSpacing: 16,
    children: (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/90 rounded-lg p-6 text-center">
          <h3 className="text-xl font-medium">Dense Pattern</h3>
          <p className="text-sm text-muted-foreground">Tighter grid spacing</p>
        </div>
      </div>
    ),
  },
};

export const LargeSpacing: Story = {
  args: {
    dotColor: "rgba(34, 197, 94, 0.15)",
    dotSize: 2,
    dotSpacing: 40,
    children: (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6 p-12">
          <h2 className="text-3xl font-bold">Spacious Grid</h2>
          <p className="text-muted-foreground max-w-md">
            Larger spacing creates a more subtle background pattern
          </p>
        </div>
      </div>
    ),
  },
};

export const HeroSection: Story = {
  args: {
    dotColor: "rgba(102, 90, 240, 0.08)",
    children: (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-8 max-w-4xl">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Build Your Portfolio
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Create stunning portfolios in minutes with our easy-to-use platform
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium">
              Get Started
            </button>
            <button className="px-8 py-3 border border-border rounded-lg font-medium">
              Learn More
            </button>
          </div>
        </div>
      </div>
    ),
  },
};
