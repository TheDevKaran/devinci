import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { GeminiService } from '../services/gemini.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthModal } from '../auth/auth-modal/auth-modal';
import { AuthService } from '../services/auth.service';
import { CreditService } from '../services/credit.service';
import { ToastService } from '../services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doodle-tool',
  standalone: true,
  imports: [CommonModule, FormsModule, AuthModal],
  templateUrl: './doodle-tool.html',
  styleUrl: './doodle-tool.css',
})
export class DoodleTool implements OnDestroy {
  prompt = 'Transform the given image into a playful, hand-drawn doodle art style. Use irregular, sketchy outlines and whimsical details to make it look fun and imaginative. Add quirky patterns, small decorative elements like stars, swirls, and hearts around the main subject. Keep the composition lively and dynamic, with exaggerated shapes and simplified forms. Apply a light pastel color palette with pops of bright colors for highlights, and include subtle shading that feels like colored pencils or markers. The overall vibe should be cheerful, creative, and cartoonish, as if drawn in a casual notebook with artistic flair.';

  showPrompt = false;
styles = [
    {
    id: 'doodle',
    label: 'Doodle Art',
    src: 'doodle.jpg',
    prompt:
      'simple hand-drawn doodle of given image, black ink on white textured paper, whimsical and playful linework, minimal shading, sketchy and imperfact style with visible pen strokes, expressive and exaggerated features, notebook margin vibe, creative spontaneity in shaped and proportions, charmingly rough and casual aesthetic, childlike imagination meets adult humour.'
  },
  {
    id: 'van-gogh',
    label: 'Van Gogh',
    src: 'vangogh.jpg',
    prompt:
      'Reimagine the image as a highly expressive post-impressionist oil painting inspired by Vincent van Gogh. ' +
      'Use thick, visible impasto brush strokes with strong directional movement, especially in the background. ' +
      'Introduce swirling textures, rhythmic curves, and energetic paint flow that makes the scene feel alive. ' +
      'Apply bold, emotionally charged colors such as deep blues, vibrant yellows, and rich greens with strong contrast. ' +
      'Lighting should feel dramatic and painterly rather than realistic. ' +
      'The final image must look like it was painted by hand on a textured canvas, prioritizing emotion and motion over accuracy. ' +
      'Do not add any text, watermark, or extra elements.'
  },
  {
    id: 'anime',
    label: 'Anime',
    src: 'anime.jpg',
    prompt:
      'Transform the image into a high-quality modern anime illustration. ' +
      'Use clean, confident line art with smooth curves and controlled line thickness. ' +
      'Stylize facial features with expressive eyes, simplified noses and mouths, and balanced proportions while keeping the subject recognizable. ' +
      'Apply soft but well-defined shading, gentle gradients, and subtle highlights for depth. ' +
      'Colors should be vibrant yet harmonious, with a polished digital finish similar to professional anime artwork. ' +
      'Lighting should feel soft and cinematic rather than harsh. ' +
      'Do not include any text, watermark, logos, or background clutter.'
  },
  {
    id: 'sketch',
    label: 'Sketch',
    src: 'sketch.jpg',
    prompt:
      'Convert the image into a detailed hand-drawn sketch as if created by an artist using pencil or charcoal on paper. ' +
      'Use visible hand strokes, natural imperfections, and varied line pressure to define form and depth. ' +
      'Apply cross-hatching, light smudging, and tonal shading to suggest shadows and volume. ' +
      'Keep the artwork mostly monochrome or lightly shaded, avoiding strong colors. ' +
      'The final result should feel raw, unfinished, and artistic, like a sketchbook study rather than a polished drawing. ' +
      'Do not add any text or graphic elements.'
  },
  {
    id: 'cartoon',
    label: 'Cartoon',
    src: 'cartoon.jpg',
    prompt:
      'Transform the image into a lively cartoon-style illustration with a playful and exaggerated aesthetic. ' +
      'Use bold, confident outlines and simplified shapes while keeping the subject easily recognizable. ' +
      'Slightly exaggerate proportions and expressions to add personality and charm. ' +
      'Apply bright, flat colors with minimal shading and clean separation between color regions. ' +
      'The overall look should resemble modern animated cartoons with a cheerful and friendly tone. ' +
      'Avoid realism and focus on expressiveness. ' +
      'Do not add any text, watermark, or logos.'
  },
  {
    id: 'ink',
    label: 'Ink',
    src: 'ink.jpg',
    prompt:
      'Render the image as a refined ink illustration using strong black line work on a clean, light background. ' +
      'Focus on precise contours, intentional line weight variation, and sharp edges. ' +
      'Use minimal shading through hatching, stippling, or negative space rather than gradients. ' +
      'The artwork should resemble traditional pen-and-ink drawings or professional tattoo flash art. ' +
      'Maintain clarity, contrast, and elegance in the line work. ' +
      'Do not add any text, watermark, or decorative symbols.'
  }
];


