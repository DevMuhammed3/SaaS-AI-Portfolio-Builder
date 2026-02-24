"use client";

import type { Meta, StoryObj } from "@storybook/nextjs";
import { ErrorBoundary } from "@/components/custom/error-boundary";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const meta: Meta<typeof ErrorBoundary> = {
  title: "Custom/ErrorBoundary",
  component: ErrorBoundary,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "An enhanced error boundary with recovery mechanisms and specialized fallbacks for different error types.",
      },
    },
  },
  argTypes: {
    boundaryId: {
      control: "text",
      description: "Unique identifier for this error boundary",
    },
    maxRetries: {
      control: { type: "number", min: 1, max: 10 },
      description: "Maximum number of retry attempts",
    },
    showRetry: {
      control: "boolean",
      description: "Whether to show retry button",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Component that throws an error for testing
function ErrorThrowingComponent({ errorType }: { errorType: string }) {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    switch (errorType) {
      case "network":
        throw new Error("Network connection failed");
      case "authentication":
        throw new Error("Authentication required");
      case "authorization":
        throw new Error("Forbidden access denied");
      case "security":
        throw new Error("Security violation detected");
      case "validation":
        throw new Error("Validation error: invalid input");
      default:
        throw new Error("Something went wrong in rendering");
    }
  }

  return (
    <div className="p-6 text-center space-y-4">
      <h3 className="text-lg font-semibold">Component Working Normally</h3>
      <p className="text-muted-foreground">
        Click the button below to trigger an error
      </p>
      <Button onClick={() => setShouldThrow(true)} variant="destructive">
        Trigger {errorType} Error
      </Button>
    </div>
  );
}

export const Default: Story = {
  args: {
    boundaryId: "default-boundary",
    maxRetries: 3,
    showRetry: true,
  },
  render: (args) => (
    <ErrorBoundary {...args}>
      <ErrorThrowingComponent errorType="rendering" />
    </ErrorBoundary>
  ),
};

export const NetworkError: Story = {
  args: {
    boundaryId: "network-boundary",
    maxRetries: 5,
    showRetry: true,
  },
  render: (args) => (
    <ErrorBoundary {...args}>
      <ErrorThrowingComponent errorType="network" />
    </ErrorBoundary>
  ),
};

export const AuthenticationError: Story = {
  args: {
    boundaryId: "auth-boundary",
    maxRetries: 1,
    showRetry: false,
  },
  render: (args) => (
    <ErrorBoundary {...args}>
      <ErrorThrowingComponent errorType="authentication" />
    </ErrorBoundary>
  ),
};

export const SecurityError: Story = {
  args: {
    boundaryId: "security-boundary",
    maxRetries: 0,
    showRetry: false,
  },
  render: (args) => (
    <ErrorBoundary {...args}>
      <ErrorThrowingComponent errorType="security" />
    </ErrorBoundary>
  ),
};

export const ValidationError: Story = {
  args: {
    boundaryId: "validation-boundary",
    maxRetries: 2,
    showRetry: true,
  },
  render: (args) => (
    <ErrorBoundary {...args}>
      <ErrorThrowingComponent errorType="validation" />
    </ErrorBoundary>
  ),
};

export const CustomFallback: Story = {
  args: {
    boundaryId: "custom-boundary",
    fallback: (
      <div className="text-center p-8 border border-dashed border-muted-foreground rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Custom Error Fallback</h3>
        <p className="text-muted-foreground">This is a custom fallback UI</p>
      </div>
    ),
  },
  render: (args) => (
    <ErrorBoundary {...args}>
      <ErrorThrowingComponent errorType="rendering" />
    </ErrorBoundary>
  ),
};

export const NestedBoundaries: Story = {
  render: () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Nested Error Boundaries</h3>
      <ErrorBoundary boundaryId="outer-boundary" maxRetries={2}>
        <div className="border p-4 rounded">
          <h4 className="font-medium mb-4">Outer Boundary</h4>
          <ErrorBoundary boundaryId="inner-boundary" maxRetries={1}>
            <div className="border border-dashed p-4 rounded">
              <h5 className="font-medium mb-2">Inner Boundary</h5>
              <ErrorThrowingComponent errorType="rendering" />
            </div>
          </ErrorBoundary>
        </div>
      </ErrorBoundary>
    </div>
  ),
};
