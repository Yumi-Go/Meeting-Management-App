import { ref } from 'vue'
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useFirestore } from './useFirestore';

const { addUser } = useFirestore();
const currentUID = ref(null);

export function useAuth() {

    function userStateObserver() {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                currentUID.value = user.uid;
                addUser(user.uid, user.email);
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

    return { currentUID, userStateObserver, logOut }
}
