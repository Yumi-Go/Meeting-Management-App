export function useDateTime() {
    
    function formatDate(date) {
        const result = [];
        console.log("date before formatting: ", date);        
        // const day = date.getDate();
        // const month = date.getMonth() + 1;
        // const year = date.getFullYear();
        const tzOffset = date.getTimezoneOffset() * 60 * 1000;
        // console.log("new Date(date - tzOffset)", new Date(date - tzOffset));
        result.push(new Date(date - tzOffset).toISOString().split('T')[0]);
        console.log("formatDate result in useDateTime(): ", result);
        return result;
    }

    function getDay(date) {
        console.log("date in getDay: ", date[0]);
        const tzOffset = date[0].getTimezoneOffset() * 60 * 1000;
        const result = new Date(date[0] - tzOffset).getDate();
        console.log("getDay result: ", result);
        return result;
    }

    function getMonth(date) {
        const tzOffset = date.getTimezoneOffset() * 60 * 1000;
        const result = new Date(date - tzOffset).date.getMonth() + 1;
        console.log("getMonth result: ", result);
        return result;
    }

    function getYear(date) {
        const tzOffset = date.getTimezoneOffset() * 60 * 1000;
        const result = new Date(date - tzOffset).date.getFullYear();
        console.log("getFullYear result: ", result);
        return result;
    }

    return { formatDate, getDay, getMonth, getYear }
}