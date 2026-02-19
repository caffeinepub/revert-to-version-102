import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Megaphone, Plus, Calendar, User, ChevronDown, ChevronUp, Edit } from 'lucide-react';
import { useIsCallerAdmin } from '../../hooks/useQueries';
import AnnouncementDialog from './AnnouncementDialog';
import type { Announcement } from '../../types/backend-extensions';
import { useLanguage } from '../../contexts/LanguageContext';

// NOTE: This component is not currently used in the UI as announcements are hidden
// It remains here for potential future use and to prevent build errors

export default function AnnouncementsTab() {
  const { t } = useLanguage();
  const { data: isAdmin } = useIsCallerAdmin();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Placeholder empty announcements array since the feature is hidden
  const announcements: Announcement[] = [];
  const isLoading = false;

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleCreateNew = () => {
    setSelectedAnnouncement(null);
    setDialogOpen(true);
  };

  const handleEdit = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setDialogOpen(true);
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getPreviewText = (html: string, maxLength: number = 200) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const recentAnnouncements = announcements.slice(0, 2);
  const olderAnnouncements = announcements.slice(2);

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <img
                  src="/assets/generated/announcement-icon-transparent.dim_64x64.png"
                  alt={t.announcements.title}
                  className="h-12 w-12"
                />
              </div>
              <div>
                <CardTitle className="text-2xl">{t.announcements.title}</CardTitle>
                <CardDescription>{t.announcements.subtitle}</CardDescription>
              </div>
            </div>
            {isAdmin && (
              <Button onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                {t.announcements.createButton}
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {announcements.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">{t.announcements.noAnnouncements}</p>
            <p className="text-sm text-muted-foreground">
              {t.announcements.noAnnouncementsDesc}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            {recentAnnouncements.map((announcement) => (
              <Card key={announcement.id} className="border-accent/20 hover:border-accent/40 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{announcement.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(announcement.createdAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {announcement.author.toString().slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(announcement)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-muted-foreground">
                      {getPreviewText(announcement.content, 150)}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleExpanded(announcement.id)}
                      className="w-full"
                    >
                      {expandedIds.has(announcement.id) ? (
                        <>
                          Show Less
                          <ChevronUp className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Read More
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                    {expandedIds.has(announcement.id) && (
                      <div
                        className="prose prose-sm dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: announcement.content }}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {olderAnnouncements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Older Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {olderAnnouncements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="p-4 rounded-lg border hover:border-accent/40 transition-colors space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold line-clamp-2">{announcement.title}</h3>
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(announcement)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {getPreviewText(announcement.content, 100)}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatDate(announcement.createdAt)}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpanded(announcement.id)}
                        >
                          {expandedIds.has(announcement.id) ? 'Show Less' : 'Read More'}
                        </Button>
                      </div>
                      {expandedIds.has(announcement.id) && (
                        <div
                          className="prose prose-sm dark:prose-invert max-w-none pt-3 border-t"
                          dangerouslySetInnerHTML={{ __html: announcement.content }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <AnnouncementDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        announcement={selectedAnnouncement}
        onSuccess={() => {
          setDialogOpen(false);
          setSelectedAnnouncement(null);
        }}
      />
    </div>
  );
}
