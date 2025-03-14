export function formatDate(dateString: string | undefined): string {
    dateString = dateString === undefined ? '' : dateString;
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
}