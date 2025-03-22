export function formatDate(dateString: string | undefined): string | undefined {
    if (dateString == undefined)
        return undefined;
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
}