  constructor(
    private gemini: GeminiService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    public authService: AuthService,
    public creditService: CreditService,
    private router: Router,
    public toastService: ToastService
  ) {}

  private autoCloseTimer: any = null;

// private scheduleAutoClose() {
//   if (this.autoCloseTimer) {
//     clearTimeout(this.autoCloseTimer);
//   }

//   this.autoCloseTimer = setTimeout(() => {
//     this.clearOutput();
//     // this.toastService.show('Doodle closed automatically 🕒', 'info');
//   }, 10000); // 10 seconds
// }


  selectedStyle = this.styles[0];
  sliderValue = 100;

  selectStyle(style: any) {
    this.selectedStyle = style;
    this.prompt = style.prompt;
  }

  showAuth = false;

  authMode: 'login' | 'register' = 'login';
  private isAuthenticating = false; // 🔥 Add this to prevent duplicate requests

  openAuth(mode: 'login' | 'register') {
    this.authMode = mode;
    this.showAuth = true;
    this.cd.detectChanges();

  }

  closeAuth() {
    this.showAuth = false;
    this.cd.detectChanges();

    this.isAuthenticating = false; // Reset when closing
  }

handleAuthSubmit(data: { email: string; password: string }) {
  // 🔥 Prevent duplicate submissions
  if (this.isAuthenticating) {
    console.log('⚠️ Authentication already in progress');
    return;
  }

  console.log('🔐 Starting authentication:', this.authMode);
  this.isAuthenticating = true;

  if (this.authMode === 'register') {
    // === REGISTRATION ===
    this.authService.register(data.email, data.password).subscribe({
      next: (res: any) => {
        console.log('✅ Registration successful:', res);

        // After registration, auto-login
        this.authService.login(data.email, data.password).subscribe({
          next: (loginRes: any) => {
            console.log('✅ Auto-login successful:', loginRes);

            const token =
              loginRes?.token || loginRes?.jwt || loginRes?.accessToken;

            if (token) {
              this.authService.saveToken(token);
              this.creditService.setFreeCredits(); // 1 credit on signup/login

              this.showAuth = false;
              this.cd.detectChanges();

              this.isAuthenticating = false;

              this.toastService.show(
                'Account created successfully 🎉',
                'success'
              );
                  // this.scheduleAutoClose(); // 👈 add here

            } else {
              console.error('❌ No token in login response');
              this.isAuthenticating = false;
              this.authMode = 'login';

              this.toastService.show(
                'Account created. Please log in manually.',
                'info'
              );
                  // this.scheduleAutoClose(); // 👈 add here

            }
          },
          error: (err) => {
            console.error('❌ Auto-login error:', err);
            this.isAuthenticating = false;
            this.authMode = 'login';

            this.toastService.show(
              'Account created. Please log in manually.',
              'info'
            );
                // this.scheduleAutoClose(); // 👈 add here

          }
        });
      },
      error: (err) => {
        console.error('❌ Registration error:', err);
        this.isAuthenticating = false;

        this.toastService.show(
          err?.error?.message || 'Registration failed',
          'error'
        );
            // this.scheduleAutoClose(); // 👈 add here

      }
    });
  } else {
    // === LOGIN ===
    this.authService.login(data.email, data.password).subscribe({
      next: (res: any) => {
        console.log('✅ Login successful:', res);

        const token =
          res?.token || res?.jwt || res?.accessToken;

        if (token) {
          this.authService.saveToken(token);
          this.creditService.setFreeCredits(); // 1 credit on login

          this.showAuth = false;
          this.cd.detectChanges();

          this.isAuthenticating = false;
          setTimeout(() => {}, 0);


          this.toastService.show(
            'Logged in successfully ✅',
            'success'
          );
              // this.scheduleAutoClose(); // 👈 add here

        } else {
          console.error('❌ No token in login response');
          this.isAuthenticating = false;

          this.toastService.show(
            'Login failed: No token received',
            'error'
          );
              // this.scheduleAutoClose(); // 👈 add here

        }
      },
      error: (err) => {
        console.error('❌ Login error:', err);
        this.isAuthenticating = false;

        this.toastService.show(
          err?.error?.message || 'Invalid credentials',
          'error'
        );
            // this.scheduleAutoClose(); // 👈 add here

      }
    });
  }
}


