import { ref } from 'vue'
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

const currentUID = ref(null);
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

    return { currentUID, emailSignUp, emailSignIn, userStateObserver, logOut }
}
