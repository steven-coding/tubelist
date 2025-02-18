export const getVideoIdFromYoutubeUrl = (url: string): string | null => {
    const urlToCheck = url || '';
    const regex = /watch\?v=([^&]+)/;
    const match = urlToCheck.match(regex);

    if (!match?.[1]) {
        return null;
    }

    const videoId = match[1];

    return videoId;
}