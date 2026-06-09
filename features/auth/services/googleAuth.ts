import {
  GoogleSignin,
  statusCodes,
  isErrorWithCode,
} from "@react-native-google-signin/google-signin";

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    scopes: ["profile", "email"],
    offlineAccess: false,
  });
};

export interface GoogleSignInResult {
  idToken: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    photo: string | null;
  };
}

export const signInWithGoogle = async (): Promise<GoogleSignInResult> => {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  const response = await GoogleSignin.signIn();

  if (!response.data) {
    throw new Error("Google Sign-In returned no data");
  }

  const { idToken, user } = response.data;

  if (!idToken) {
    throw new Error("No ID token returned from Google Sign-In");
  }

  return {
    idToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      photo: user.photo,
    },
  };
};

export const signOutGoogle = async (): Promise<void> => {
  try {
    await GoogleSignin.signOut();
  } catch (error) {
    console.warn("Google signOut error:", error);
  }
};

export const getGoogleSignInErrorMessage = (error: unknown): string => {
  if (isErrorWithCode(error)) {
    switch (error.code) {
      case statusCodes.SIGN_IN_CANCELLED:
        return "Sign-in was cancelled";
      case statusCodes.IN_PROGRESS:
        return "Sign-in is already in progress";
      case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
        return "Google Play Services not available or outdated";
      default:
        return error.message ?? "Google Sign-In failed";
    }
  }
  return error instanceof Error ? error.message : "An unexpected error occurred";
};
