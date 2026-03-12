import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  ExternalLink,
  FileText,
  Loader2,
  Pencil,
  Upload,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob, type UserProfile } from "../../backend";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  useGetAllMembers,
  useSubmitContribution,
} from "../../hooks/useQueries";
import type {
  ConsensusMeetingView,
  GroupView,
} from "../../types/backend-extensions";

// URL is embedded in text using this marker so no backend changes are needed
const PROOF_URL_MARKER = "\n\n[PROOF_URL:";
const PROOF_URL_END = "]";

function encodeContributionText(text: string, proofUrl: string): string {
  const trimmedText = text.trim();
  const trimmedUrl = proofUrl.trim();
  if (!trimmedUrl) return trimmedText;
  return `${trimmedText}${PROOF_URL_MARKER}${trimmedUrl}${PROOF_URL_END}`;
}

function parseContributionText(raw: string): {
  text: string;
  proofUrl: string;
} {
  const markerIdx = raw.indexOf(PROOF_URL_MARKER);
  if (markerIdx === -1) return { text: raw, proofUrl: "" };
  const text = raw.slice(0, markerIdx);
  const afterMarker = raw.slice(markerIdx + PROOF_URL_MARKER.length);
  const endIdx = afterMarker.lastIndexOf(PROOF_URL_END);
  const proofUrl = endIdx === -1 ? afterMarker : afterMarker.slice(0, endIdx);
  return { text, proofUrl };
}

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

  const existingContribution = userGroup?.contributions.find(
    ([p]) => p.toString() === userProfile?.principal.toString(),
  )?.[1];

  const parsed = existingContribution
    ? parseContributionText(existingContribution.text)
    : { text: "", proofUrl: "" };

  const [contributionText, setContributionText] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [isEditing, setIsEditing] = useState(false);

  const handleStartEdit = () => {
    setContributionText(parsed.text);
    setProofUrl(parsed.proofUrl);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setContributionText("");
    setProofUrl("");
    setFiles([]);
    setUploadProgress({});
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    if (!contributionText.trim()) {
      toast.error(
        t.consensus.contributionRequired ||
          "Please enter your contribution text",
      );
      return;
    }

    const encodedText = encodeContributionText(contributionText, proofUrl);

    try {
      const externalBlobs: ExternalBlob[] = [];

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress(
          (percentage) => {
            setUploadProgress((prev) => ({ ...prev, [file.name]: percentage }));
          },
        );
        externalBlobs.push(blob);
      }

      await submitMutation.mutateAsync({
        meetingId: meeting.id,
        text: encodedText,
        files: externalBlobs,
      });

      toast.success(t.toast.contributionSuccess);
      setContributionText("");
      setProofUrl("");
      setFiles([]);
      setUploadProgress({});
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || t.toast.contributionError);
    }
  };

  const getUsernameByPrincipal = (principal: string) => {
    const profile = allProfiles?.find(
      (p) => p.principal.toString() === principal,
    );
    return profile?.username || t.consensus.unknownUser || "Unknown User";
  };

  if (!userGroup) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            {t.consensus.noGroupAssigned ||
              "You are not assigned to a group yet."}
          </p>
        </CardContent>
      </Card>
    );
  }

  const showForm = !hasSubmitted || isEditing;

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
                {userGroup.members.length}{" "}
                {t.consensus.membersInGroup || "members in your group"}
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

      {/* Contribution Form or Submitted State */}
      {showForm ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/editor-icon-transparent.dim_32x32.png"
                alt={t.consensus.submitContribution}
                className="h-6 w-6"
              />
              <div>
                <CardTitle>
                  {isEditing
                    ? t.consensus.editContribution || "Edit Contribution"
                    : t.consensus.submitContribution}
                </CardTitle>
                <CardDescription>
                  {isEditing
                    ? t.consensus.editContributionDesc ||
                      "Update your contribution before the ranking phase begins"
                    : t.consensus.shareContribution ||
                      "Share your weekly contribution with your group"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contribution">
                {t.consensus.contributionText}
              </Label>
              <Textarea
                id="contribution"
                data-ocid="contribution.textarea"
                placeholder={t.consensus.contributionPlaceholder}
                value={contributionText}
                onChange={(e) => setContributionText(e.target.value)}
                className="min-h-[200px]"
              />
            </div>

            {/* Proof of Work URL */}
            <div className="space-y-2">
              <Label htmlFor="proofUrl">
                {t.consensus.proofUrl || "Proof of Work URL (optional)"}
              </Label>
              <Input
                id="proofUrl"
                data-ocid="contribution.proof_url.input"
                type="url"
                placeholder={t.consensus.proofUrlPlaceholder || "https://..."}
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="files">
                {t.consensus.attachments || "Attachments (optional)"}
              </Label>
              <Input
                id="files"
                data-ocid="contribution.upload_button"
                type="file"
                multiple
                onChange={handleFileChange}
                accept="image/*,video/*,.pdf,.doc,.docx"
              />
              {files.length > 0 && (
                <div className="space-y-2 mt-2">
                  {files.map((file) => (
                    <div
                      key={file.name}
                      className="flex items-center gap-2 text-sm"
                    >
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

            <div className="flex gap-2">
              {isEditing && (
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={submitMutation.isPending}
                  data-ocid="contribution.cancel_button"
                >
                  {t.common.cancel || "Cancel"}
                </Button>
              )}
              <Button
                onClick={handleSubmit}
                disabled={submitMutation.isPending}
                className="flex-1"
                data-ocid="contribution.submit_button"
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.consensus.submitting}
                  </>
                ) : isEditing ? (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    {t.consensus.updateContribution || "Update Contribution"}
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    {t.consensus.submitContribution}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-8">
            <div className="flex flex-col items-center text-center gap-3">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <p className="font-semibold">
                {t.consensus.contributionSubmitted || "Contribution Submitted!"}
              </p>
              <p className="text-sm text-muted-foreground">
                {t.consensus.viewGroupContributions ||
                  "You can view all group contributions below."}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleStartEdit}
                data-ocid="contribution.edit_button"
                className="mt-1"
              >
                <Pencil className="mr-2 h-4 w-4" />
                {t.consensus.editContribution || "Edit Contribution"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Group Contributions */}
      {userGroup.contributions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t.consensus.groupContributions}</CardTitle>
            <CardDescription>
              {userGroup.contributions.length} {t.consensus.of || "of"}{" "}
              {userGroup.members.length}{" "}
              {t.consensus.membersSubmitted || "members have submitted"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {userGroup.contributions.map(
                  ([principal, contribution], index) => {
                    const { text, proofUrl: contributionProofUrl } =
                      parseContributionText(contribution.text);
                    return (
                      <div key={principal.toString()}>
                        {index > 0 && <Separator className="my-4" />}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="font-semibold">
                              {getUsernameByPrincipal(principal.toString())}
                            </div>
                            {principal.toString() ===
                              userProfile?.principal.toString() && (
                              <Badge variant="outline">
                                {t.consensus.you || "You"}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{text}</p>
                          {contributionProofUrl && (
                            <a
                              href={contributionProofUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              {t.consensus.proofLink || "View Proof"}
                            </a>
                          )}
                          {contribution.files.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {contribution.files.map((file, idx) => (
                                <a
                                  key={file.getDirectURL()}
                                  href={file.getDirectURL()}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs px-2 py-1 rounded bg-muted hover:bg-muted/80 flex items-center gap-1"
                                >
                                  <FileText className="h-3 w-3" />
                                  {t.consensus.attachment || "Attachment"}{" "}
                                  {idx + 1}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
