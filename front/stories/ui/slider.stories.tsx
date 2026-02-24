"use client";

import type { Meta, StoryObj } from "@storybook/nextjs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const meta: Meta<typeof Slider> = {
  title: "UI/Slider",
  component: Slider,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A slider component built on Radix UI for selecting values within a range.",
      },
    },
  },
  argTypes: {
    min: {
      control: { type: "number" },
      description: "Minimum value",
    },
    max: {
      control: { type: "number" },
      description: "Maximum value",
    },
    step: {
      control: { type: "number" },
      description: "Step increment",
    },
    disabled: {
      control: "boolean",
      description: "Whether the slider is disabled",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
  },
  render: (args) => (
    <div className="w-80 space-y-4">
      <Label>Volume</Label>
      <Slider {...args} />
    </div>
  ),
};

export const WithRange: Story = {
  args: {
    defaultValue: [25, 75],
    max: 100,
    step: 1,
  },
  render: (args) => (
    <div className="w-80 space-y-4">
      <Label>Price Range</Label>
      <Slider {...args} />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>$0</span>
        <span>$100</span>
      </div>
    </div>
  ),
};

export const CustomRange: Story = {
  args: {
    defaultValue: [20],
    min: 0,
    max: 50,
    step: 5,
  },
  render: (args) => (
    <div className="w-80 space-y-4">
      <Label>Temperature (°C)</Label>
      <Slider {...args} />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>0°C</span>
        <span>50°C</span>
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    defaultValue: [30],
    max: 100,
    disabled: true,
  },
  render: (args) => (
    <div className="w-80 space-y-4">
      <Label>Disabled Slider</Label>
      <Slider {...args} />
    </div>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState([25]);

    return (
      <div className="w-80 space-y-4">
        <div className="flex justify-between items-center">
          <Label>Brightness</Label>
          <span className="text-sm font-medium">{value[0]}%</span>
        </div>
        <Slider value={value} onValueChange={setValue} max={100} step={1} />
      </div>
    );
  },
};

export const MultipleRanges: Story = {
  render: () => {
    const [volume, setVolume] = useState([75]);
    const [brightness, setBrightness] = useState([50]);
    const [priceRange, setPriceRange] = useState([20, 80]);

    return (
      <div className="w-80 space-y-8">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Volume</Label>
            <span className="text-sm font-medium">{volume[0]}%</span>
          </div>
          <Slider value={volume} onValueChange={setVolume} max={100} />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Brightness</Label>
            <span className="text-sm font-medium">{brightness[0]}%</span>
          </div>
          <Slider value={brightness} onValueChange={setBrightness} max={100} />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Price Range</Label>
            <span className="text-sm font-medium">
              ${priceRange[0]} - ${priceRange[1]}
            </span>
          </div>
          <Slider value={priceRange} onValueChange={setPriceRange} max={100} />
        </div>
      </div>
    );
  },
};

export const SettingsPanel: Story = {
  render: () => {
    const [settings, setSettings] = useState({
      volume: [65],
      brightness: [80],
      contrast: [50],
      saturation: [75],
    });

    return (
      <div className="w-80 p-6 border rounded-lg space-y-6">
        <h3 className="text-lg font-semibold">Display Settings</h3>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Volume</Label>
              <span className="text-sm font-medium">{settings.volume[0]}%</span>
            </div>
            <Slider
              value={settings.volume}
              onValueChange={(value) =>
                setSettings((prev) => ({ ...prev, volume: value }))
              }
              max={100}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Brightness</Label>
              <span className="text-sm font-medium">
                {settings.brightness[0]}%
              </span>
            </div>
            <Slider
              value={settings.brightness}
              onValueChange={(value) =>
                setSettings((prev) => ({ ...prev, brightness: value }))
              }
              max={100}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Contrast</Label>
              <span className="text-sm font-medium">
                {settings.contrast[0]}%
              </span>
            </div>
            <Slider
              value={settings.contrast}
              onValueChange={(value) =>
                setSettings((prev) => ({ ...prev, contrast: value }))
              }
              max={100}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Saturation</Label>
              <span className="text-sm font-medium">
                {settings.saturation[0]}%
              </span>
            </div>
            <Slider
              value={settings.saturation}
              onValueChange={(value) =>
                setSettings((prev) => ({ ...prev, saturation: value }))
              }
              max={100}
            />
          </div>
        </div>
      </div>
    );
  },
};
