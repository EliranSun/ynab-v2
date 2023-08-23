import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, connectAuthEmulator, signInWithRedirect } from "firebase/auth";

const provider = new GoogleAuthProvider();

export const auth = getAuth();

export const emulateAuth = () =>
  connectAuthEmulator(auth, "http://127.0.0.1:9099");

export const login = async () => {
  try {
    const result = await signInWithRedirect(auth, provider);
    const user = result.user;
    console.info({ user });
    return user;
  } catch (error) {
    console.error(error);
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
    
    return { errorCode, errorMessage, email, credential };
  }
};

export const logout = () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      alert("Logged out");
    })
    .catch((error) => {
      // An error happened.
      console.error(error);
    });
};

