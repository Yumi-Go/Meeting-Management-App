import { ref } from 'vue'
import { auth, db } from '../firebaseConfig';
import { collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, query, where } from "firebase/firestore";

const searchResult = ref([]);

export function useFirestore() {

    const user = auth.currentUser;

    async function addUser(uid, email) {
        console.log("currentUser in addUser(): ", uid);
        const docRef = await setDoc(doc(db, "users", uid), {
            email: email,
            connection: []
        });
    }

    async function updateUserInfo(
        fName, mName, lName, organization, department, position, role, location, timezone
    ) {
        console.log("uid of user: ", user.uid);
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
            fName: fName.length > 0 ? fName.toLowerCase() : fName,
            mName: mName.length > 0 ? mName.toLowerCase() : mName,
            lName: lName.length > 0 ? lName.toLowerCase() : lName,
            organization: organization,
            department: department,
            position: position,
            role: role,
            location: location,
            timezone: timezone
        });
    }

    async function getUserInfoByUID(uid) {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          return docSnap.data();
        } else {
          console.log("No such document!");
        //   return null;
        }
    }

    async function getAllUserInfo() {
        searchResult.value = [];
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            searchResult.value.push(doc.data());
        });
        console.log("allUsers in useFirestore: ", searchResult.value);
    }

    async function getUserInfoByName(name) {
        // const result = [];
        searchResult.value = [];
        const fNameQuery = query(collection(db, "users"), where("fName", "==", name));
        const mNameQuery = query(collection(db, "users"), where("mName", "==", name));
        const lNameQuery = query(collection(db, "users"), where("lName", "==", name));

        const queries = [fNameQuery, mNameQuery, lNameQuery];

        queries.forEach(async (query) => {
            const querySnapshot = await getDocs(query);
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
                searchResult.value.push(doc.data());
            });
        });
        // console.log("searchResult in useFirestore: ", searchResult.value);
        // return result;
    }

    function addConnection(uid) {

    }

    function requestMeeting() {

    }

    function acceptMeetingRequest() {

    }

    function rejectMeetingRequest() {

    }

    return {
        searchResult,
        addUser,
        updateUserInfo,
        getUserInfoByUID,
        getAllUserInfo,
        getUserInfoByName,
        addConnection,
        requestMeeting,
        acceptMeetingRequest,
        rejectMeetingRequest
    }
}