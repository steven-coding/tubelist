import { moveItemInArray } from "@angular/cdk/drag-drop";
import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class PlaylistService {
    public playlist = signal<Video[]>([]);

    constructor() {}

    moveVideo(moveFromIndex: number, moveToIndex: number) {
        moveItemInArray(this.playlist(), moveFromIndex, moveToIndex);
    }

    addById(videoId: string) {
        const currentList: Video[] = [... this.playlist()];
        currentList.push({
            id: videoId
        } as Video);

        this.playlist.set(currentList)
    }

    setPlaylist(video: Video[]): void {
        this.playlist.set([... video]);
    }
}