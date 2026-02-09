import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Megaphone, Plus, Edit, Calendar, User, Loader2 } from 'lucide-react';
import { useGetAllAnnouncements, useIsCallerAdmin } from '../../hooks/useQueries';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatDateTime } from '../../lib/i18n';
import AnnouncementDialog from './AnnouncementDialog';
import type { Announcement } from '../../types/backend-extensions';

export default function AnnouncementsTab() {
  const { t, locale } = useLanguage();
  const { data: announcements = [], isLoading: announcementsLoading, error } = useGetAllAnnouncements();
  const { data: isAdmin, isLoading: isAdminLoading, isFetched: isAdminFetched } = useIsCallerAdmin();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  // Check if authorization queries have completed
  const authorizationResolved = isAdminFetched;
  
  // User can create/edit if they are admin only
  // Only show button after authorization is resolved
  const canCreateEdit = authorizationResolved && isAdmin === true;

  // Sort announcements by creation date (newest first)
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    return Number(b.createdAt - a.createdAt);
  });

  // Split announcements: first 2 are featured, rest are in grid
  const featuredAnnouncements = sortedAnnouncements.slice(0, 2);
  const gridAnnouncements = sortedAnnouncements.slice(2);

  const handleCreate = () => {
    setEditingAnnouncement(null);
    setDialogOpen(true);
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingAnnouncement(null);
  };

  // Helper function to strip HTML and get preview text
  const getPreviewText = (htmlContent: string, maxLength: number = 150): string => {
    const div = document.createElement('div');
    div.innerHTML = htmlContent;
    const text = div.textContent || div.innerText || '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Show loading state only for announcements data
  if (announcementsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-3">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">{t.common.error}</CardTitle>
          <CardDescription>
            {error instanceof Error ? error.message : t.announcements.errorLoading}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t.announcements.title}
          </h2>
          <p className="text-muted-foreground mt-1">
            {t.announcements.subtitle}
          </p>
        </div>
        {authorizationResolved && canCreateEdit && (
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            {t.announcements.createButton}
          </Button>
        )}
      </div>

      {sortedAnnouncements.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Megaphone className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t.announcements.noAnnouncements}</h3>
            <p className="text-muted-foreground text-center max-w-md">
              {t.announcements.noAnnouncementsDesc}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Featured Announcements - Large Cards */}
          {featuredAnnouncements.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredAnnouncements.map((announcement) => (
                <Card 
                  key={announcement.id} 
                  className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 overflow-hidden"
                >
                  {/* Icon/Thumbnail Placeholder */}
                  <div className="relative h-48 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Megaphone className="h-20 w-20 text-primary/40 group-hover:text-primary/60 transition-colors duration-300 relative z-10" />
                  </div>

                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
                        {announcement.title}
                      </CardTitle>
                      {authorizationResolved && canCreateEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(announcement)}
                          className="gap-2 shrink-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{announcement.author.toString().slice(0, 10)}...</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDateTime(announcement.createdAt, locale)}</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Preview Text */}
                    <p className="text-muted-foreground leading-relaxed line-clamp-3">
                      {getPreviewText(announcement.content, 200)}
                    </p>

                    {/* Full Content (Expandable) */}
                    <details className="group/details">
                      <summary className="cursor-pointer text-primary hover:text-primary/80 font-medium text-sm list-none flex items-center gap-2">
                        <span>{t.common.viewDetails}</span>
                        <svg 
                          className="h-4 w-4 transition-transform group-open/details:rotate-180" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="mt-4 pt-4 border-t">
                        <div
                          className="prose prose-sm dark:prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: announcement.content }}
                        />
                      </div>
                    </details>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Grid Announcements - Smaller Cards */}
          {gridAnnouncements.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {gridAnnouncements.map((announcement) => (
                <Card 
                  key={announcement.id} 
                  className="group hover:shadow-lg transition-all duration-300 hover:border-primary/30 flex flex-col"
                >
                  {/* Small Icon Header */}
                  <div className="relative h-32 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 flex items-center justify-center">
                    <Megaphone className="h-12 w-12 text-primary/30 group-hover:text-primary/50 transition-colors" />
                  </div>

                  <CardHeader className="space-y-2 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {announcement.title}
                      </CardTitle>
                      {authorizationResolved && canCreateEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(announcement)}
                          className="h-8 w-8 p-0 shrink-0"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        <span>{announcement.author.toString().slice(0, 8)}...</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDateTime(announcement.createdAt, locale)}</span>
                      </div>
                    </div>

                    {/* Preview Text */}
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 pt-2">
                      {getPreviewText(announcement.content, 120)}
                    </p>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Full Content (Expandable) */}
                    <details className="group/details">
                      <summary className="cursor-pointer text-primary hover:text-primary/80 font-medium text-xs list-none flex items-center gap-1.5">
                        <span>{t.common.viewDetails}</span>
                        <svg 
                          className="h-3.5 w-3.5 transition-transform group-open/details:rotate-180" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="mt-3 pt-3 border-t">
                        <div
                          className="prose prose-sm dark:prose-invert max-w-none text-xs"
                          dangerouslySetInnerHTML={{ __html: announcement.content }}
                        />
                      </div>
                    </details>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      <AnnouncementDialog
        open={dialogOpen}
        onClose={handleClose}
        announcement={editingAnnouncement}
      />
    </div>
  );
}
