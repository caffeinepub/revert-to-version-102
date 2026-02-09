import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Upload, FileText, CheckCircle2, Users } from 'lucide-react';
import { ExternalBlob, type UserProfile } from '../../backend';
import type { ConsensusMeetingView, GroupView } from '../../types/backend-extensions';
import { useSubmitContribution, useGetAllMembers } from '../../hooks/useQueries';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '../../contexts/LanguageContext';

interface ContributionFormProps {
  meeting: ConsensusMeetingView;
  userProfile: UserProfile | null | undefined;
  hasSubmitted: boolean;
  userGroup: GroupView | undefined;
}

export default function ContributionForm({
  meeting,
  userProfile,
  hasSubmitted,
  userGroup,
}: ContributionFormProps) {
  const { t } = useLanguage();
  const submitMutation = useSubmitContribution();
  const { data: allProfiles } = useGetAllMembers();
  const [contributionText, setContributionText] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    if (!contributionText.trim()) {
      toast.error(t.consensus.contributionRequired || 'Please enter your contribution text');
      return;
    }

    try {
      const externalBlobs: ExternalBlob[] = [];

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(prev => ({ ...prev, [file.name]: percentage }));
        });
        externalBlobs.push(blob);
      }

      await submitMutation.mutateAsync({
        meetingId: meeting.id,
        text: contributionText,
        files: externalBlobs,
      });

      toast.success(t.toast.contributionSuccess);
      setContributionText('');
      setFiles([]);
      setUploadProgress({});
    } catch (error: any) {
      toast.error(error.message || t.toast.contributionError);
    }
  };

  const getUsernameByPrincipal = (principal: string) => {
    const profile = allProfiles?.find(p => p.principal.toString() === principal);
    return profile?.username || t.consensus.unknownUser || 'Unknown User';
  };

  if (!userGroup) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">{t.consensus.noGroupAssigned || 'You are not assigned to a group yet.'}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Group Members */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>{t.consensus.yourGroup}</CardTitle>
              <CardDescription>
                {userGroup.members.length} {t.consensus.membersInGroup || 'members in your group'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {userGroup.members.map((member) => (
              <div
                key={member.toString()}
                className="px-3 py-1 rounded-full bg-primary/10 text-sm font-medium"
              >
                {getUsernameByPrincipal(member.toString())}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contribution Form */}
      {!hasSubmitted ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/editor-icon-transparent.dim_32x32.png"
                alt={t.consensus.submitContribution}
                className="h-6 w-6"
              />
              <div>
                <CardTitle>{t.consensus.submitContribution}</CardTitle>
                <CardDescription>
                  {t.consensus.shareContribution || 'Share your weekly contribution with your group'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contribution">{t.consensus.contributionText}</Label>
              <Textarea
                id="contribution"
                placeholder={t.consensus.contributionPlaceholder}
                value={contributionText}
                onChange={(e) => setContributionText(e.target.value)}
                className="min-h-[200px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="files">{t.consensus.attachments || 'Attachments (optional)'}</Label>
              <Input
                id="files"
                type="file"
                multiple
                onChange={handleFileChange}
                accept="image/*,video/*,.pdf,.doc,.docx"
              />
              {files.length > 0 && (
                <div className="space-y-2 mt-2">
                  {files.map((file) => (
                    <div key={file.name} className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4" />
                      <span>{file.name}</span>
                      {uploadProgress[file.name] !== undefined && (
                        <span className="text-muted-foreground">
                          ({uploadProgress[file.name]}%)
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
              className="w-full"
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.consensus.submitting}
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {t.consensus.submitContribution}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <p className="font-semibold">{t.consensus.contributionSubmitted || 'Contribution Submitted!'}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {t.consensus.viewGroupContributions || 'You can view all group contributions below.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Group Contributions */}
      {userGroup.contributions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t.consensus.groupContributions}</CardTitle>
            <CardDescription>
              {userGroup.contributions.length} {t.consensus.of || 'of'} {userGroup.members.length} {t.consensus.membersSubmitted || 'members have submitted'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {userGroup.contributions.map(([principal, contribution], index) => (
                  <div key={principal.toString()}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold">
                          {getUsernameByPrincipal(principal.toString())}
                        </div>
                        {principal.toString() === userProfile?.principal.toString() && (
                          <Badge variant="outline">{t.consensus.you || 'You'}</Badge>
                        )}
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{contribution.text}</p>
                      {contribution.files.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {contribution.files.map((file, idx) => (
                            <a
                              key={idx}
                              href={file.getDirectURL()}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs px-2 py-1 rounded bg-muted hover:bg-muted/80 flex items-center gap-1"
                            >
                              <FileText className="h-3 w-3" />
                              {t.consensus.attachment || 'Attachment'} {idx + 1}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
