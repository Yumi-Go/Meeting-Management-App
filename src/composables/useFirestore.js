import { ref } from 'vue'
import { auth, db } from '../firebaseConfig';
import { collection, doc, getDoc, setDoc, addDoc, updateDoc } from "firebase/firestore";


export function useFirestore() {

    const user = auth.currentUser;

    async function addUser(uid, email) {
        console.log("currentUser in addUser(): ", uid);
        const docRef = await setDoc(doc(db, "users", uid), {
            email: email,
        });
    }

    async function updateUserInfo(
        fName, mName, lName, organization, department, position, role, location, timezone
    ) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
            fName: fName,
            mName: mName,
            lName: lName,
            organization: organization,
            department: department,
            position: position,
            role: role,
            location: location,
            timezone: timezone,
        });
    }

    async function getUserInfo() {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          return docSnap.data();
        } else {
          console.log("No such document!");
          return null;
        }
    }

    return {
        addUser,
        updateUserInfo,
        getUserInfo
    }

}