
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { jwt } from "better-auth/plugins";

import { db, client } from "@/lib/db";

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),

    user: {
    additionalFields: {
      phone: { type: "string", required: false, input: true },
      location: { type: "string", required: false, input: true },
      bio: { type: "string", required: false, input: true },
    },
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: false,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },

  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 604800,
    },
  },

  plugins: [jwt()],

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      const passwordRule =
        "Password must contain at least 6 characters, including one uppercase and one lowercase letter."

      const isValid = (p: unknown) =>
        typeof p === "string" &&
        p.length >= 6 &&
        /[A-Z]/.test(p) &&
        /[a-z]/.test(p)

      if (ctx.path === "/sign-up/email" && !isValid(ctx.body.password)) {
        throw new APIError("BAD_REQUEST", { message: passwordRule })
      }

      if (ctx.path === "/change-password" && !isValid(ctx.body.newPassword)) {
        throw new APIError("BAD_REQUEST", { message: passwordRule })
      }

      if (
        ctx.path === "/update-user" &&
        typeof ctx.body.bio === "string" &&
        ctx.body.bio.length > 200
      ) {
        throw new APIError("BAD_REQUEST", {
          message: "Bio must be 200 characters or fewer.",
        })
      }
    }),
  },
});
