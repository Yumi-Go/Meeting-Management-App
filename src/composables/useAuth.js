import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged,
    signOut,
    EmailAuthProvider,
    GoogleAuthProvider,
    reauthenticateWithCredential,
    updatePassword
} from "firebase/auth";
import { useFirestore } from './useFirestore';

const currentUserInfo = useLocalStorage('currentUser', {});
const currentUser = ref(auth.currentUser);

const { getUserInfoByUID } = useFirestore();

const isUserReAuthenticated = ref(false);
const isPasswordChanged = ref(false);

export function useAuth() {

    function userStateObserver() {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                currentUser.value = user;
                // console.log("current uid: ", user.uid);
                // console.log("current user:", currentUser.value);
                getUserInfoByUID(user.uid)
                .then(info => {
                    currentUserInfo.value = info;
                    // console.log("currentUserInfo.value: ", currentUserInfo.value);
                });
            } else {
                console.log("The logged in user does not exist.");
            }
        });
        // console.log("currentUserInfo: ", currentUserInfo.value);
    }

    function logOut() {
        signOut(auth).then(() => { 
            console.log("Sign Out successful!");
        }).catch((error) => {
            console.log("SignOut Error: ", error);
        });
    }

    function reAuthentication(passwordInput) {
        const user = auth.currentUser;
        const currentProvider = currentUser.value.providerData[0].providerId;
        console.log("provider: ", currentProvider);
        if (currentProvider === "password") {
            const credential = EmailAuthProvider.credential(
                user.email,
                passwordInput
            );
            reauthenticateWithCredential(user, credential)
            .then(() => {
                console.log("User Re-Authenticated successfully!");
                isUserReAuthenticated.value = true;
                console.log("isUserReAuthenticated: ", isUserReAuthenticated.value);
            }).catch((error) => {
                console.log("User Re-Authentication error: ", error);
            });
        } else { // google provider ("google.com")
            const credential = GoogleAuthProvider.credential(
                user.email,
                passwordInput
            );
            console.log("credential: ", credential);
            reauthenticateWithCredential(user, credential)
            .then(() => {
                console.log("User Re-Authenticated successfully!");
            }).catch((error) => {
                console.log("User Re-Authentication error: ", error);
            });
        }
    }

    function changePassword(newPassword) {
        updatePassword(currentUser.value, newPassword)
        .then(() => {
            console.log("Password Updated successfully!!");
            isPasswordChanged.value = true;
        }).catch((error) => {
            console.log("error: ", error);
            isPasswordChanged.value = false;
        });
    }

    return { currentUser, currentUserInfo, isUserReAuthenticated, isPasswordChanged, userStateObserver, logOut, reAuthentication, changePassword }
}
