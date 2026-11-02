/**
 * GlobalWindSystem (風 - Kaze)
 * -----------------------------------------------------------------------------
 * A single, unified, 60 FPS wind simulation engine that synchronizes all
 * nature elements across the entire website:
 *  - Maple tree branches & leaf clusters
 *  - Sakura tree branches & blossom clusters
 *  - Global Canvas particles (falling Momiji leaves & Sakura petals)
 *  - Atmospheric ink flecks & washi fibers
 *
 * Provides smooth organic noise, continuous wind vectors, natural periodic
 * gusts, and interactive manual triggers (e.g. mouse sweep or click).
 */

class WindSystem {
  constructor() {
    this.time = 0;
    this.speed = 1.0; // Normalized wind intensity
    this.baseAngle = Math.PI * 0.08; // Predominantly gentle left-to-right drift (approx 15 deg downward)
    this.windX = 0.8;
    this.windY = 0.15;
    this.gust = 0;
    this.gustTimer = 0;
    this.nextGustInterval = 7.0 + Math.random() * 5.0; // Random gust every 7-12s
    this.gustDuration = 2.4;
    this.isGusting = false;
    this.listeners = new Set();
    this.lastFrameTime = performance.now();
    this.isRunning = false;

    // Start background simulation loop
    if (typeof window !== 'undefined') {
      this.start();
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastFrameTime = performance.now();

    const loop = (now) => {
      if (!this.isRunning) return;
      const dt = Math.min((now - this.lastFrameTime) / 1000, 0.1);
      this.lastFrameTime = now;
      this.update(dt);
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  stop() {
    this.isRunning = false;
  }

  update(dt) {
    this.time += dt;

    // 1. Organic multi-frequency shifting breeze
    const breeze1 = Math.sin(this.time * 0.45) * 0.6;
    const breeze2 = Math.cos(this.time * 1.1) * 0.3;
    const breeze3 = Math.sin(this.time * 0.18 + 1.2) * 0.4;
    const organicDrift = breeze1 + breeze2 + breeze3;

    // 2. Periodic natural wind gusts
    this.gustTimer += dt;
    if (!this.isGusting && this.gustTimer >= this.nextGustInterval) {
      this.triggerGust(1.0);
      this.gustTimer = 0;
      this.nextGustInterval = 6.0 + Math.random() * 6.0;
    }

    if (this.isGusting) {
      const gustAge = this.gustTimer;
      if (gustAge < this.gustDuration) {
        // Bell-shaped smooth gust curve
        const progress = gustAge / this.gustDuration;
        this.gust = Math.sin(progress * Math.PI) * this.gustPeak;
      } else {
        this.isGusting = false;
        this.gust = 0;
        this.gustTimer = 0;
      }
    } else {
      this.gust = Math.max(0, this.gust - dt * 1.5);
    }

    // 3. Compute directional vector
    const totalSpeed = Math.max(0.2, 0.85 + organicDrift * 0.4 + this.gust * 1.6);
    this.speed = totalSpeed;

    const angle = this.baseAngle + Math.sin(this.time * 0.25) * 0.12;
    this.windX = Math.cos(angle) * totalSpeed;
    this.windY = Math.sin(angle) * totalSpeed * 0.6 + Math.cos(this.time * 0.8) * 0.1;

    // 4. Notify high-performance listeners
    if (this.listeners.size > 0) {
      const state = this.getState();
      this.listeners.forEach((fn) => fn(state));
    }
  }

  /**
   * Manually trigger a sudden gust (e.g. on tree click, sword slash, or section arrival)
   */
  triggerGust(strength = 1.0) {
    this.isGusting = true;
    this.gustTimer = 0;
    this.gustPeak = Math.min(2.5, 1.2 * strength);
    this.gustDuration = 2.0 + Math.random() * 1.2;

    // Dispatch global custom event for non-react or external handlers
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('samurai-wind-gust', {
          detail: { strength, duration: this.gustDuration },
        })
      );
    }
  }

  /**
   * Fast getter for 60 FPS animation loops without callback overhead
   */
  getState() {
    return {
      time: this.time,
      speed: this.speed,
      windX: this.windX,
      windY: this.windY,
      gust: this.gust,
      isGusting: this.isGusting,
    };
  }

  /**
   * Subscribe a callback to frame-by-frame wind updates
   */
  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
}

export const windSystem = new WindSystem();
export default windSystem;

