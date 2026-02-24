"use client";

import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import {
  Menu,
  Settings,
  User,
  Bell,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const meta: Meta<typeof Sheet> = {
  title: "UI/Sheet",
  component: Sheet,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A sheet component that slides in from the edge of the screen, perfect for navigation menus and side panels.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Sheet>;

function BasicSheetExample() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function NavigationSheetExample() {
  const menuItems = [
    { icon: User, label: "Profile", href: "#" },
    { icon: Settings, label: "Settings", href: "#" },
    { icon: Bell, label: "Notifications", href: "#" },
    { icon: Search, label: "Search", href: "#" },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>
            Access your account and application features.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <nav className="grid gap-2">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </a>
            ))}
          </nav>
          <Separator className="my-4" />
          <div className="grid gap-2">
            <h4 className="text-sm font-medium">Recent</h4>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Project Alpha
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Design System
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Marketing Site
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function FilterSheetExample() {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [category, setCategory] = useState("");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Products</SheetTitle>
          <SheetDescription>
            Narrow down your search with these filters.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label>Category</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label>Price Range</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([
                    Number.parseInt(e.target.value) || 0,
                    priceRange[1],
                  ])
                }
              />
              <Input
                type="number"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([
                    priceRange[0],
                    Number.parseInt(e.target.value) || 1000,
                  ])
                }
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Brand</Label>
            <div className="grid gap-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="apple" />
                <Label htmlFor="apple">Apple</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="samsung" />
                <Label htmlFor="samsung">Samsung</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="google" />
                <Label htmlFor="google">Google</Label>
              </div>
            </div>
          </div>
        </div>
        <SheetFooter>
          <Button variant="outline">Clear All</Button>
          <Button>Apply Filters</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function TaskListSheetExample() {
  const [tasks] = useState([
    { id: 1, title: "Review design mockups", completed: false },
    { id: 2, title: "Update documentation", completed: true },
    { id: 3, title: "Fix navigation bug", completed: false },
    { id: 4, title: "Deploy to staging", completed: false },
  ]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          View Tasks
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Task List</SheetTitle>
          <SheetDescription>
            Manage your daily tasks and track progress.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <div className="mb-4">
            <Button size="sm" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add New Task
            </Button>
          </div>
          <div className="grid gap-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    className="rounded"
                  />
                  <span
                    className={
                      task.completed ? "line-through text-muted-foreground" : ""
                    }
                  >
                    {task.title}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function BottomSheetExample() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Bottom Sheet</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Quick Actions</SheetTitle>
          <SheetDescription>
            Choose an action to perform quickly.
          </SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-4 py-4 sm:grid-cols-4">
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 bg-transparent"
          >
            <Plus className="h-6 w-6" />
            Create
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 bg-transparent"
          >
            <Edit className="h-6 w-6" />
            Edit
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 bg-transparent"
          >
            <Search className="h-6 w-6" />
            Search
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 bg-transparent"
          >
            <Settings className="h-6 w-6" />
            Settings
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export const Basic: Story = {
  render: () => <BasicSheetExample />,
  parameters: {
    docs: {
      description: {
        story: "A basic sheet that slides in from the right with form content.",
      },
    },
  },
};

export const Navigation: Story = {
  render: () => <NavigationSheetExample />,
  parameters: {
    docs: {
      description: {
        story:
          "A navigation sheet that slides in from the left with menu items and recent links.",
      },
    },
  },
};

export const Filters: Story = {
  render: () => <FilterSheetExample />,
  parameters: {
    docs: {
      description: {
        story:
          "A filter sheet for product filtering with various form controls.",
      },
    },
  },
};

export const TaskList: Story = {
  render: () => <TaskListSheetExample />,
  parameters: {
    docs: {
      description: {
        story: "A wider sheet for displaying and managing a list of tasks.",
      },
    },
  },
};

export const BottomSheet: Story = {
  render: () => <BottomSheetExample />,
  parameters: {
    docs: {
      description: {
        story:
          "A sheet that slides up from the bottom with quick action buttons.",
      },
    },
  },
};
