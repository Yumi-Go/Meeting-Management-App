import { ref } from "vue"
import { auth, db } from '../firebaseConfig';
import { collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc,
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

    //// Meeting
    async function requestMeeting(senderUid, receiverUid, meetingObj) {
        console.log("meetingObj before timestamp: ", meetingObj);
        meetingObj.createdAt = Timestamp.fromDate(meetingObj.createdAt);
        console.log("meetingObj after timestamp: ", meetingObj);

        const senderRef = doc(db, "users", senderUid);
        const receiverRef = doc(db, "users", receiverUid);

        await updateDoc(senderRef, {
            meetingRequestsSent: arrayUnion({[receiverUid]: meetingObj})
        });
        await updateDoc(receiverRef, {
            meetingRequestsReceived: arrayUnion({[senderUid]: meetingObj})
        });
        
        const senderDocRef_meetingsSent = await addDoc(collection(senderRef, "meetingsSent"), meetingObj);
        console.log("sender_meetingsSent.id: ", senderDocRef_meetingsSent.id);

        const receiverSubColRef_meetingsReceived = doc(receiverRef, "meetingsReceived", senderDocRef_meetingsSent.id);
        await setDoc(receiverSubColRef_meetingsReceived, meetingObj, { merge: true });

    }

    async function acceptMeetingRequest(senderUid, receiverUid, meetingObj) {
        console.log("senderUid: ", senderUid);
        console.log("receiverUid: ", receiverUid);
        console.log("meetingObj: ", meetingObj);
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
        console.log("senderUid, receiverUid, meetingObj: ", senderUid, receiverUid, meetingObj);
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
    async function markRead(senderUid, receiverUid, allRequestsReceivedUpdated, singleRequestSent_beforeUpdated, singleRequestSent_updated) {

        console.log("singleRequestSent_beforeUpdated: ", singleRequestSent_beforeUpdated);
        // console.log("singleRequestSent_updated: ", singleRequestSent_updated);

        let dateParsed = null;
        allRequestsReceivedUpdated.forEach(requestObj => {
            // console.log("Object.values(request)[0].createdAt: ", Object.values(requestObj)[0].createdAt);
            // console.log("typeof Object.values(request)[0].createdAt: ", typeof Object.values(requestObj)[0].createdAt);
            dateParsed = new Date(Object.values(requestObj)[0].createdAt);
            Object.values(requestObj)[0].createdAt = Timestamp.fromDate(dateParsed);
        });
        console.log("allRequestsReceivedUpdated: ", allRequestsReceivedUpdated);

        singleRequestSent_beforeUpdated.createdAt = new Timestamp(singleRequestSent_beforeUpdated.createdAt.seconds, singleRequestSent_beforeUpdated.createdAt.nanoseconds);
        // console.log("singleRequestSent_beforeUpdate: ", singleRequestSent_beforeUpdated);

        // singleRequestSent_updated.createdAt = new Timestamp(singleRequestSent_updated.createdAt.seconds, singleRequestSent_updated.createdAt.nanoseconds);
        // console.log("singleRequestSent_updated: ", singleRequestSent_updated);
        
        // const singleRequestSent_beforeUpdated = () => {
        //     const result = singleRequestSent_updated;
        //     result.isRead = false;
        //     return result;
        // }

        const receiverRef = doc(db, "users", receiverUid);
        await updateDoc(receiverRef, {
            meetingRequestsReceived: allRequestsReceivedUpdated
        });
        const senderRef = doc(db, "users", senderUid);
        await updateDoc(senderRef, {
            meetingRequestsSent: arrayRemove({[receiverUid]: singleRequestSent_beforeUpdated})
        });

        singleRequestSent_beforeUpdated.isRead = true;
        console.log("changed singleRequestSent_beforeUpdated: ", singleRequestSent_beforeUpdated);
        await updateDoc(senderRef, {
            meetingRequestsSent: arrayUnion({[receiverUid]: singleRequestSent_beforeUpdated})
        });
    }
    // async function markRead_receivedRequestsArr(senderUid, receiverUid, updatedRequestsReceived, singleRequestSentBeforeUpdate, singleRequestSentAfterUpdate) {
    //     // const senderRef = doc(db, "users", senderUid);
    //     // await updateDoc(senderRef, {
    //     //     meetingRequestsSent: updatedMeetingRequestsSent
    //     // });
    //     const receiverRef = doc(db, "users", receiverUid);
    //     await updateDoc(receiverRef, {
    //         meetingRequestsReceived: updatedRequestsReceived
    //     });
    // }

    // async function markRead_singleSentRequest(senderUid, receiverUid, singleRequestSentBeforeUpdate, singleRequestSentAfterUpdate) {
    //     const senderRef = doc(db, "users", senderUid);
    //     await updateDoc(senderRef, {
    //         meetingRequestsSent: arrayRemove({[receiverUid]: singleRequestSentBeforeUpdate})
    //     });
    //     await updateDoc(senderRef, {
    //         meetingRequestsSent: arrayUnion({[receiverUid]: singleRequestSentAfterUpdate})
    //     });
    // }

    
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
        acceptMeetingRequest,
        refuseMeetingRequest,
        markRead,
        updateWeeklyAvailability,
        addDateOverrides,
        deleteDateOverrides,
        getMeetingByDocID
    }
}