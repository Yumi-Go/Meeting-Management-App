import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

export function useAuth() {

    function emailSignUp(email, password) {
        console.log("signUpWithEmail: ");
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
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

    function logOut() {
        signOut(auth).then(() => { 
            console.log("Sign Out successful!");
        }).catch((error) => {
            console.log("SignOut Error: ", error);
          });

    }

    return { emailSignUp, emailSignIn, logOut }
}
