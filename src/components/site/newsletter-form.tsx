"use client"

import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function NewsletterForm() {
  return (
    <form
      className="flex w-full max-w-sm items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault()
        const form = event.currentTarget
        const data = new FormData(form)
        const email = data.get("email")
        if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
          toast.error("Please enter a valid email address.")
          return
        }
        toast.success("You're subscribed!", {
          description: `Studio find tips will land in ${email}.`,
        })
        form.reset()
      }}
    >
      <Input
        type="email"
        name="email"
        required
        placeholder="Enter your email"
        aria-label="Email address"
        className="bg-background"
      />
      <Button type="submit" className="shrink-0">
        Subscribe
      </Button>
    </form>
  )
}
