import { ref } from "vue"
import { auth, db } from '../firebaseConfig';
import { collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc,
    query, where, arrayUnion, arrayRemove, serverTimestamp, Timestamp } from "firebase/firestore";
import { useDateTime } from '../composables/useDateTime'
import { useLocalStorage, StorageSerializers } from '@vueuse/core'

// const searchedUsersInfo = useLocalStorage('searchedUsers', []);
const { formatDate } = useDateTime();
const userSearchResult = ref([]);

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
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
        //   console.log("Document data:", docSnap.data());
          return docSnap.data();
        } else {
          console.log("No such document!");
        //   return null;
        }
    }

    async function getAllUserInfo() {
        userSearchResult.value = [];
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
            // console.log(doc.id, " => ", doc.data());
            const docObj = doc.data();
            docObj['uid'] = doc.id;
            userSearchResult.value.push(docObj);
        });
        console.log("result all users in useFirestore: ", userSearchResult.value);
    }

    async function getUserInfoByName(name) {
        userSearchResult.value = [];
        const fNameQuery = query(collection(db, "users"), where("fName", "==", name));
        const mNameQuery = query(collection(db, "users"), where("mName", "==", name));
        const lNameQuery = query(collection(db, "users"), where("lName", "==", name));
        const queries = [fNameQuery, mNameQuery, lNameQuery];
        queries.forEach(async (query) => {
            const querySnapshot = await getDocs(query);
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
                const docObj = doc.data();
                docObj['uid'] = doc.id;
                userSearchResult.value.push(docObj);
            });
        });
        console.log("result by name in useFirestore: ", userSearchResult.value);
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
            meetingRequestsSent: arrayUnion(meetingObj)
        });
        const receiverRef = doc(db, "users", receiverUid);
        await updateDoc(receiverRef, {
            meetingRequestsReceived: arrayUnion(meetingObj)
        });
    }

    async function acceptMeetingRequest(senderUid, receiverUid, meetingObj) {
        const senderRef = doc(db, "users", senderUid);
        await updateDoc(senderRef, {
            meetings: arrayUnion(meetingObj.id),
            meetingRequestsSent: arrayRemove(meetingObj)
        });
        const receiverRef = doc(db, "users", receiverUid);
        await updateDoc(receiverRef, {
            meetings: arrayUnion(meetingObj.id),
            meetingRequestsReceived: arrayRemove(meetingObj)
        });

        const meetingRef = await addDoc(collection(db, "meetings"), {
            status: '', // Boolean, Default: false(Pending), Only Accepted meetings(=true) are displayed on the calendar
            title: '',
            link: '',
            location: '',
            type: true, // Boolean, Default: true(internal), internal(=true, via this app) / external(=false, from external platform such as Google Calendar or manually added meetings)
            category: '',
            organizer: [],
            participants: [],
            start: '',
            end: '',
            duration: 0,
            timezone: '',
            etc: []
        });
    }

    function refuseMeetingRequest(senderUid, receiverUid, meeting) {

    }






    // Inbox
    // 이거 여기에서 직접 말고, 로컬스토리지에서 꺼내오면 될듯. 그거 다 해결되면 이 두 펑션 지우기
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
        userSearchResult,
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