import { ref } from "vue"
import { auth, db } from '../firebaseConfig';
import { collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc,
    query, where, arrayUnion, arrayRemove, Timestamp } from "firebase/firestore";
import { useLocalStorage } from '@vueuse/core'

const searchedUsers = useLocalStorage('searchedUsers', []);
const allUsers = ref([]);

export function useFirestore() {
    async function addUser(uid, email) {
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
                meetings: [], // meeting ID list (linked to meetings collection)
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
            fName: fName ? fName.toLowerCase() : fName,
            mName: mName ? mName.toLowerCase() : mName,
            lName: lName ? lName.toLowerCase() : lName,
            organization: organization,
            department: department,
            position: position,
            role: role,
            location: location,
            timezone: timezone
        });
    }

    async function getUserInfoByUID(uid) {
        console.log("uid: ", uid);
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
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

    //// Meeting
    async function requestMeeting(meetingObj) {
        meetingObj.createdAt = Timestamp.fromDate(meetingObj.createdAt);
        const senderRef = doc(db, "users", meetingObj.sender);
        const receiverRef = doc(db, "users", meetingObj.receiver);
        const senderDocRef_meetingsSent = await addDoc(collection(senderRef, "meetingsSent"), meetingObj);
        const receiverSubColRef_meetingsReceived = doc(receiverRef, "meetingsReceived", senderDocRef_meetingsSent.id);
        await setDoc(receiverSubColRef_meetingsReceived, meetingObj, { merge: true });

    }

    async function getSentMeetingRequests(uid) {
        const sentMeetingRequests = [];
        const querySnapshot = await getDocs(collection(db, `users/${uid}/meetingsSent`));
        querySnapshot.forEach((doc) => {
            sentMeetingRequests.push({...doc.data(), id: doc.id});
        });
        return sentMeetingRequests;
    }

    async function getReceivedMeetingRequests(uid) {
        const receivedMeetingRequests = [];
        const querySnapshot = await getDocs(collection(db, `users/${uid}/meetingsReceived`));
        querySnapshot.forEach((doc) => {
            receivedMeetingRequests.push({...doc.data(), id: doc.id});
        });
        return receivedMeetingRequests;
    }

    async function acceptMeetingRequest(meetingObj) {
        await refuseMeetingRequest(meetingObj);
        const docId = meetingObj.id;
        delete meetingObj.id;
        await setDoc(doc(db, "meetings", docId), meetingObj);
    }

    async function refuseMeetingRequest(meetingObj) {
        await deleteDoc(doc(db, "users", meetingObj.sender, "meetingsSent", meetingObj.id));
        await deleteDoc(doc(db, "users", meetingObj.receiver, "meetingsReceived", meetingObj.id));
    }


    //// Inbox
    async function markRead(request) {
        const senderRef = doc(db, "users", request.sender, "meetingsSent", request.id);
        const receiverRef = doc(db, "users", request.receiver, "meetingsReceived", request.id);
        await updateDoc(senderRef, {
            isRead: true
        });
        await updateDoc(receiverRef, {
            isRead: true
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
        requestMeeting,
        getSentMeetingRequests,
        getReceivedMeetingRequests,
        acceptMeetingRequest,
        refuseMeetingRequest,
        markRead,
        updateWeeklyAvailability,
        addDateOverrides,
        deleteDateOverrides,
        getMeetingByDocID
    }
}