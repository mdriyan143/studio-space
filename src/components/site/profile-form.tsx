"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Loader2Icon } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { authClient } from "@/lib/auth-client"
import { uploadImage } from "@/lib/imgbb"

const PASSWORD_RULE =
  "Password must be at least 6 characters with one uppercase and one lowercase letter."

export function ProfileForm() {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const user = session?.user

  const [name, setName] = React.useState(user?.name ?? "")
  const [image, setImage] = React.useState(user?.image ?? "")
  const [phone, setPhone] = React.useState(user?.phone ?? "")
  const [location, setLocation] = React.useState(user?.location ?? "")
  const [bio, setBio] = React.useState(user?.bio ?? "")
  const [uploading, setUploading] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [changing, setChanging] = React.useState(false)

  if (!user) return null

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      setImage(await uploadImage(file))
      toast.success("Photo uploaded. Click Save to apply.")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedName = name.trim()
    if (trimmedName.length < 2) {
      toast.error("Name must be at least 2 characters.")
      return
    }
    if (phone && !/^\+?[\d\s-]{7,20}$/.test(phone.trim())) {
      toast.error("Please enter a valid phone number.")
      return
    }
    if (bio.length > 200) {
      toast.error("Bio must be 200 characters or fewer.")
      return
    }

    setSaving(true)
    const { error } = await authClient.updateUser({
      name: trimmedName,
      image: image || undefined,
      phone: phone.trim(),
      location: location.trim(),
      bio: bio.trim(),
    })
    setSaving(false)

    if (error) {
      toast.error(error.message ?? "Could not update profile.")
      return
    }

    toast.success("Profile updated.")
    router.refresh()
  }

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      newPassword.length < 6 ||
      !/[A-Z]/.test(newPassword) ||
      !/[a-z]/.test(newPassword)
    ) {
      toast.error(PASSWORD_RULE)
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match.")
      return
    }

    setChanging(true)
    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    })
    setChanging(false)

    if (error) {
      toast.error(error.message ?? "Could not change password.")
      return
    }

    toast.success("Password changed.")
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const initials = (name || user.name)
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="mx-auto w-full max-w-xl space-y-6 px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold">My Profile</h1>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="size-20">
                {image ? <AvatarImage src={image} alt="" /> : null}
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <Label htmlFor="photo">Profile photo</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  disabled={uploading}
                />
                {uploading && (
                  <p className="text-xs text-muted-foreground">Uploading…</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} disabled readOnly />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+880 1XXX-XXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Dhaka, Bangladesh"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                rows={3}
                maxLength={200}
                placeholder="Tell hosts and guests a little about yourself"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <p className="text-right text-xs text-muted-foreground">
                {bio.length}/200
              </p>
            </div>

            <Button type="submit" disabled={saving || uploading}>
              {saving && <Loader2Icon className="animate-spin" />}
              Save changes
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="mb-1 text-lg font-semibold">Change password</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Not available if you signed in with Google.
          </p>

          <form onSubmit={handlePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current">Current password</Label>
              <Input
                id="current"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new">New password</Label>
              <Input
                id="new"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm new password</Label>
              <Input
                id="confirm"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" variant="outline" disabled={changing}>
              {changing && <Loader2Icon className="animate-spin" />}
              Update password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}