  logout() {
    this.authService.logout();
    this.toastService.show(
        'Log out successfully ✅',
        'success'
          );
              // this.scheduleAutoClose();
  }

  goToAdmin() {
  this.router.navigate(['/admin']);
}


  base64Image = '';
  outputImage: SafeUrl | null = null;
  loading = false;
  statusMessage = '';

  private _originalDataUrl: string | null = null;
  uploadedPreview: SafeUrl | null = null;

  _lastObjectUrl: string | null = null;

  previewDisplayWidth: number | null = null;
  previewDisplayHeight: number | null = null;
  private readonly MAX_PREVIEW_WIDTH = 720;

  onFileSelected(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      this._originalDataUrl = result;
      this.uploadedPreview = this.sanitizer.bypassSecurityTrustUrl(result);
      const idx = result.indexOf('base64,');
      this.base64Image = idx >= 0 ? result.slice(idx + 7) : result;
      this.statusMessage = 'Image loaded';
      this.cd.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  onImageUpload(event: any) {
    const file = event.target.files?.[0] ?? null;
    this.onFileSelected(file);
  }

  triggerFilePicker(input: HTMLInputElement) {
    input.click();
  }

  onDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement)?.classList.add('drag-active');
  }

  onDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement)?.classList.remove('drag-active');
  }

  onDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement)?.classList.remove('drag-active');
    const file = e.dataTransfer?.files?.[0] ?? null;
    if (file) this.onFileSelected(file);
  }

  private async computePreviewSizeFromResult(objectUrl: string) {
    return new Promise<void>((resolve) => {
      try {
        const img = new Image();
        img.onload = () => {
          const naturalW = img.naturalWidth || img.width;
          const naturalH = img.naturalHeight || img.height || (naturalW * 0.75);
          const displayW = Math.min(naturalW, this.MAX_PREVIEW_WIDTH);
          const displayH = Math.round((naturalH * displayW) / naturalW);
          this.previewDisplayWidth = displayW;
          this.previewDisplayHeight = displayH;
          this.cd.detectChanges();
          resolve();
        };
        img.onerror = () => {
          this.previewDisplayWidth = null;
          this.previewDisplayHeight = null;
          this.cd.detectChanges();
          resolve();
        };
        img.src = objectUrl;
      } catch {
        this.previewDisplayWidth = null;
        this.previewDisplayHeight = null;
        this.cd.detectChanges();
        resolve();
      }
    });
  }
  showUpgradeConfirm = false;
  confirmUpgrade() {
  this.creditService.setPremiumCredits(); // 5 credits
  this.showUpgradeConfirm = false;

  this.toastService.show(
    'Premium activated 🎉 You have 5 credits',
    'success'
  );
}

