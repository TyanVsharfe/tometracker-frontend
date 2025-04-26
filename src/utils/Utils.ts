export function formatDate(dateString: string | undefined): string | undefined {
    if (dateString === undefined) {
        return undefined;
    }

    const parts = dateString.split('-');

    if (parts.length === 1) {
        return `${parts[0]}`;
    }

    if (parts.length === 2) {
        return `${parts[1]}.${parts[0]}`;
    }

    if (parts.length === 3) {
        const [year, month, day] = parts;
        return `${day}.${month}.${year}`;
    }

    return undefined;
}

export const getScoreClass = (score: number): string => {
    if (score >= 70) return "review-score high";
    if (score >= 40) return "review-score medium";
    return "review-score low";
};