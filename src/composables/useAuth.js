import { ref } from 'vue'
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, signOut, updatePassword } from "firebase/auth";

const currentUID = ref(null);

export function useAuth() {

    function userStateObserver() {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                currentUID.value = user.uid;
            } else {
                console.log("The logged in user does not exist.");
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

    function changePassword(newPassword) {
        const user = auth.currentUser;
        updatePassword(user, newPassword).then(() => {
            console.log("Password Updated successfully!!");
        }).catch((error) => {
            console.log("error: ", error);
        });
    }

    return { currentUID, userStateObserver, logOut, changePassword }
}
