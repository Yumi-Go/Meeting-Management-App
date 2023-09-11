export function useFormat() {
    
    function capitalize(string) {
        if (string) {
            const firstLetter = string[0].toUpperCase();
            const rest = string.slice(1).toLowerCase();
            return firstLetter + rest;
        } else {
            return string;
        }
    }

    function formatFullName(fName, mName, lName) {
        return `${capitalize(fName)} ${capitalize(mName)} ${capitalize(lName)}`;
    }

    return { capitalize, formatFullName }
}