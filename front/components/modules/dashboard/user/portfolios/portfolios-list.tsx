"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Eye,
  Edit,
  // Trash2,
  Copy,
  ExternalLink,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LocaleLink } from "@/components/custom/locale-link";
import { usePortfolios } from "@/hooks/usePortfolios";
import Link from "next/link";
import Heading from "@/components/custom/heading";
import Container from "@/components/custom/container";
import TemplateThumbnail from "@/components/custom/template-thumbnail";

/**
 * Portfolios List Component
 *
 * Displays a grid of user portfolios with management actions.
 * Each portfolio card shows basic information and provides
 * quick actions for viewing, editing, and managing portfolios.
 *
 * Features:
 * - Responsive grid layout
 * - Portfolio status badges
 * - Quick action dropdown menu
 * - Create new portfolio button
 * - Empty state for no portfolios
 * - Real-time data from APIs
 */
export function PortfoliosList() {
  const {
    portfolios,
    loading,
    error,
    fetchPortfolios,
    deletePortfolio,
    duplicatePortfolio,
    // publishPortfolio,
    // unpublishPortfolio,
    // archivePortfolio,
  } = usePortfolios();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState<string | null>(
    null
  );
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch portfolios on component mount
  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  // Handle portfolio deletion
  const handleDeletePortfolio = async () => {
    if (!portfolioToDelete) return;

    setActionLoading(portfolioToDelete);
    const success = await deletePortfolio(portfolioToDelete);

    if (success) {
      setDeleteDialogOpen(false);
      setPortfolioToDelete(null);
    }
    setActionLoading(null);
  };

  // Handle portfolio duplication
  const handleDuplicatePortfolio = async (id: string) => {
    setActionLoading(id);
    await duplicatePortfolio(id);
    setActionLoading(null);
  };



  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "published":
        return "default";
      case "draft":
        return "secondary";
      case "archived":
        return "outline";
      default:
        return "secondary";
    }
  };

  if (loading && portfolios.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading portfolios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
          <ExternalLink className="h-12 w-12 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Error loading portfolios</h3>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => fetchPortfolios()}>Try Again</Button>
      </div>
    );
  }

  return (
    <>
      <section className="py-10 space-y-6">
        {/* Create New Portfolio Button */}

        <Container>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-start md:flex-row justify-between md:items-center">
              <Heading
                title="My Portfolios"
                description="Create and manage your professional portfolios"
              />
              <LocaleLink href="/user/portfolios/new">
                <Button className="gap-2" variant={"primary"}>
                  <Plus className="h-4 w-4" />
                  Create New Portfolio
                </Button>
              </LocaleLink>
            </div>

            {/* Portfolios Grid */}
            {portfolios.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolios.map((portfolio) => (
                  <Card
                    key={portfolio._id}
                    className="group hover:shadow-lg transition-shadow py-0"
                  >
                    <CardHeader className="p-0">
                      {/* Portfolio Thumbnail */}
                      <div className="relative aspect-video bg-muted rounded-t-lg overflow-hidden">
                        {/* <Image
                          src="https://plus.unsplash.com/premium_photo-1720004021036-44ff682b69b0"
                          alt={portfolio.name}
                          className="w-full h-full object-cover"
                          width={200}
                          height={200}
                        /> */}
                        <TemplateThumbnail template={portfolio.templateId} />
                        {/* Status Badge */}
                        <div className="absolute top-3 left-3">
                          <Badge variant={getStatusVariant(portfolio.status)}>
                            {portfolio.status}
                          </Badge>
                        </div>
                        {/* Actions Dropdown */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="secondary"
                                size="sm"
                                className="h-8 w-8 p-0"
                                disabled={actionLoading === portfolio._id}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {/* <DropdownMenuItem asChild>
                            <LocaleLink href={`/${portfolio.slug}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </LocaleLink>
                          </DropdownMenuItem> */}
                              {portfolio.status === "published" && (
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/${portfolio.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    View Live
                                  </Link>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <LocaleLink
                                  href={`/user/portfolios/${portfolio._id}`}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </LocaleLink>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDuplicatePortfolio(portfolio._id)
                                }
                                disabled={actionLoading === portfolio._id}
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {/* {portfolio.status === "draft" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(portfolio._id, "publish")
                                  }
                                  disabled={actionLoading === portfolio._id}
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Publish
                                </DropdownMenuItem>
                              )}
                              {portfolio.status === "published" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(
                                      portfolio._id,
                                      "unpublish"
                                    )
                                  }
                                  disabled={actionLoading === portfolio._id}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Unpublish
                                </DropdownMenuItem>
                              )}
                              {portfolio.status !== "archived" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(portfolio._id, "archive")
                                  }
                                  disabled={actionLoading === portfolio._id}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Archive
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  setPortfolioToDelete(portfolio._id);
                                  setDeleteDialogOpen(true);
                                }}
                                disabled={actionLoading === portfolio._id}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem> */}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4">
                      {/* Portfolio Name */}
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                        {portfolio.name}
                      </h3>

                      {/* Template Info */}
                      <p className="text-sm text-muted-foreground mb-3">
                        Template: {portfolio.templateId.title}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                          Views: {portfolio.viewCount?.toLocaleString() || 0}
                        </span>
                        <span>
                          Updated:{" "}
                          {new Date(portfolio.updatedAt).toLocaleString()}
                        </span>
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 pt-0">
                      <div className="flex gap-2 w-full">
                        <LocaleLink
                          href={`/user/portfolios/${portfolio._id}`}
                          className="flex-1"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full bg-transparent"
                            disabled={actionLoading === portfolio._id}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </LocaleLink>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          disabled={actionLoading === portfolio._id}
                          asChild
                        >
                          <LocaleLink
                            target="_blank"
                            href={`/user/portfolios/preview/${portfolio.slug}`}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </LocaleLink>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Plus className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  No portfolios yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Create your first portfolio to showcase your work and skills.
                </p>
                <LocaleLink href="/user/portfolios/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Portfolio
                  </Button>
                </LocaleLink>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              portfolio and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePortfolio}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={actionLoading === portfolioToDelete}
            >
              {actionLoading === portfolioToDelete ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
