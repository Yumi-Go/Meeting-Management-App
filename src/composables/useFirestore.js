import { ref } from "vue"
import { auth, db } from '../firebaseConfig';
import { collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc,
    query, where, arrayUnion, arrayRemove, serverTimestamp, Timestamp, documentId } from "firebase/firestore";
import { useDateTime } from '../composables/useDateTime'
import { useLocalStorage, StorageSerializers } from '@vueuse/core'

const searchedUsers = useLocalStorage('searchedUsers', []);
const allUsers = ref([]);

export function useFirestore() {
    async function addUser(uid, email) {
        console.log("currentUser in addUser(): ", uid);
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("existing user");
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
                dateOverrides: [] // [{from, until}, {from, until}...]
            });
            console.log("New user added!");
            location.reload();
        }
    }

    async function updateUserInfo(
        fName, mName, lName, organization, department, position, role, location, timezone
    ) {
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
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            // console.log("Document data:", docSnap.data());
            return docSnap.data();
        } else {
            console.log("No such document!");
            return null;
        }
    }

    async function getAllUserInfo() {
        searchedUsers.value = [];
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
            searchedUsers.value.push({...doc.data(), uid: doc.id, selected: false});
        });
        allUsers.value = searchedUsers.value;
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
        console.log("meetingObj before timestamp: ", meetingObj);
        meetingObj.createdAt = Timestamp.fromDate(meetingObj.createdAt);
        console.log("meetingObj after timestamp: ", meetingObj);
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


    //// Inbox
    async function readMessage(senderUid, receiverUid, updatedMeetingRequests) {
        const senderRef = doc(db, "users", senderUid);
        await updateDoc(senderRef, {
            meetingRequestsSent: updatedMeetingRequests
        });
        const receiverRef = doc(db, "users", receiverUid);
        await updateDoc(receiverRef, {
            meetingRequestsReceived: updatedMeetingRequests
        });
    }

    
    //// Availability
    async function updateWeeklyAvailability(days) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
            weeklyAvailability: days
        });
    }

    async function addDateOverrides(overrideObjsArr) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const datesArr = [];
        await overrideObjsArr.forEach(fromUntilTimePair => {
            datesArr.push({
                from: Timestamp.fromDate(fromUntilTimePair[0]),
                until: Timestamp.fromDate(fromUntilTimePair[1])
            });
        });
        await updateDoc(docRef, {
            dateOverrides: datesArr
        });
    }

    async function deleteDateOverrides(fromUntilObj) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
            dateOverrides: arrayRemove({
                from: Timestamp.fromDate(fromUntilObj[0]),
                until: Timestamp.fromDate(fromUntilObj[1])
            })
        });
    }


    //// Calendar
    async function getMeetingByDocID(id) {
        const docRef = doc(db, "meetings", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            // console.log("Document data:", docSnap.data());
            return docSnap.data();
        } else {
            console.log("No such document!");
            return null;
        }
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
        readMessage,
        updateWeeklyAvailability,
        addDateOverrides,
        deleteDateOverrides,
        getMeetingByDocID
    }
}