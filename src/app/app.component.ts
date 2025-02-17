import { AfterViewInit, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SafePipe } from './shared/pipes/safe.pipe';
import { PlaylistService } from './shared/services/playlist.service';
import { AppStateService } from './shared/services/app-state.service';
import { VideoComponent } from './video/video.component';
import { VideoService } from './shared/services/video.service';
import { FormsModule } from '@angular/forms';
import { PlaylistToUrlService } from './shared/services/playlist-to-url.service';

declare var YT: any;

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    DragDropModule,
    VideoComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  playlistService = inject(PlaylistService);
  appStateService = inject(AppStateService);
  videoService = inject(VideoService);
  playlistToUrlService = inject(PlaylistToUrlService);

  title = 'tubelist';
  youTubeUrl = undefined;

  constructor() {
    this.appStateService.selectFirstVideo();
  }

  drop(event: CdkDragDrop<Video[]>) {
    this.playlistService.moveVideo(event.previousIndex, event.currentIndex);
  }

  selectVideo(video: Video) {
    this.appStateService.selectVideo(video);
  }

  selectNextVideo() {
    this.appStateService.selectNextVideo();
  }
    
  play() {
    this.videoService.play();
  }

  pause() {
    this.videoService.pause();
  }

  stop() {
    this.videoService.stop();
  }

  addYouTubeUrlToPlaylist() {
    const urlToCheck = this.youTubeUrl || '';

    const regex = /watch\?v=([^&]+)/;

    const match = urlToCheck.match(regex);

    if (match?.[1]) {
      const videoId = match[1];
      this.playlistService.addById(videoId);
    }
  }
}
