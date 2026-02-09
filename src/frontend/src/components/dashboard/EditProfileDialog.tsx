import { useState, useEffect } from 'react';
import { useGetCallerUserProfile, useUpdateCallerUserProfile } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../../backend';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditProfileDialog({ open, onOpenChange }: EditProfileDialogProps) {
  const { data: userProfile } = useGetCallerUserProfile();
  const updateProfile = useUpdateCallerUserProfile();
  
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [newPicture, setNewPicture] = useState<ExternalBlob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (userProfile) {
      setUsername(userProfile.username);
      setBio(userProfile.bio || '');
      setPreviewUrl(
        userProfile.profilePicture
          ? userProfile.profilePicture.getDirectURL()
          : '/assets/generated/default-avatar.dim_150x150.png'
      );
    }
  }, [userProfile]);

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
      
      setNewPicture(blob);
      setPreviewUrl(URL.createObjectURL(file));
      toast.success('New profile picture selected');
    } catch (error) {
      toast.error('Failed to process image');
      console.error('Error processing image:', error);
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({
        username,
        bio,
        profilePicture: newPicture,
      });
      
      toast.success('Profile updated successfully!');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your username, bio, and profile picture
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32 border-4 border-primary/20">
              <AvatarImage src={previewUrl} alt="Profile" />
              <AvatarFallback className="bg-primary/10 text-primary text-3xl font-semibold">
                {username ? getInitials(username) : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center gap-2">
              <Label htmlFor="picture-edit" className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm font-medium">Change Picture</span>
                </div>
                <Input
                  id="picture-edit"
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
            <Label htmlFor="username-edit">Username</Label>
            <Input
              id="username-edit"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio-edit">Bio</Label>
            <Textarea
              id="bio-edit"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Share a brief description about yourself
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