cancelUpgrade() {
  this.showUpgradeConfirm = false;
}

async generate() {
  this.sliderValue = 100;

  // 1. Require login
  if (!this.authService.isLoggedIn()) {
    this.showAuth = true;
    this.cd.detectChanges();

    this.authMode = 'login';
    this.toastService.show('Please log in to generate doodles 🎨', 'info');
        // this.scheduleAutoClose(); // 👈 add here

    // this.scheduleAutoClose(); // 👈 add here

    return;
  }

  // 2. Check credits
  const hasCredits = this.creditService.consume();
  if (!hasCredits) {
    this.toastService.show(
      'No credits left. Upgrade to continue 🎨',
      'error'
    );
        this.showUpgradeConfirm=true;

        // this.scheduleAutoClose(); // 👈 add here

    // this.scheduleAutoClose(); // 👈 add here


    // // Placeholder upgrade (auto)
    // setTimeout(() => {
    //   this.creditService.reset();
    //   this.toastService.show(
    //     'Plan upgraded! 5 credit added 🎉',
    //     'success'
    //   );
    //       // this.scheduleAutoClose(); // 👈 add here

    //   // this.scheduleAutoClose(); // 👈 add here

    // },
    // 1200);

    return;
  }

  // 3. Proceed normally
  this.loading = true;
  this.outputImage = null;
  this.statusMessage = 'Processing...';
  this.cd.detectChanges();

  try {
    if (!this.base64Image) {
      this.toastService.show('Please upload an image first 🖼️', 'info');

      // this.scheduleAutoClose(); // 👈 add here

      this.loading = false;
      return;
    }

    const res = await this.gemini.transformImage(
      this.base64Image,
      'image/png',
      this.prompt
    );

    let cleaned = res.base64 ?? '';
    const idx = cleaned.indexOf('base64,');
    if (idx >= 0) cleaned = cleaned.slice(idx + 7);

    if (!cleaned || cleaned.length < 100)
      throw new Error('Generated image is invalid');

    const byteStr = atob(cleaned);
    const bytes = new Uint8Array(byteStr.length);
    for (let i = 0; i < byteStr.length; i++) {
      bytes[i] = byteStr.charCodeAt(i);
    }

    if (this._lastObjectUrl) {
      try { URL.revokeObjectURL(this._lastObjectUrl); } catch {}
      this._lastObjectUrl = null;
    }

    const blob = new Blob([bytes], { type: res.mimeType || 'image/png' });
    const objectUrl = URL.createObjectURL(blob);
    this._lastObjectUrl = objectUrl;

    this.outputImage = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
    await this.computePreviewSizeFromResult(objectUrl);

    this.statusMessage = 'Done!';
    this.toastService.show('Doodle generated successfully ✨', 'success');
    // this.scheduleAutoClose(); // 👈 add here

  } catch (err: any) {
    console.error(err);
    this.toastService.show(
      err?.message || 'Something went wrong',
      'error'
    );
    // this.scheduleAutoClose(); // 👈 add here

    this.statusMessage = 'Error';
  } finally {
    this.loading = false;
    this.cd.detectChanges();
  }
}


  async downloadImage() {
    if (!this._lastObjectUrl) return;
    try {
      const a = document.createElement('a');
      a.href = this._lastObjectUrl;
      a.download = 'doodle.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.error('Download failed', e);
      alert('Download failed. Open image in new tab and save manually.');
    }
  }

  clearOutput() {
    if (this._lastObjectUrl) {
      try { URL.revokeObjectURL(this._lastObjectUrl); } catch {}
      this._lastObjectUrl = null;
    }
    this.outputImage = null;
    this._originalDataUrl = null;
    this.uploadedPreview = null;
    this.base64Image = '';
    this.previewDisplayWidth = null;
    this.previewDisplayHeight = null;
    this.statusMessage = 'Cleared';
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    if (this._lastObjectUrl) {
      try { URL.revokeObjectURL(this._lastObjectUrl); } catch {}
      this._lastObjectUrl = null;
    }
  }
}
