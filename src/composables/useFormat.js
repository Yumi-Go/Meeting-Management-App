export function useFormat() {
    
    function capitalize(string) {
        if (string.length > 0) {
            const firstLetter = string[0].toUpperCase();
            const rest = string.slice(1).toLowerCase();
            return firstLetter + rest;
        } else {
            return string;
        }
    }

    // function formatDate(startEndDates) {
    //     const result = [];
    //     console.log("startEndDates before formatting: ", startEndDates);
    //     startEndDates.forEach(date => {
    //         if (date !== null) {
    //             // const day = date.getDate();
    //             // const month = date.getMonth() + 1;
    //             // const year = date.getFullYear();
    //             const tzOffset = date.getTimezoneOffset() * 60 * 1000;
    //             result.push(new Date(date - tzOffset).toISOString().split('T')[0]);
    //         } else {
    //             result.push(date);
    //         }
    //     });
    //     console.log("result: ", result);
    //     return result;
    // }

    return { capitalize }
}