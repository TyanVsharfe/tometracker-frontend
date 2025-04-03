export function formatDate(dateString: string | undefined): string | undefined {
    if (dateString == undefined)
        return undefined;
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
}

export const getScoreClass = (score: number): string => {
    if (score >= 70) return "review-score high";
    if (score >= 40) return "review-score medium";
    return "review-score low";
};