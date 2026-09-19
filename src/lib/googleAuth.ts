// Google Identity Services (GIS) OAuth helper for 3D HUB
import { User } from "@/lib/store";

export interface GoogleUserProfile {
  sub: string;
  name: string;
  given_name?: string;
  family_name?: string;
  email: string;
  picture?: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string; error_description?: string }) => void;
            error_callback?: (err: { message?: string }) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}

let scriptLoadingPromise: Promise<boolean> | null = null;

export const loadGoogleScript = (): Promise<boolean> => {
  if (window.google?.accounts?.oauth2) {
    return Promise.resolve(true);
  }

  if (scriptLoadingPromise) {
    return scriptLoadingPromise;
  }

  scriptLoadingPromise = new Promise((resolve) => {
    const existingScript = document.getElementById("google-gsi-script");
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.id = "google-gsi-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
};

export const getGoogleClientId = (): string => {
  return (import.meta.env.VITE_GOOGLE_CLIENT_ID || "").trim();
};

export const signInWithGoogle = async (
  onSuccess: (user: User) => void,
  onError: (errorMsg: string) => void,
  onCancel?: () => void
) => {
  const clientId = getGoogleClientId();

  if (!clientId || clientId === "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com") {
    // If no client ID configured yet, inform the user clearly
    onError(
      "Google Client ID is missing. Please create a Client ID in Google Cloud Console and set VITE_GOOGLE_CLIENT_ID in your .env file."
    );
    return;
  }

  const loaded = await loadGoogleScript();
  if (!loaded || !window.google?.accounts?.oauth2) {
    onError("Failed to load Google Identity Services SDK. Please check your internet connection.");
    return;
  }

  try {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: "email profile openid",
      callback: async (tokenResponse) => {
        if (tokenResponse.error) {
          if (tokenResponse.error === "access_denied") {
            if (onCancel) onCancel();
            else onError("Google Sign-In was cancelled.");
          } else {
            onError(tokenResponse.error_description || "Google authentication failed.");
          }
          return;
        }

        if (!tokenResponse.access_token) {
          onError("No access token returned from Google.");
          return;
        }

        // Fetch User Info from Google
        try {
          const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          });

          if (!res.ok) {
            throw new Error(`Userinfo request failed with status ${res.status}`);
          }

          const profile: GoogleUserProfile = await res.json();

          const firstName = profile.given_name || profile.name?.split(" ")[0] || "User";
          const lastName = profile.family_name || profile.name?.split(" ").slice(1).join(" ") || "";

          const user: User = {
            firstName,
            lastName,
            email: profile.email,
            avatar: profile.picture,
            googleId: profile.sub,
          };

          onSuccess(user);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Failed to fetch user profile from Google.";
          onError(message);
        }
      },
      error_callback: (err) => {
        onError(err.message || "Google OAuth popup error occurred.");
      },
    });

    client.requestAccessToken();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred during Google Sign-In.";
    onError(message);
  }
};
