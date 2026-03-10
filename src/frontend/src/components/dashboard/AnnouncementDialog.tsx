import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "sonner";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  useCreateAnnouncement,
  useEditAnnouncement,
} from "../../hooks/useQueries";
import type { Announcement } from "../../types/backend-extensions";

interface AnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement?: Announcement | null;
  onSuccess?: () => void;
}

export default function AnnouncementDialog({
  open,
  onOpenChange,
  announcement,
  onSuccess,
}: AnnouncementDialogProps) {
  const { t } = useLanguage();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { mutateAsync: createAnnouncement, isPending: isCreating } =
    useCreateAnnouncement();
  const { mutateAsync: editAnnouncement, isPending: isEditing } =
    useEditAnnouncement();

  const isSubmitting = isCreating || isEditing;

  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title);
      setContent(announcement.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [announcement]);

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const isFormValid = () => {
    const strippedContent = stripHtml(content).trim();
    return title.trim().length > 0 && strippedContent.length > 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      if (announcement) {
        await editAnnouncement({
          id: announcement.id,
          newTitle: title,
          newContent: content,
        });
        toast.success(t.announcements.updated);
      } else {
        await createAnnouncement({ title, content });
        toast.success(t.announcements.createButton);
      }
      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      if (announcement) {
        toast.error(
          error.message || t.announcements.updateError || "An error occurred",
        );
      } else {
        toast.error(
          error.message || t.announcements.createError || "An error occurred",
        );
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl max-h-[90vh] overflow-y-auto"
        data-ocid="announcements.dialog"
      >
        <DialogHeader>
          <DialogTitle>
            {announcement
              ? t.announcements.editTitle
              : t.announcements.createTitle}
          </DialogTitle>
          <DialogDescription>
            {announcement
              ? t.announcements.editDesc
              : t.announcements.createDesc}
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
              data-ocid="announcements.input"
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
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link"],
                    ["clean"],
                  ],
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-ocid="announcements.cancel_button"
            >
              {t.common.cancel}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isFormValid()}
              data-ocid="announcements.submit_button"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.common.loading}
                </>
              ) : announcement ? (
                t.announcements.updated
              ) : (
                t.announcements.createButton
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
