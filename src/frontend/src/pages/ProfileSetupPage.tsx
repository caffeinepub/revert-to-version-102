import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, UserPlus, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';

export default function ProfileSetupPage() {
  const { identity } = useInternetIdentity();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState<ExternalBlob | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string>('/assets/generated/default-avatar.dim_150x150.png');
  const [uploadProgress, setUploadProgress] = useState(0);
  const saveProfile = useSaveCallerUserProfile();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });
      
      setProfilePicture(blob);
      setPreviewUrl(URL.createObjectURL(file));
      toast.success('Profile picture selected');
    } catch (error) {
      toast.error('Failed to process image');
      console.error('Error processing image:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error('Please enter a username');
      return;
    }

    if (!email.trim()) {
      toast.error('Please enter an email');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!identity) {
      toast.error('Not authenticated');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        username: username.trim(),
        email: email.trim(),
        bio: bio.trim(),
        profilePicture,
        principal: identity.getPrincipal(),
      });
      toast.success('Profile created successfully!');
    } catch (error) {
      toast.error('Failed to create profile. Please try again.');
      console.error('Error creating profile:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-lg border-2 border-primary/20 shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="p-3 rounded-full bg-primary/10">
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl">Create Your Profile</CardTitle>
          <CardDescription className="text-base">
            Set up your Phil3 member profile
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32 border-4 border-primary/20">
                <AvatarImage src={previewUrl} alt="Profile" />
                <AvatarFallback className="bg-primary/10 text-primary text-3xl font-semibold">
                  {username ? username[0].toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-center gap-2">
                <Label htmlFor="picture" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
                    <Upload className="h-4 w-4" />
                    <span className="text-sm font-medium">Upload Picture</span>
                  </div>
                  <Input
                    id="picture"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </Label>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <p className="text-xs text-muted-foreground">Uploading: {uploadProgress}%</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Optional: Share a brief description about yourself
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pb-8">
            <Button
              type="submit"
              size="lg"
              disabled={saveProfile.isPending}
              className="min-w-[200px] h-12 text-lg font-semibold"
            >
              {saveProfile.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" />
                  Create Profile
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
