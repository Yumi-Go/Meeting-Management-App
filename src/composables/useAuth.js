import { ref } from 'vue'
import { auth, db } from '../firebaseConfig';
import {
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "firebase/auth";
import { useFirestore } from './useFirestore';

const provider = new GoogleAuthProvider();

const { addUser } = useFirestore();
const currentUID = ref(null);

export function useAuth() {

    function googleSignIn() {
        signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            console.log("googleSignIn User: ", user);
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
        });
    }

    function emailSignUp(email, password) {
        console.log("signUpWithEmail: ");
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
            console.log("user.uid: ", user.uid);
            addUser(user.uid);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log('SignUp Error code: ', errorCode);
            console.log('SignUp Error Message: ', errorMessage);
        });
    }

    function emailSignIn(email, password) {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log('SignIn Error code: ', errorCode);
            console.log('SignIn Error Message: ', errorMessage);
          });
    }

    function userStateObserver() {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                currentUID.value = user.uid;
            } else {
            }
        });
        console.log("currentUID: ", currentUID.value);
    }

    function logOut() {
        signOut(auth).then(() => { 
            console.log("Sign Out successful!");
        }).catch((error) => {
            console.log("SignOut Error: ", error);
        });
    }

    return { currentUID, googleSignIn, emailSignUp, emailSignIn, userStateObserver, logOut }
}
