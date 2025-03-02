export const getVideoIdFromYoutubeUrl = (url: string): string | null => {
    const urlToCheck = url || '';
    const regex = /watch.*?[?&]v=([^&]+)/;
    const match = urlToCheck.match(regex);

    if (match?.[1]) {
        return match[1];
    }

    return getVideoIdFromYoutubeShortUrl(url);
}

export const getVideoIdFromYoutubeShortUrl = (url: string): string | null => {

  const regex = /youtu\.be\/([^?]+)/;
  const match = url.match(regex);

  if (!match?.[1]) {
    return null;
  }

  return match[1];
}