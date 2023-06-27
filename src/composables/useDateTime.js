export function useDateTime() {
    
    function formatDate(date) {
        const tzOffset = date.getTimezoneOffset() * 60 * 1000;
        return new Date(date.getTime() - tzOffset).toISOString().split('T')[0];;
    }

    return { formatDate }
}