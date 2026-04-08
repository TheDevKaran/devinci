import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
// import { GeminiService } from './gemini.service';
import { GeminiService } from './services/gemini.service';
import { DoodleTool } from './doodle-tool/doodle-tool';
import { Router, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, DoodleTool, RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App  {

}
