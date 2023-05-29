import { ref } from 'vue'
import { auth, db } from '../firebaseConfig';
import { collection, doc, getDoc, setDoc, addDoc } from "firebase/firestore";

const fName = ref('');
const mName = ref('');
const lName = ref('');
const organization = ref('');
const department = ref('');
const position = ref('');
const role = ref('');
const location = ref('');
const timezone = ref('');
const email = ref('');

export function useFirestore() {

    async function addUser(uid) {
        const user = auth.currentUser;
        console.log("new user: ", user.uid);
        const docRef = await setDoc(doc(db, "users", uid), {
            name: [fName.value, mName.value, lName.value],
            organization: organization.value,
            department: department.value,
            position: position.value,
            role: role.value,
            location: location.value,
            timezone: timezone.value,
            email: email.value,
        });
    }

    return {
        addUser,
        fName,
        mName,
        lName,
        organization,
        department,
        position,
        role,
        location,
        timezone,
        email,
    }

}