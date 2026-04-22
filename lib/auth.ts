import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import FacebookProvider from "next-auth/providers/facebook";
import { cookies } from "next/headers";
import logger from "@/lib/logger/logger";
import { BACKEND_URL } from "@/constants/url";

const BACKEND_COOKIE_NAME = "ldjsldjs82ydkz";
const BACKEND_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const setBackendTokenCookie = async (token: string) => {
  try {
    const cookieStore = await cookies();
    cookieStore.set(BACKEND_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: BACKEND_COOKIE_MAX_AGE,
    });
  } catch (error) {
    logger.error("Failed to set backend token cookie", error);
  }
};

const extractSessionPayload = (data: any) => {
  if (!data) return null;

  const customer =
    data.customer ??
    data.user ??
    data.data?.customer ??
    data.data?.user ??
    null;
  const token = data.token ?? data.access_token ?? data.data?.token ?? null;

  if (!customer?.id || !token) {
    return null;
  }

  return {
    customer,
    token,
  };
};
const clearBackendTokenCookie = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(BACKEND_COOKIE_NAME);
  } catch (error) {
    logger.error("Failed to clear backend token cookie", error);
  }
};
const normalizeUserIdentity = ({
  email,
  username,
  name,
}: {
  email?: string | null;
  username?: string | null;
  name?: string | null;
}) => {
  const trimmedEmail = email?.trim() || null;
  const trimmedUsername = username?.trim() || null;
  const trimmedName = name?.trim() || null;

  return {
    email: trimmedEmail,
    username:
      trimmedUsername ??
      trimmedEmail?.split("@")[0]?.replace(/[^a-zA-Z0-9-_]/g, "") ??
      null,
    name:
      trimmedName ??
      trimmedUsername ??
      trimmedEmail ??
      trimmedEmail?.split("@")[0] ??
      null,
  };
};

