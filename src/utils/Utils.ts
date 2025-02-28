export const shortTitle = (title: string) => {
    const words = title.split(' ');
    let shortenedTitle = title;

    while (shortenedTitle.length > 42 && words.length > 1) {
        words.pop();
        shortenedTitle = words.join(' ');
    }

    return shortenedTitle;
};

export function formatDate(dateString: string | undefined): string {
    dateString = dateString === undefined ? '' : dateString;
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
}