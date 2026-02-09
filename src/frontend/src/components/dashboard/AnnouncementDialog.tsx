import { useState, useEffect, FormEvent } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateAnnouncement, useEditAnnouncement } from '../../hooks/useQueries';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'sonner';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import type { Announcement } from '../../types/backend-extensions';

interface AnnouncementDialogProps {
  open: boolean;
  onClose: () => void;
  announcement?: Announcement | null;
}

export default function AnnouncementDialog({ open, onClose, announcement }: AnnouncementDialogProps) {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const createMutation = useCreateAnnouncement();
  const editMutation = useEditAnnouncement();

  const isEditing = !!announcement;

  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title);
      setContent(announcement.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [announcement, open]);

  // Strip HTML tags to check if content is actually empty
  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const isFormValid = title.trim().length > 0 && stripHtml(content).trim().length > 0;
  const isSubmitting = createMutation.isPending || editMutation.isPending;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error(t.announcements.titleRequired);
      return;
    }

    if (!stripHtml(content).trim()) {
      toast.error(t.announcements.contentRequired);
      return;
    }

    try {
      if (isEditing && announcement) {
        await editMutation.mutateAsync({
          id: announcement.id,
          newTitle: title,
          newContent: content,
        });
        toast.success(t.announcements.updateSuccess);
      } else {
        await createMutation.mutateAsync({ title, content });
        toast.success(t.announcements.createSuccess);
      }
      onClose();
    } catch (error) {
      toast.error(
        isEditing ? t.announcements.updateError : t.announcements.createError
      );
      console.error('Error saving announcement:', error);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t.announcements.editTitle : t.announcements.createTitle}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? t.announcements.editDesc : t.announcements.createDesc}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t.announcements.titleLabel}</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t.announcements.titlePlaceholder}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">{t.announcements.contentLabel}</Label>
              <div className="border rounded-md">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  placeholder={t.announcements.contentPlaceholder}
                  className="min-h-[300px]"
                  readOnly={isSubmitting}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              {t.common.cancel}
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting
                ? t.common.loading
                : isEditing
                ? t.announcements.updateButton
                : t.announcements.createButton}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
