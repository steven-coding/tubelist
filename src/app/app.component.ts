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
import { getUrlParam, PlaylistToUrlService, updateUrlParam } from './shared/services/playlist-to-url.service';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatTooltipModule,
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
  _playlistName = 'Playlist'

  public get playlistName(): string {
    return this._playlistName;
  }

  public set playlistName(v: string) {
    this._playlistName = v;

    updateUrlParam('name', this.playlistName);
    window.document.title = `${this.title} | ${this.playlistName}`
  }

  constructor() {
    this.appStateService.selectFirstVideo();
    this.initializePlaylistNameFromUrl();
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

  backward() {
    this.appStateService.selectPreviousVideo();
  }

  forward() {
    this.appStateService.selectNextVideo()
  }

  addYouTubeUrlToPlaylist() {

    this.playlistService.parseUrlAndAddToPlaylist(this.youTubeUrl || '');
    
    if(this.playlistService.playlist().length == 1) {
      this.appStateService.selectNextVideo();
    }
  }

  initializePlaylistNameFromUrl() {
    const playlistNameFromUrl = getUrlParam('name');
    
    if(!playlistNameFromUrl) {
      return;
    }

    this.playlistName = playlistNameFromUrl;
  }
}
