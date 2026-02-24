"use client";

import Container from "@/components/custom/container";
import { LocaleLink } from "@/components/custom/locale-link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { menuItems } from "@/data/admin-menus";

export function DashboardAdmin() {
  return (
    <div className="min-h-screen py-8">
      <Container>
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your portfolio builder platform
            </p>
          </div>

          {/* Menu Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <LocaleLink key={item.id} href={item.href}>
                  <Card className="h-full transition-colors hover:bg-muted/50 cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <CardTitle className="text-xl">{item.title}</CardTitle>
                      </div>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Click to manage {item.title.toLowerCase()}
                      </p>
                    </CardContent>
                  </Card>
                </LocaleLink>
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
}