const attemptBackendLogin = async ({
  email,
  username,
  password,
}: {
  email: string;
  username?: string | null;
  password: string;
}) => {
  const payload = {
    email,
    password,
    ...(username ? { username } : {}),
  };

  const res = await fetch(`${BACKEND_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let data: any;
  const contentType = res.headers.get("content-type");
  
  try {
    if (contentType?.includes("application/json")) {
      data = await res.json();
    } else {
      // If response is HTML or other format, try to extract error
      const text = await res.text();
      logger.error("Backend returned non-JSON response:", text.substring(0, 200));
      data = { message: "Server returned an invalid response. Please try again later." };
    }
  } catch (error) {
    logger.error("Failed to parse backend response:", error);
    data = { message: "Failed to process server response. Please try again." };
  }

  logger.debug("Backend login response:", { ok: res.ok, data });

  if (!res.ok) {
    // Extract error message from response
    const errorMessage = 
      data?.message || 
      data?.error || 
      data?.errors?.message || 
      (typeof data?.errors === "string" ? data.errors : null) ||
      "Login failed. Please check your credentials.";
    logger.error("Backend login failed:", errorMessage);
    return null;
  }

  const sessionData = extractSessionPayload(data);
  if (!sessionData) return null;

  await setBackendTokenCookie(sessionData.token);

  return sessionData;
};

const attemptBackendRegister = async ({
  name,
  username,
  email,
  password,
}: {
  name: string;
  username: string;
  email: string;
  password: string;
}) => {
  const payload = {
    name,
    username,
    email,
    password,
    password_confirmation: password,
  };

  const res = await fetch(`${BACKEND_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let data: any;
  const contentType = res.headers.get("content-type");
  
  try {
    if (contentType?.includes("application/json")) {
      data = await res.json();
    } else {
      // If response is HTML or other format, try to extract error
      const text = await res.text();
      logger.error("Backend returned non-JSON response:", text.substring(0, 200));
      data = { message: "Server returned an invalid response. Please try again later." };
    }
  } catch (error) {
    logger.error("Failed to parse backend response:", error);
    data = { message: "Failed to process server response. Please try again." };
  }

  logger.debug("Backend register response:", { ok: res.ok, data });

  if (!res.ok) {
    // Extract error message from response
    const errorMessage = 
      data?.message || 
      data?.error || 
      data?.errors?.message || 
      (typeof data?.errors === "string" ? data.errors : null) ||
      "Registration failed. Please check your details and try again.";
    logger.error("Backend registration failed:", errorMessage);
    return null;
  }

  const sessionData = extractSessionPayload(data);
  if (sessionData) {
    await setBackendTokenCookie(sessionData.token);
  }

  return sessionData;
};

const ensureCustomerInBackend = async ({
  email,
  username,
  name,
  password,
}: {
  email: string;
  username: string;
  name: string;
  password: string;
}) => {
  const loginSession = await attemptBackendLogin({
    email,
    username,
    password,
  });
  if (loginSession) {
    return loginSession;
  }

  logger.info("Backend login failed; attempting registration", {
    email,
    username,
  });

  const registerSession = await attemptBackendRegister({
    email,
    username,
    name,
    password,
  });

  if (registerSession) {
    return registerSession;
  }

  logger.info("Registration response missing token; retrying login");
  return attemptBackendLogin({ email, username, password });
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID as string,
      clientSecret: process.env.APPLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text" },
        username: { label: "Username", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        mode: { label: "Mode", type: "text" },
      },
      async authorize(credentials) {
        try {
          const isRegister = credentials?.mode === "register";

          const email = credentials?.email?.trim();
          const password = credentials?.password ?? "";
          const username = credentials?.username?.trim();

          if (!email || !password) {
            logger.error("Missing email or password");
            return null;
          }

          if (isRegister && (!credentials?.name?.trim() || !username)) {
            logger.error("Missing name or username for registration");
            return null;
          }

          const endpoint = isRegister
            ? `${BACKEND_URL}/register`
            : `${BACKEND_URL}/login`;

          const payload = isRegister
            ? {
                name: credentials.name?.trim(),
                username,
                email,
                password,
                password_confirmation: password,
              }
            : {
                email,
                password,
              };

          logger.debug("Attempting auth to:", endpoint);
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          let data: any;
          const contentType = res.headers.get("content-type");
          
          try {
            if (contentType?.includes("application/json")) {
              data = await res.json();
            } else {
              // If response is HTML or other format, try to extract error
              const text = await res.text();
              logger.error("Backend returned non-JSON response:", text.substring(0, 200));
              data = { message: "Server returned an invalid response. Please try again later." };
            }
          } catch (error) {
            logger.error("Failed to parse backend response:", error);
            data = { message: "Failed to process server response. Please try again." };
          }

          logger.debug("Auth response:", { ok: res.ok, data });

          if (!res.ok) {
            // Extract error message - handle various response formats
            const errorMessage = 
              data?.message || 
              data?.error || 
              data?.errors?.message || 
              (typeof data?.errors === "string" ? data.errors : null) ||
              (Array.isArray(data?.errors) ? data.errors.join(", ") : null) ||
              "Authentication failed. Please try again.";
            logger.error("Auth failed:", errorMessage);
            // Throw error with message so NextAuth can handle it
            throw new Error(errorMessage);
          }

          let sessionData = extractSessionPayload(data);

          if (isRegister && !sessionData) {
            logger.info("Register succeeded; attempting follow-up login");
            sessionData = await attemptBackendLogin({
              email,
              username: username ?? undefined,
              password,
            });
          }

          if (!sessionData) {
            logger.error("Missing customer or token in auth response");
            return null;
          }

          await setBackendTokenCookie(sessionData.token);

          return {
            id:
              sessionData.customer.id ??
              sessionData.customer.email ??
              sessionData.customer.username ??
              email,
            name:
              sessionData.customer.name ??
              ([sessionData.customer.first_name, sessionData.customer.last_name]
                .filter(Boolean)
                .join(" ") ||
                sessionData.customer.username) ??
              email,
            email: sessionData.customer.email ?? email,
            token: sessionData.token,
            customer: sessionData.customer,
          };
        } catch (error) {
          logger.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account || account.provider === "credentials") {
        return true;
      }

      const { email, username, name } = normalizeUserIdentity({
        email: user.email,
        username:
          (profile as any)?.preferred_username ??
          (profile as any)?.login ??
          user.email?.split("@")[0],
        name: user.name ?? (profile as any)?.name,
      });

      if (!email || !username || !name) {
        logger.error("OAuth sign-in missing required fields", {
          provider: account.provider,
          email,
          username,
          name,
        });
        return false;
      }

      const generatedPassword = `${account.provider}:${account.providerAccountId}`;

      const backendSession = await ensureCustomerInBackend({
        email,
        username,
        name,
        password: generatedPassword,
      });

      if (!backendSession) {
        logger.error("Failed to sync OAuth user with backend", {
          provider: account.provider,
          email,
          username,
        });
        // Return false to indicate sign-in failure
        // NextAuth will redirect to error page with appropriate error code
        return false;
      }

      user.token = backendSession.token;
      user.customer = backendSession.customer;
      user.name =
        backendSession.customer.name ??
        backendSession.customer.username ??
        user.name;
      user.email = backendSession.customer.email ?? user.email;

      return true;
    },
    async jwt({ token, user, account }) {
      logger.debug("JWT callback:", { user: !!user, account: !!account });
      if (user) {
        token.accessToken = (user as any).token;
        token.customer = (user as any).customer ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      logger.debug("Session callback:", { token: !!token });
      (session as any).accessToken = token.accessToken;
      (session as any).customer = token.customer ?? null;
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      logger.info("Signing out", { token });
      const authToken = await cookies();
      if (authToken) {
        try {
          await fetch(`${BACKEND_URL}/logout`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authToken.get(BACKEND_COOKIE_NAME)}`,
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          logger.error("Backend logout failed", error);
        }
      }
      await clearBackendTokenCookie();
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};
