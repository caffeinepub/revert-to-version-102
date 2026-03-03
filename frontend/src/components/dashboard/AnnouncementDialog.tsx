import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import type { Announcement } from '../../types/backend-extensions';
import { toast } from 'sonner';
import { useLanguage } from '../../contexts/LanguageContext';

// NOTE: This component is not currently used in the UI as announcements are hidden
// It remains here for potential future use and to prevent build errors

interface AnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement?: Announcement | null;
  onSuccess?: () => void;
}

export default function AnnouncementDialog({ open, onOpenChange, announcement, onSuccess }: AnnouncementDialogProps) {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title);
      setContent(announcement.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [announcement, open]);

  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const isFormValid = () => {
    const strippedContent = stripHtml(content).trim();
    return title.trim().length > 0 && strippedContent.length > 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      // Note: These mutations are commented out in useQueries.ts
      // This is a placeholder to prevent build errors
      toast.info('Announcements feature is currently disabled');
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {announcement ? t.announcements.editTitle : t.announcements.createTitle}
          </DialogTitle>
          <DialogDescription>
            {announcement ? t.announcements.editDesc : t.announcements.createDesc}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">{t.announcements.titleLabel}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.announcements.titlePlaceholder}
              required
            />
          </div>
          <div>
            <Label htmlFor="content">{t.announcements.contentLabel}</Label>
            <div className="border rounded-md">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                placeholder={t.announcements.contentPlaceholder}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['link'],
                    ['clean'],
                  ],
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t.common.cancel}
            </Button>
            <Button type="submit" disabled={isSubmitting || !isFormValid()}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.common.loading}
                </>
              ) : (
                announcement ? t.announcements.updated : t.announcements.createButton
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
