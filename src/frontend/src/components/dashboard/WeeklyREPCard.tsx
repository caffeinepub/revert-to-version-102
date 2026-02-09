import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGet12WeekREPHistory } from '../../hooks/useQueries';
import { TrendingUp, Calendar } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function WeeklyREPCard() {
  const { t } = useLanguage();
  const { data: repHistory, isLoading } = useGet12WeekREPHistory();

  if (isLoading) {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>{t.overview.repToken}</CardTitle>
              <CardDescription>{t.common.loading}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  if (!repHistory || repHistory.length === 0) {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>{t.overview.repToken}</CardTitle>
              <CardDescription>{t.overview.repDesc}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {t.overview.repEarned}
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalREP = repHistory.reduce((sum, entry) => sum + Number(entry.balance), 0);
  const averageREP = Math.round(totalREP / repHistory.length);
  const latestEntry = repHistory[repHistory.length - 1];

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>{t.overview.repToken}</CardTitle>
            <CardDescription>{t.overview.repDesc}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{t.overview.repToken}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">
                {latestEntry.balance.toString()}
              </span>
              <Badge variant="secondary" className="text-xs">REP</Badge>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{t.overview.repDesc}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">
                {averageREP}
              </span>
              <Badge variant="secondary" className="text-xs">REP</Badge>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t.overview.repEarned}</span>
            <span className="text-muted-foreground">{repHistory.length} {t.consensus.groups}</span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {repHistory.slice().reverse().map((entry, index) => (
              <div
                key={`${entry.weekId}-${index}`}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{entry.weekId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(entry.timestamp)}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {entry.balance.toString()} REP
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          {t.overview.repEarned}
        </p>
      </CardContent>
    </Card>
  );
}
