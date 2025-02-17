import { effect, inject, Injectable } from "@angular/core";
import { PlaylistService } from "./playlist.service";


const updateUrlParam = (key: string, value: string): void => {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value); // Setzt oder ersetzt den Parameter
    window.history.replaceState({}, '', url.toString());
}

const getUrlParam = (key: string): string | null => {
    const url = new URL(window.location.href);
    return url.searchParams.get(key);
}


export interface UrlPlaylist {
    v: string[]
}

@Injectable({
    providedIn: 'root'
})
export class PlaylistToUrlService {

    private playlistService = inject(PlaylistService);

    constructor() {

        const urlPlaylist: UrlPlaylist = PlaylistToUrlService.getPlaylistFromUrl();
        
        if(urlPlaylist.v.length > 0) {
            this.playlistService.setPlaylist(
                urlPlaylist.v.map(entry => {
                    return {
                        id: entry
                    } as Video;
                })
            );
        }
        
        effect(() => {
            const urlPlaylist = PlaylistToUrlService.createUrlQueryByPlaylist(
                this.playlistService.playlist()
            );

            PlaylistToUrlService.setPlaylistToUrl(urlPlaylist);
        });
    }


    private static createUrlQueryByPlaylist(list: Video[]): UrlPlaylist {
        const urlPlaylist: UrlPlaylist = {v: []};

        for(const video of list) {
            urlPlaylist.v.push(video.id+'');
        }

        return urlPlaylist;
    }

    private static setPlaylistToUrl(list: UrlPlaylist) {
        updateUrlParam('list', JSON.stringify(list.v));
    }

    private static getPlaylistFromUrl(): UrlPlaylist {
        const result: UrlPlaylist = {
            v: []
        };
        const urlPlaylist: string | null = getUrlParam('list');
        if(urlPlaylist) {
            const v: string[] = JSON.parse(urlPlaylist);

            result.v = [... v];
        }

        return result;
    }


}