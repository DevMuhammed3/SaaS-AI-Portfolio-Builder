"use client";

import type React from "react";

import Container from "@/components/custom/container";
import Heading from "@/components/custom/heading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Crown,
  MoreHorizontal,
  Edit,
  Trash2,
  Loader2,
  Copy,
  Search,
  Filter,
} from "lucide-react";
import { useState } from "react";
import { TemplateCreateModal } from "./modals/template-create-modal";
import { TemplateEditModal } from "./modals/template-edit-modal";
import { TemplateDeleteModal } from "./modals/template-delete-modal";
import { useTemplates } from "@/hooks/useTemplates";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreateTemplateData,
  Template,
  UpdateTemplateData,
} from "@/lib/services/templates-services";
import TemplateThumbnail from "@/components/custom/template-thumbnail";

export function TemplatesList() {
  const {
    templates,
    isLoading,
    isError,
    error,
    pagination,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    setPage,
    setSearch,
    setStatus,
    clearFilters,
  } = useTemplates({ limit: 6 });

  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [deletingTemplate, setDeletingTemplate] = useState<Template | null>(
    null
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const handleTemplateCreate = async (templateData: CreateTemplateData) => {
    await createTemplate(templateData);
  };

  const handleTemplateUpdate = async (updatedTemplate: UpdateTemplateData) => {
    await updateTemplate(updatedTemplate._id, updatedTemplate);
    setEditingTemplate(null);
  };

  const handleTemplateDelete = async (templateId: string) => {
    await deleteTemplate(templateId);
    setDeletingTemplate(null);
  };

  const handleDuplicate = async (template: Template) => {
    await duplicateTemplate(template._id);
  };

  const openEditModal = (template: Template) => {
    setEditingTemplate(template);
    setEditModalOpen(true);
  };

  const openDeleteModal = (template: Template) => {
    setDeletingTemplate(template);
    setDeleteModalOpen(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleStatusChange = (value: string) => {
    const status = value as "all" | "active" | "inactive";
    setStatusFilter(status);
    setStatus(status);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setStatusFilter("all");
    clearFilters();
  };

  if (isError) {
    return (
      <div className="min-h-screen py-8">
        <Container>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-500 mb-4">Error: {error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <Container>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Heading
              title="Templates"
              description="Manage portfolio templates and layouts"
            />
            <TemplateCreateModal
              onTemplateCreate={handleTemplateCreate}
              isLoading={isLoading}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search templates..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" variant="outline">
                Search
              </Button>
            </form>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={handleClearFilters}>
                Clear
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading templates...</span>
            </div>
          )}

          {/* Templates Grid */}
          {!isLoading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {templates.length === 0 ? (
                <Card className="border-dashed border-2 col-span-full">
                  <CardHeader className="text-center">
                    <CardTitle className="text-muted-foreground">
                      No Templates Found
                    </CardTitle>
                    <CardDescription>
                      {searchInput || statusFilter !== "all"
                        ? "Try adjusting your filters or create a new template"
                        : "Create your first template to get started"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="flex gap-2 justify-center">
                      <TemplateCreateModal
                        onTemplateCreate={handleTemplateCreate}
                        isLoading={isLoading}
                      />
                      {(searchInput || statusFilter !== "all") && (
                        <Button variant="outline" onClick={handleClearFilters}>
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                templates.length > 0 &&
                templates.map((template) => (
                  <Card
                    key={template._id}
                    className="overflow-hidden group py-0"
                  >
                    <div className="aspect-video relative">
                      <TemplateThumbnail template={template} />

                      {/* Actions Menu */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="secondary"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => openEditModal(template)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDuplicate(template)}
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDeleteModal(template)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {template && template.premium && (
                        <Badge className="absolute bottom-2 left-2 bg-yellow-500">
                          <Crown className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}

                      {template.status === "inactive" && (
                        <Badge className="absolute top-2 left-2 bg-gray-500">
                          Inactive
                        </Badge>
                      )}
                    </div>

                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {template.title}
                        <div className="flex gap-2">
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: template.primaryColor }}
                          />
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: template.secondaryColor }}
                          />
                        </div>
                      </CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          Font: {template.font}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {template.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {templates.length} of {pagination.total} templates
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(pagination.page - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-sm">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(pagination.page + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </Container>

      {/* Edit Modal */}
      <TemplateEditModal
        template={editingTemplate}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onTemplateUpdate={handleTemplateUpdate}
        isLoading={isLoading}
      />

      {/* Delete Modal */}
      <TemplateDeleteModal
        template={deletingTemplate}
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onTemplateDelete={handleTemplateDelete}
      />
    </div>
  );
}
