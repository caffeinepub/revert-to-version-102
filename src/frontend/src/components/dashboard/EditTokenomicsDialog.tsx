import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';
import { useUpdateTokenomicsConfig } from '../../hooks/useQueries';
import type { TokenomicsConfig } from '../../backend';
import { toast } from 'sonner';

interface EditTokenomicsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentConfig: TokenomicsConfig;
}

export default function EditTokenomicsDialog({ open, onOpenChange, currentConfig }: EditTokenomicsDialogProps) {
  const { locale } = useLanguage();
  const updateConfig = useUpdateTokenomicsConfig();
  
  // Convert nanoseconds to Date
  const initialDate = new Date(Number(currentConfig.launchDate) / 1_000_000);
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (type: 'hour' | 'minute', value: string) => {
    const newDate = new Date(selectedDate);
    
    if (type === 'hour') {
      newDate.setHours(parseInt(value, 10));
    } else if (type === 'minute') {
      newDate.setMinutes(parseInt(value, 10));
    }
    
    setSelectedDate(newDate);
  };

  const handleSubmit = async () => {
    try {
      // Convert Date to nanoseconds
      const launchDateNanos = BigInt(selectedDate.getTime() * 1_000_000);
      
      const updatedConfig: TokenomicsConfig = {
        ...currentConfig,
        launchDate: launchDateNanos,
      };

      await updateConfig.mutateAsync(updatedConfig);
      
      toast.success(
        locale === 'en' 
          ? 'Launch date updated successfully!' 
          : 'Date de lancement mise à jour avec succès !'
      );
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update tokenomics config:', error);
      toast.error(
        locale === 'en' 
          ? 'Failed to update launch date' 
          : 'Échec de la mise à jour de la date de lancement'
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {locale === 'en' ? 'Edit Minting Cycle' : 'Modifier le cycle de frappe'}
          </DialogTitle>
          <DialogDescription>
            {locale === 'en'
              ? 'Update the launch date and time for automatic token minting'
              : 'Mettre à jour la date et l\'heure de lancement pour la frappe automatique de jetons'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>
              {locale === 'en' ? 'Launch Date & Time' : 'Date et heure de lancement'}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !selectedDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, locale === 'en' ? 'PPP HH:mm' : 'PPP HH:mm')
                  ) : (
                    <span>{locale === 'en' ? 'Pick a date' : 'Choisir une date'}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="sm:flex">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                  <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                    <ScrollArea className="w-64 sm:w-auto">
                      <div className="flex sm:flex-col p-2">
                        {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                          <Button
                            key={hour}
                            size="icon"
                            variant={
                              selectedDate && selectedDate.getHours() === hour
                                ? 'default'
                                : 'ghost'
                            }
                            className="sm:w-full shrink-0 aspect-square"
                            onClick={() => handleTimeChange('hour', hour.toString())}
                          >
                            {hour.toString().padStart(2, '0')}
                          </Button>
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" className="sm:hidden" />
                    </ScrollArea>
                    <ScrollArea className="w-64 sm:w-auto">
                      <div className="flex sm:flex-col p-2">
                        {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                          <Button
                            key={minute}
                            size="icon"
                            variant={
                              selectedDate && selectedDate.getMinutes() === minute
                                ? 'default'
                                : 'ghost'
                            }
                            className="sm:w-full shrink-0 aspect-square"
                            onClick={() => handleTimeChange('minute', minute.toString())}
                          >
                            {minute.toString().padStart(2, '0')}
                          </Button>
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" className="sm:hidden" />
                    </ScrollArea>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">
              {locale === 'en'
                ? 'Select the date and time when automatic token minting should begin'
                : 'Sélectionnez la date et l\'heure auxquelles la frappe automatique de jetons doit commencer'}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateConfig.isPending}
          >
            {locale === 'en' ? 'Cancel' : 'Annuler'}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={updateConfig.isPending}
          >
            {updateConfig.isPending
              ? (locale === 'en' ? 'Updating...' : 'Mise à jour...')
              : (locale === 'en' ? 'Update' : 'Mettre à jour')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
