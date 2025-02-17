import { EventEmitter, Injectable, output } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class VideoService {

    public onPlay = new EventEmitter<void>();
    public onPause = new EventEmitter<void>();
    public onStop = new EventEmitter<void>();

    public onVideoEnded = new EventEmitter<Video>();
    public onVideoTitleUpdated = new EventEmitter<Video>();

    public play() {
        this.onPlay.emit();
    }

    public pause() {
        this.onPause.emit();
    }

    public stop() {
        this.onStop.emit();
    }

    public fireVideoEnded(video: Video) {
        this.onVideoEnded.emit(video);
    }

    public fireVideoTitleUpdated(video: Video) {
        this.onVideoTitleUpdated.emit(video);
    }
}