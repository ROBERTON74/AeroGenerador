import { Component, Input, OnChanges, OnDestroy, signal } from '@angular/core';
@Component({ selector: 'app-animated-number', template: '{{ formatted() }}', host: { '[attr.aria-label]': 'accessibleValue' }, styles: ':host { font-variant-numeric: tabular-nums; }' })
export class AnimatedNumber implements OnChanges, OnDestroy {
  @Input() value = 0;
  @Input() digits = 1;
  readonly formatted = signal('0');
  accessibleValue = '0';
  private frame = 0;
  private displayed = 0;
  ngOnChanges() {
    cancelAnimationFrame(this.frame);
    const target = Number.isFinite(this.value) ? this.value : 0;
    const formatter = new Intl.NumberFormat('es-ES', { maximumFractionDigits: this.digits, minimumFractionDigits: this.digits });
    this.accessibleValue = formatter.format(target);
    const start = this.displayed;
    const began = performance.now();
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 420;
    const tick = (now: number) => {
      const t = duration ? Math.min(1, (now - began) / duration) : 1;
      this.displayed = start + (target - start) * (1 - (1 - t) ** 3);
      this.formatted.set(formatter.format(this.displayed));
      if (t < 1) this.frame = requestAnimationFrame(tick);
    };
    tick(began);
  }
  ngOnDestroy() { cancelAnimationFrame(this.frame); }
}
