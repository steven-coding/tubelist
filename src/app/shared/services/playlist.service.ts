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

    updateVideoTitle(updatedVideo: Video) {
        const currentList = this.playlist();
        
        const index = currentList.findIndex(video => video.id === updatedVideo.id);
        
        if (index !== -1) {

            const videoToUpdate = {
                ...currentList[index],
                title: updatedVideo.title
            };
            
            const updatedList = [...currentList];
            updatedList[index] = videoToUpdate;
            
            this.playlist.set(updatedList);
        }
    }
}