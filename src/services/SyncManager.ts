import { auth } from "../firebase/config";
import { SyncService } from "./SyncService";

type SyncStatus = "idle" | "syncing" | "error";

class SyncManager {
  private timer: ReturnType<typeof setInterval> | null = null;
  private syncService: SyncService | null = null;
  private status: SyncStatus = "idle";

  getStatus(): SyncStatus {
    return this.status;
  }

  private async sync() {
    if (this.status === "syncing" || !this.syncService) return;
    this.status = "syncing";
    try {
      await this.syncService.pullChanges(0);
      this.status = "idle";
    } catch (e) {
      console.warn("Sync failed:", e);
      this.status = "error";
    }
  }

  start() {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        this.syncService = new SyncService(user.uid);
        this.sync();
        if (!this.timer) {
          this.timer = setInterval(() => this.sync(), 30000);
        }
      } else {
        this.stop();
      }
    });
    return unsubscribe;
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.syncService = null;
    this.status = "idle";
  }
}

export const syncManager = new SyncManager();
