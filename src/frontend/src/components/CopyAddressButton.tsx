import { useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '../contexts/LanguageContext';

interface CopyAddressButtonProps {
  address: string;
  className?: string;
}

export default function CopyAddressButton({ address, className = '' }: CopyAddressButtonProps) {
  const { t } = useLanguage();
  const [copying, setCopying] = useState(false);

  const handleCopy = async () => {
    if (copying) return;
    
    setCopying(true);
    
    try {
      // Try modern Clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(address);
        toast.success(t.common.addressCopied);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = address;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          toast.success(t.common.addressCopied);
        } catch (err) {
          console.error('Fallback copy failed:', err);
          toast.error('Failed to copy address');
        }
        
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Failed to copy address:', err);
      toast.error('Failed to copy address');
    } finally {
      setTimeout(() => setCopying(false), 1000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      disabled={copying}
      className={`inline-flex items-center justify-center transition-opacity hover:opacity-70 disabled:opacity-50 ${className}`}
      title={t.common.addressCopied}
      type="button"
    >
      <img
        src="/assets/generated/copy-address-icon-transparent.dim_24x24.png"
        alt="Copy address"
        className="h-5 w-5"
      />
    </button>
  );
}

