import { AfterViewInit, Component, computed, ElementRef, inject, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SafePipe } from '../shared/pipes/safe.pipe';
import { AppStateService } from '../shared/services/app-state.service';
import { VideoService } from '../shared/services/video.service';
import { getVideoIdFromYoutubeUrl } from '../shared/get-video-id-from-youtube-url';


declare var YT: any;

@Component({
  selector: 'app-video',
  imports: [
    SafePipe
  ],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss'
})
export class VideoComponent implements AfterViewInit{
  @ViewChild('youtubePlayer', { static: true }) 
  youtubePlayer!: ElementRef<HTMLIFrameElement>;

  player: any;
  videoEnded = false;

  video = computed<Video | undefined>(
    () => this.appStateService.selectedVideo()
  );

  url = computed(() => {
    const videoToPlay = this.video();
    const baseUrl = 'https://www.youtube.com/embed/'
    const urlParameters = 'autoplay=1&enablejsapi=1';

    return `${baseUrl}${videoToPlay?.id}?${urlParameters}`;
  })

  baseUrl = 'https://www.youtube.com/embed/';

  appStateService = inject(AppStateService);
  videoService = inject(VideoService);

  constructor() {
    this.videoService.onPlay
      .pipe(
        takeUntilDestroyed()
      ).subscribe(this.play.bind(this));

    this.videoService.onPause
    .pipe(
      takeUntilDestroyed()
    ).subscribe(this.pause.bind(this));

    this.videoService.onStop
    .pipe(
      takeUntilDestroyed()
    ).subscribe(this.stop.bind(this));
  }

  play() {
    this.sendMessageToIframe('playVideo');
  }

  pause() {
    this.sendMessageToIframe('pauseVideo');
  }

  stop() {
    this.sendMessageToIframe('stopVideo');
  }

  ngAfterViewInit() {
    this.loadYouTubeAPI();
  }

  loadYouTubeAPI() {
      this.onYouTubeIframeAPIReady();
  }

  onYouTubeIframeAPIReady() {
    this.player = new YT.Player('youtube-player', {
      events: {
        'onStateChange': (event: any) => this.onPlayerStateChange(event)
      }
    });
  }

  public handleIFrameLoad() {
    this.onYouTubeIframeAPIReady();
  }

  onPlayerStateChange(event: {data: number, target: {videoTitle: string, getVideoUrl: () => string}} ) {

    this.updateVideoTitleIfNecessary(event?.target?.getVideoUrl(), event?.target?.videoTitle);

    if (event.data === YT.PlayerState.ENDED) {
      const endedVideo: Video | undefined = this.video();
      if(endedVideo) {
        this.videoService.fireVideoEnded(endedVideo);
      }
    }
  }

  updateVideoTitleIfNecessary(videoUrl: string, title: string) {
    if(!videoUrl || !title) {
      return;
    }

    const videoId = getVideoIdFromYoutubeUrl(videoUrl);

    if(!videoId) {
      return;
    }

    const video: Video = {
      id: videoId,
      title
    };

    this.videoService.fireVideoTitleUpdated(video);
  }

  sendMessageToIframe(command: string) {
    if (this.youtubePlayer && this.youtubePlayer.nativeElement.contentWindow) {
      this.youtubePlayer.nativeElement.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command, args: [] }),
        '*'
      );
    }
  }
}
