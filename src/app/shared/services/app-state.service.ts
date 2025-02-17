import { inject, Injectable, signal, Signal } from "@angular/core";
import { PlaylistService } from "./playlist.service";
import { VideoService } from "./video.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Injectable({
    providedIn: 'root'
})
export class AppStateService {

    private playlistService = inject(PlaylistService);
    private videoService = inject(VideoService);

    public readonly selectedVideo = signal<Video | undefined>(undefined);

    constructor() {
        this.videoService.onVideoEnded
            .pipe(
                takeUntilDestroyed()
            ).subscribe((video) => {
                this.handleVideoPlayEnded(video);
            });
    }

    public selectVideo(video: Video) {
        this.selectedVideo.set(video);
    }

    public selectFirstVideo() {
        this.selectVideo(
            this.playlistService.playlist()[0]
        );
    }

    public selectNextVideo() {
        const index = this.playlistService.playlist()
            .findIndex((vid) => vid.id === this.selectedVideo()?.id);

        this.selectVideo(
            this.playlistService.playlist()[index+1]
        );
    }

    public selectNextVideoTo(video: Video) {
        const index = this.playlistService.playlist()
            .findIndex((vid) => vid.id === video?.id);

        this.selectVideo(
            this.playlistService.playlist()[index+1]
        );
    }

    public handleVideoPlayEnded(video: Video) {
        this.selectNextVideoTo(video);
    }
}