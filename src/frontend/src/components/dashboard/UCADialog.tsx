import { useState } from 'react';
import { useGetActiveUCA, useAcceptUCA } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '../../contexts/LanguageContext';

interface UCADialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccepted: () => void;
}

export default function UCADialog({ open, onOpenChange, onAccepted }: UCADialogProps) {
  const [hasRead, setHasRead] = useState(false);
  const { data: ucaText, isLoading: ucaLoading } = useGetActiveUCA();
  const acceptUCA = useAcceptUCA();
  const { t } = useLanguage();

  const handleAccept = async () => {
    if (!hasRead) {
      toast.error(t.uca.pleaseConfirm);
      return;
    }

    try {
      await acceptUCA.mutateAsync();
      toast.success(t.uca.acceptSuccess);
      setHasRead(false); // Reset for next time
      onAccepted(); // Trigger the join request submission
    } catch (error) {
      toast.error(t.uca.acceptError);
      console.error('Error accepting UCA:', error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setHasRead(false); // Reset checkbox when closing
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl w-[95vw] h-[90vh] max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-4 sm:px-6 pt-6 pb-4 shrink-0">
          <div className="flex justify-center mb-2">
            <div className="p-3 rounded-full bg-primary/10">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-xl sm:text-2xl text-center">{t.uca.title}</DialogTitle>
          <DialogDescription className="text-center text-sm sm:text-base">
            {t.uca.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 px-4 sm:px-6 pb-4 flex flex-col gap-4 overflow-hidden">
          {ucaLoading ? (
            <div className="flex items-center justify-center flex-1">
              <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                <p className="text-sm text-muted-foreground">{t.uca.loadingAgreement}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 min-h-0 w-full rounded-lg border bg-muted/30 overflow-auto">
                <div className="p-4 sm:p-6 min-w-max">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {ucaText}
                    </div>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-start space-x-3 rounded-lg border border-primary/20 bg-primary/5 p-3 sm:p-4">
                <Checkbox
                  id="terms"
                  checked={hasRead}
                  onCheckedChange={(checked) => setHasRead(checked as boolean)}
                  className="mt-1 shrink-0"
                />
                <div className="grid gap-1.5 leading-none min-w-0">
                  <Label
                    htmlFor="terms"
                    className="text-sm font-medium leading-relaxed cursor-pointer break-words"
                  >
                    {t.uca.acceptCheckbox}
                  </Label>
                  <p className="text-xs text-muted-foreground break-words">
                    {t.uca.acceptCheckboxDesc}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="px-4 sm:px-6 pb-6 pt-2 shrink-0 flex-row justify-center sm:justify-center">
          <Button
            size="lg"
            onClick={handleAccept}
            disabled={!hasRead || acceptUCA.isPending || ucaLoading}
            className="w-full sm:w-auto sm:min-w-[200px]"
          >
            {acceptUCA.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                {t.uca.accepting}
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                {t.uca.acceptButton}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
