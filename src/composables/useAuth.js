import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core';
import { useRouter } from 'vue-router'
import { auth } from '../firebaseConfig';
import { onAuthStateChanged,
    signOut,
    EmailAuthProvider,
    GoogleAuthProvider,
    reauthenticateWithCredential,
    updatePassword
} from "firebase/auth";
import { useFirestore } from './useFirestore';
import { useDateTime } from './useDateTime';

const currentUserInLocalStorage = useLocalStorage('currentUser', {});
const currentUser = ref(auth.currentUser);

const { getUserInfoByUID, getSentMeetingRequests, getReceivedMeetingRequests, } = useFirestore();
const { dateWithTimezone } = useDateTime();

const isUserReAuthenticated = ref(false);
const isPasswordChanged = ref(false);

export function useAuth() {

    const router = useRouter();

    function userStateObserver() {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                currentUser.value = user;
                getUserInfoByUID(user.uid)
                .then(info => {
                    // console.log("info: ", info);
                    if (info.dateOverrides.length > 0) {
                        info.dateOverrides.forEach(fromUntilPairObj => {
                            fromUntilPairObj.from = dateWithTimezone(fromUntilPairObj.from.toDate());
                            fromUntilPairObj.until = dateWithTimezone(fromUntilPairObj.until.toDate());
                        });
                    }
                    currentUserInLocalStorage.value = info;
                    getSentMeetingRequests(user.uid)
                    .then(requests => {
                        console.log("requests sent: ", requests);
                        if (requests.length > 0) {
                            requests.forEach(request => {
                                request.createdAt = request.createdAt.toDate();
                            });
                        }
                        currentUserInLocalStorage.value['meetingsSent'] = requests;
                    });
                    getReceivedMeetingRequests(user.uid)
                    .then(requests => {
                        console.log("requests received: ", requests);
                        if (requests.length > 0) {
                            requests.forEach(request => {
                                request.createdAt = request.createdAt.toDate();
                            });
                        }
                        currentUserInLocalStorage.value['meetingsReceived'] = requests;
                    });
                });
            } else {
                console.log("The logged in user does not exist.");
            }
        });
    }

    function logOut() {
        signOut(auth).then(() => {
            currentUserInLocalStorage.value = [];
            currentUser.value = [];
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

    function requiredInfoCheck() {
        userStateObserver();
        if (currentUserInLocalStorage.value) {
            if (currentUserInLocalStorage.value.fName === "" || currentUserInLocalStorage.value.lName === "") {
                alert("Please enter your information (at least the first name and last name are required)");
                router.push('/account');
            }
        }

    }

    return {
        currentUser,
        currentUserInLocalStorage,
        isUserReAuthenticated,
        isPasswordChanged,
        userStateObserver,
        logOut,
        reAuthentication,
        changePassword,
        requiredInfoCheck
    }
}
