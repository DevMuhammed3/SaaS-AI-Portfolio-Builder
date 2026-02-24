import type { Meta, StoryObj } from "@storybook/nextjs";
import TemplateThumbnail from "@/components/custom/template-thumbnail";
import type { Template } from "@/types"; // Adjust path as needed

const meta: Meta<typeof TemplateThumbnail> = {
  title: "Custom/TemplateThumbnail",
  component: TemplateThumbnail,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A thumbnail component for displaying portfolio templates with preview functionality.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ✅ Mock template data
const mockTemplate: Template = {
  _id: "template-premium-001",
  title: "Modern Portfolio",
  description:
    "a clean and modern portfolio template perfect for developers and designers.",
  tags: ["developer", "portfolio", "modern"],
  thumbnail: "https://via.placeholder.com/400x300.png?text=Modern+Portfolio",
  font: "Inter",
  primaryColor: "#1E3A8A",
  secondaryColor: "#9333EA",
  premium: false,
  status: "active",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockPremiumTemplate: Template = {
  _id: "template-premium-002",
  title: "Creative Studio",
  description:
    "a bold and creative template for artists and creative professionals.",
  tags: ["creative", "studio", "art"],
  thumbnail: "https://via.placeholder.com/400x300.png?text=Creative+Studio",
  font: "Poppins",
  primaryColor: "#F59E0B",
  secondaryColor: "#10B981",
  premium: true,
  status: "active",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const Default: Story = {
  args: {
    template: mockTemplate,
  },
};

export const Premium: Story = {
  args: {
    template: mockPremiumTemplate,
  },
};

export const InGrid: Story = {
  decorators: [
    (Story) => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <TemplateThumbnail template={mockTemplate} />
        <Story />
        <TemplateThumbnail template={mockPremiumTemplate} />
      </div>
    ),
  ],
  args: {
    template: {
      _id: "template-business-004",
      title: "Business Pro",
      description:
        "professional template for business consultants and corporate professionals.",
      tags: ["business", "consultant", "professional"],
      thumbnail: "https://via.placeholder.com/400x300.png?text=Business+Pro",
      font: "Roboto",
      primaryColor: "#2563EB",
      secondaryColor: "#D97706",
      premium: false,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
};

export const TemplateGallery: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Choose Your Template</h2>
          <p className="text-muted-foreground">
            Select from our collection of professionally designed templates
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TemplateThumbnail template={mockTemplate} />
          <TemplateThumbnail template={mockPremiumTemplate} />
          <Story />
        </div>
      </div>
    ),
  ],
  args: {
    template: {
      _id: "template-minimalist-005",
      title: "Minimalist",
      description:
        "clean and simple design focusing on content and readability.",
      tags: ["minimal", "clean", "simple"],
      thumbnail: "https://via.placeholder.com/400x300.png?text=Minimalist",
      font: "Open Sans",
      primaryColor: "#4B5563",
      secondaryColor: "#9CA3AF",
      premium: false,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
};
