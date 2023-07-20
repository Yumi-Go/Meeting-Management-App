import { ref } from "vue"
import { auth, db } from '../firebaseConfig';
import { collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc,
    query, where, arrayUnion, arrayRemove, serverTimestamp, Timestamp, documentId } from "firebase/firestore";
import { useDateTime } from '../composables/useDateTime'
import { useLocalStorage, StorageSerializers } from '@vueuse/core'

const { formatDate } = useDateTime();
const searchedUsers = useLocalStorage('searchedUsers', []);
const userById = useLocalStorage('userById', {});
const allUsers = ref([]);

export function useFirestore() {
    async function addUser(uid, email) {
        console.log("currentUser in addUser(): ", uid);
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("existing user");
            console.log("existing user data:", docSnap.data());
        } else {
            await setDoc(docRef, {
                email: email,
                fName: "",
                mName: "",
                lName: "",
                organization: "",
                department: "",
                position: "",
                role: "",
                location: "",
                timezone: "",
                connections: [],
                connectionRequestsSent: [],
                connectionRequestsReceived: [],
                meetings: [], // meeting ID list (linked to meetings collection)
                meetingRequestsSent: [],
                meetingRequestsReceived: [],
                weeklyAvailability: {
                    monday: null,
                    tuesday: null,
                    wednesday: null,
                    thursday: null,
                    friday: null,
                    saturday: null,
                    sunday: null
                }, // index 0~6 = mon~sun
                dateOverrides: [] // [{from(e.g. 31052023(31th May, 2023)), until}, {from, until}...]
            });
            console.log("New user added!");
            location.reload();
        }
    }

    async function updateUserInfo(
        fName, mName, lName, organization, department, position, role, location, timezone
    ) {
        console.log("uid of currentUser: ", auth.currentUser.uid);
        const userRef = doc(db, "users", auth.currentUser.uid);
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
        userById.value = {};
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
        //   console.log("Document data:", docSnap.data());
            userById.value = docSnap.data();
            console.log("userById: ", userById.value);
        //   return docSnap.data();
        } else {
          console.log("No such document!");
        //   return null;
        }
        return userById.value;
    }

    async function getAllUserInfo() {
        searchedUsers.value = [];
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
            searchedUsers.value.push({...doc.data(), uid: doc.id, selected: false});
        });
        console.log("result all users in useFirestore: ", searchedUsers.value);
        allUsers.value = searchedUsers.value;
        console.log("allUsers: ", allUsers.value);
        // return searchedUsers.value;
    }

    async function getUserInfoByName(name) {
        const userDocRef = collection(db, "users");
        const fNameRef = query(userDocRef, where("fName", "==", name));
        const mNameRef = query(userDocRef, where("mName", "==", name));
        const lNameRef = query(userDocRef, where("lName", "==", name));
        const queries = [fNameRef, mNameRef, lNameRef];
        // const users = [];
        searchedUsers.value = [];
        queries.forEach(async (query) => {
            const querySnapshot = await getDocs(query);
            querySnapshot.forEach((doc) => {
                searchedUsers.value.push({...doc.data(), uid: doc.id, selected: false});
            });
        });
        console.log("result by name in useFirestore: ", searchedUsers.value);
        // return searchedUsers.value;
   }

   
    //// Connection
    async function requestConnection(senderUid, receiverUid) {
        const senderRef = doc(db, "users", senderUid);
        await updateDoc(senderRef, {
            connectionRequestsSent: arrayUnion(receiverUid)
        });
        const receiverRef = doc(db, "users", receiverUid);
        await updateDoc(receiverRef, {
            connectionRequestsReceived: arrayUnion(senderUid)
        });
    }

    async function acceptConnection(senderUid, receiverUid) {
        const senderRef = doc(db, "users", senderUid);
        await updateDoc(senderRef, {
            connection: arrayUnion(receiverUid),
            connectionRequestsSent: arrayRemove(receiverUid)
        });
        const receiverRef = doc(db, "users", receiverUid);
        await updateDoc(receiverRef, {
            connection: arrayUnion(senderUid),
            connectionRequestsReceived: arrayRemove(senderUid)
        });
    }

    async function refuseConnection(senderUid, receiverUid) {
        const senderRef = doc(db, "users", senderUid);
        await updateDoc(senderRef, {
            connectionRequestsSent: arrayRemove(receiverUid)
        });
        const receiverRef = doc(db, "users", receiverUid);
        await updateDoc(receiverRef, {
            connectionRequestsReceived: arrayRemove(senderUid)
        });
    }


    //// Meeting
    async function requestMeeting(senderUid, receiverUid, meetingObj) {
        console.log("meetingObj: ", meetingObj);
        const senderRef = doc(db, "users", senderUid);
        await updateDoc(senderRef, {
            meetingRequestsSent: arrayUnion({[receiverUid]: meetingObj})
        });
        const receiverRef = doc(db, "users", receiverUid);
        await updateDoc(receiverRef, {
            meetingRequestsReceived: arrayUnion({[senderUid]: meetingObj})
        });
    }

    async function acceptMeetingRequest(senderUid, receiverUid, meetingObj) {
        const meetingRef = await addDoc(collection(db, "meetings"), meetingObj);
        console.log("meeting doc written with ID: ", meetingRef.id);

        const senderRef = doc(db, "users", senderUid);
        await updateDoc(senderRef, {
            meetings: arrayUnion(meetingRef.id),
            meetingRequestsSent: arrayRemove({[receiverUid]: meetingObj})
        });
        const receiverRef = doc(db, "users", receiverUid);
        await updateDoc(receiverRef, {
            meetings: arrayUnion(meetingRef.id),
            meetingRequestsReceived: arrayRemove({[senderUid]: meetingObj})
        });
    }

    async function refuseMeetingRequest(senderUid, receiverUid, meetingObj) {
        const senderRef = doc(db, "users", senderUid);
        await updateDoc(senderRef, {
            meetingRequestsSent: arrayRemove({[receiverUid]: meetingObj})
        });
        const receiverRef = doc(db, "users", receiverUid);
        await updateDoc(receiverRef, {
            meetingRequestsReceived: arrayRemove({[senderUid]: meetingObj})
        });
    }






    // Inbox
    async function getAllReceivedList(receiverUid) {
        const docRef = doc(db, "users", receiverUid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          return docSnap.data();
        } else {
          console.log("No such document!");
        //   return null;
        }
    }
    function getAllSentList(senderUid) {


    }

    // async function getUserInfoByUID(uid) {
    //     const docRef = doc(db, "users", uid);
    //     const docSnap = await getDoc(docRef);
    //     if (docSnap.exists()) {
    //     //   console.log("Document data:", docSnap.data());
    //       return docSnap.data();
    //     } else {
    //       console.log("No such document!");
    //     //   return null;
    //     }
    // }

    // async function getAllUserInfo() {
    //     searchedUsers.value = [];
    //     const querySnapshot = await getDocs(collection(db, "users"));
    //     querySnapshot.forEach((doc) => {
    //         searchedUsers.value.push({...doc.data(), uid: doc.id, selected: false});
    //     });
    //     console.log("result all users in useFirestore: ", searchedUsers.value);
    //     allUsers.value = searchedUsers.value;
    //     console.log("allUsers: ", allUsers.value);
    //     // return searchedUsers.value;
    // }





















    // Availability
    async function updateWeeklyAvailability(days) {
        console.log("days in updateWeeklyAvailability: ", days);
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
            weeklyAvailability: days
        });
    }

    async function addDateOverrides(overrideObjsArr) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        await overrideObjsArr.forEach(fromUntilTimePair => {
            // console.log("fromUntilTimePair: ", fromUntilTimePair);
            updateDoc(docRef, {
                dateOverrides: arrayUnion(
                    {
                        from: Timestamp.fromDate(fromUntilTimePair[0]),
                        until: Timestamp.fromDate(fromUntilTimePair[1])
                    }
                )
            });
        });
    }

    return {
        allUsers,
        addUser,
        updateUserInfo,
        getUserInfoByUID,
        getAllUserInfo,
        getUserInfoByName,
        requestConnection,
        acceptConnection,
        refuseConnection,
        requestMeeting,
        acceptMeetingRequest,
        refuseMeetingRequest,
        updateWeeklyAvailability,
        addDateOverrides
    }
}