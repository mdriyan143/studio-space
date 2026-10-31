
"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  const router = useRouter()

  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [image, setImage] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")

  const passwordRules = {
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    length: password.length >= 6,
  }

  const isPasswordValid =
    passwordRules.uppercase &&
    passwordRules.lowercase &&
    passwordRules.length

  const handleRegister = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    setErrorMessage("")

    if (!isPasswordValid) {
      setErrorMessage("Please satisfy all password requirements.")
      return
    }

    setIsLoading(true)

    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        image: image.trim() || undefined,
      })

      if (error) {
        const message = error.message || "Registration failed."
        setErrorMessage(message)
        toast.error(message)
        return
      }

      toast.success("Account created successfully!")
      router.push("/login")
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."

      setErrorMessage(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    setErrorMessage("")
    setIsGoogleLoading(true)

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      })

      if (error) {
        const message =
          error.message || "Google registration failed. Please try again."

        setIsGoogleLoading(false)
        setErrorMessage(message)
        toast.error(message)
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Google registration failed. Please try again."

      setIsGoogleLoading(false)
      setErrorMessage(message)
      toast.error(message)
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Create an account
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Join StudioSpace to book studios or list your own.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                minLength={2}
                autoComplete="name"
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium">
                Photo URL <span className="text-muted-foreground">(Optional)</span>
              </label>

              <input
                id="image"
                type="url"
                placeholder="https://example.com/photo.jpg"
                value={image}
                onChange={(event) => setImage(event.target.value)}
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="new-password"
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
              />

              <div className="space-y-1.5 pt-2 text-xs">
                <p className="font-medium text-muted-foreground">
                  Password requirements:
                </p>

                <p className={passwordRules.uppercase ? "text-green-600" : "text-muted-foreground"}>
                  {passwordRules.uppercase ? "✓" : "○"} At least one uppercase letter
                </p>

                <p className={passwordRules.lowercase ? "text-green-600" : "text-muted-foreground"}>
                  {passwordRules.lowercase ? "✓" : "○"} At least one lowercase letter
                </p>

                <p className={passwordRules.length ? "text-green-600" : "text-muted-foreground"}>
                  {passwordRules.length ? "✓" : "○"} At least 6 characters
                </p>
              </div>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
              >
                {errorMessage}
              </div>
            )}

            <Button
              type="submit"
              className="h-11 w-full"
              disabled={
                isLoading ||
                isGoogleLoading ||
                !name.trim() ||
                !email.trim() ||
                !isPasswordValid
              }
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>

            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-11 w-full"
            onClick={handleGoogleRegister}
            disabled={isGoogleLoading || isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="mr-2 size-5"
              aria-hidden="true"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.25 5.48-4.72 7.18l7.62 5.91c4.45-4.11 7.14-10.15 7.14-17.56Z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.75-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.9-5.89l-7.62-5.91c-2.11 1.41-4.81 2.25-8.28 2.25-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
              />
            </svg>

            {isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}
          </Button>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-foreground underline underline-offset-4 hover:opacity-75"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
