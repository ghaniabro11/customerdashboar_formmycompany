"use client";

import { Button } from "@/components/ui/button";
import { useIsMounted } from "@/hooks/useIsMounted";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
const getAuthErrorMessage = (errorCode: string | null, isRegister: boolean, errorMessage?: string) => {
  // If we have a specific error message from the backend, use it
  if (errorMessage) {
    return errorMessage;
  }

  if (!errorCode) {
    return isRegister
      ? "We couldn't create your account. Please try again."
      : "We couldn't sign you in. Please try again.";
  }

  // Decode URL-encoded error messages
  const decodedError = decodeURIComponent(errorCode);

  // Handle JSON parsing errors
  if (decodedError.includes("Unexpected token") || decodedError.includes("not valid JSON")) {
    return "Server returned an invalid response. Please try again later.";
  }

  switch (errorCode) {
    case "CredentialsSignin":
      return isRegister
        ? "Those details are already in use. Try signing in instead."
        : "Incorrect email or password. Please try again.";
    case "CredentialsCallback":
      return isRegister
        ? "Registration failed. Please try again."
        : "Login failed. Please try again.";
    case "OAuthSignin":
      return "Error occurred during OAuth sign in. Please try again.";
    case "OAuthCallback":
      return "Error occurred during OAuth callback. Please try again.";
    case "OAuthCreateAccount":
      return "Could not create OAuth account. Please try again.";
    case "EmailCreateAccount":
      return "Could not create email account. Please try again.";
    case "Callback":
      return "Error occurred during authentication callback. Please try again.";
    case "OAuthAccountNotLinked":
      return "This account is already linked to another provider.";
    case "EmailSignin":
      return "Check your email for the sign in link.";
    case "SessionRequired":
      return "Please sign in to access this page.";
    default:
      // Try to format the error code, or return the decoded error if it looks like a message
      if (decodedError.length > 20 || decodedError.includes(" ")) {
        return decodedError;
      }
      return decodedError.replace(/([A-Z])/g, " $1").trim();
  }
};

const getAuthSuccessMessage = (isRegister: boolean) =>
  isRegister
    ? "Account created successfully. You can sign in now."
    : "Welcome back! You are signed in.";
export default function AuthPageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isMounted = useIsMounted();

  // Check for error in URL parameters (from NextAuth error page)
  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      const errorMessage = getAuthErrorMessage(error, false);
      toast.error(errorMessage);
      // Clean up URL by removing error parameter
      const newUrl = window.location.pathname;
      router.replace(newUrl);
    }
  }, [searchParams, router]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        mode: isRegister ? "register" : "login",
        email: form.email,
        password: form.password,
        ...(isRegister && {
          name: form.name,
          username: form.username,
        }),
      });

      if (!res?.ok) {
        // Try to extract error message from the response
        let errorMessage: string | undefined;
        try {
          // NextAuth sometimes includes error details in the response
          if (res?.error) {
            errorMessage = res.error;
          }
        } catch (e) {
          // Ignore parsing errors
        }

        const message = getAuthErrorMessage(res?.error ?? null, isRegister, errorMessage);
        toast.error(message);
        setError(message);
        return;
      }

      toast.success(getAuthSuccessMessage(isRegister));

      if (!isRegister) {
        const callbackUrl = searchParams.get("callbackUrl");
      
        if (callbackUrl) {
          router.push(callbackUrl);
        } else {
          router.push("/dashboard");
        }
      } else {
        setIsRegister(false);
        setForm({
          name: "",
          username: "",
          email: form.email,
          password: "",
        });
      }
    } catch (err) {
      const rawMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      const message = getAuthErrorMessage(null, isRegister, rawMessage);
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    signIn(provider, { callbackUrl: "/dashboard" });
  };

  if (!isMounted) return null;

  return (
    <div className="flex justify-center items-center min-h-dvh bg-gray-50">
      <div className="bg-white p-8 shadow-lg rounded-2xl w-96">
        <h2 className="text-2xl font-bold mb-5 text-center">
          {isRegister ? "Create Account" : "Sign In"}
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-3" role="alert">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full name"
                required
                value={form.name}
                onChange={handleInput}
                className="border rounded-lg w-full px-3 py-2 mb-3"
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                required
                value={form.username}
                onChange={handleInput}
                className="border rounded-lg w-full px-3 py-2 mb-3"
              />
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={handleInput}
            className="border rounded-lg w-full px-3 py-2 mb-3"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={handleInput}
            className="border rounded-lg w-full px-3 py-2 mb-4"
          />

          <Button
            className="w-full rounded-lg"
            type="submit"
            disabled={loading}
            variant={"orange"}
          >
            {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
          </Button>
        </form>

        <div className="my-4 text-center text-sm text-gray-500">
          or continue with
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => handleSocialLogin("google")}
            className="border p-2 space-x-2 rounded-md w-full hover:bg-gray-100 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width="24"
              height="24"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.64 1.22 9.12 3.6l6.8-6.8C35.76 2.5 30.24 0 24 0 14.7 0 6.6 5.64 2.64 13.86l7.92 6.14C12.42 13.02 17.73 9.5 24 9.5z"
              />
              <path
                fill="#34A853"
                d="M46.5 24.5c0-1.64-.15-3.22-.42-4.75H24v9.02h12.7c-.55 2.95-2.2 5.45-4.7 7.15l7.27 5.64C43.66 37.26 46.5 31.36 46.5 24.5z"
              />
              <path
                fill="#FBBC05"
                d="M10.56 28.02a14.4 14.4 0 0 1 0-8.04l-7.92-6.14A23.89 23.89 0 0 0 0 24c0 3.84.9 7.47 2.64 10.86l7.92-6.84z"
              />
              <path
                fill="#4285F4"
                d="M24 48c6.48 0 11.9-2.13 15.87-5.84l-7.27-5.64c-2.02 1.35-4.6 2.15-8.6 2.15-6.27 0-11.58-3.52-13.44-8.86l-7.92 6.84C6.6 42.36 14.7 48 24 48z"
              />
            </svg>
            <span>Google</span>
          </button>

          {/* <button
            onClick={() => handleSocialLogin("facebook")}
            className="border p-2 rounded-full hover:bg-gray-100 text-blue-600 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M22.675 0h-21.35C.597 0 0 .598 0 1.333v21.333C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.66-4.788 1.325 0 2.464.099 2.795.143v3.24h-1.918c-1.504 0-1.794.716-1.794 1.763v2.31h3.587l-.467 3.622h-3.12V24h6.116c.728 0 1.325-.597 1.325-1.334V1.333C24 .598 23.403 0 22.675 0z" />
            </svg>
          </button>

          <button
            onClick={() => handleSocialLogin("apple")}
            className="border p-2 rounded-full hover:bg-gray-100 text-black flex items-center justify-center"
          >
            <Image
              src={`/appleiconsvg.svg`}
              alt="Apple Icon Svg"
              height={28}
              width={28}
            />
          </button> */}
        </div>

        <p className="text-center text-sm mt-5 text-gray-600">
          {isRegister ? "Already have an account?" : "New here?"}{" "}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-600 hover:underline"
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}
