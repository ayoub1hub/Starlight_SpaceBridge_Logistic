import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private activeRequests = signal(0);
  public isLoading = signal(false);

  show(): void {
    this.activeRequests.update(count => count + 1);
    this.isLoading.set(true);
  }

  hide(): void {
    this.activeRequests.update(count => Math.max(0, count - 1));

    // Only hide loading when all requests are complete
    if (this.activeRequests() === 0) {
      this.isLoading.set(false);
    }
  }

  reset(): void {
    this.activeRequests.set(0);
    this.isLoading.set(false);
  }
}
