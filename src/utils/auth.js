import {connectAuthEmulator, GoogleAuthProvider, signInWithPopup, signOut} from "firebase/auth";
import {auth} from "./firebase";

const provider = new GoogleAuthProvider();

export const emulateAuth = () =>
    connectAuthEmulator(auth, "http://127.0.0.1:9099");

export const login = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        console.error(error);
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);

        return {errorCode, errorMessage, email, credential};
    }
};

export const logout = () => {
    signOut(auth)
        .then(() => {
            // Sign-out successful.
            console.info("Sign-out successful.");
        })
        .catch((error) => {
            // An error happened.
            console.error(error);
        });
};

