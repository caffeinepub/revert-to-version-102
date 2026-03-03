import { Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-6">
        <p className="text-center text-sm text-muted-foreground">
          © 2025. {t.footer.builtWith}{' '}
          <Heart className="inline h-4 w-4 text-red-500 fill-red-500" />{' '}
          {t.footer.love} <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">caffeine.ai</a>.
        </p>
      </div>
    </footer>
  );
}
