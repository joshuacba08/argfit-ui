import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideArgfitUi, type AfMetricCardState, type AfMetricSample } from '@argfit-ui/core';

import { AfMetricCardComponent } from './af-metric-card.component';

@Component({
  imports: [AfMetricCardComponent],
  template: `
    <af-metric-card
      label="% de paradas"
      [value]="value()"
      unit="%"
      [state]="state()"
      [sample]="sample()"
      period="Julio 2026"
      provenance="calculated"
      emptyDescription="Todavía no hay eventos capturados."
      errorDescription="No se pudo recuperar la serie."
    />
  `,
})
class AfMetricCardStateHostComponent {
  readonly state = signal<AfMetricCardState>('ready');
  readonly value = signal<string | number>(77.4);
  readonly sample = signal<AfMetricSample | undefined>({ numerator: 24, denominator: 31 });
}

@Component({
  imports: [AfMetricCardComponent],
  template: `
    <af-metric-card
      label="Sesiones"
      value="247"
      unit="mes"
      icon="file-text"
      tone="accent"
      trendValue="8%"
      trendDirection="up"
      [interactive]="true"
      (pressed)="pressed = $event"
    />
  `,
})
class AfMetricCardHostComponent {
  pressed: MouseEvent | KeyboardEvent | undefined;
}


/**
 * Dos tarjetas de contenido deliberadamente desigual dentro de una grilla: la primera
 * arrastra helper, muestra, período y procedencia; la segunda solo etiqueta y valor.
 * Es el caso que rompía el layout, con el renderer quedándose en su altura intrínseca.
 */
@Component({
  imports: [AfMetricCardComponent],
  template: `
    <div class="grid" style="display: grid; grid-template-columns: 1fr 1fr">
      <af-metric-card
        label="Cobertura de wellness del plantel profesional"
        [value]="88"
        unit="%"
        helper="Cuestionarios respondidos antes de la sesión de la mañana."
        [sample]="{ numerator: 22, denominator: 25 }"
        period="Julio 2026"
        provenance="calculated"
        [fill]="fill()"
      />
      <af-metric-card label="Requieren revisión" [value]="3" [fill]="fill()" />
    </div>
  `,
})
class AfMetricCardFillHostComponent {
  readonly fill = signal(false);
}

describe('AfMetricCardComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders desktop and passes basic inputs', async () => {
    await TestBed.configureTestingModule({
      imports: [AfMetricCardHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfMetricCardHostComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const card = root.querySelector('af-metric-card-desktop') as HTMLElement;

    expect(card).not.toBeNull();
    expect(root.querySelector('af-metric-card-mobile')).toBeNull();
    expect(card.textContent).toContain('Sesiones');
    expect(card.textContent).toContain('247');
  });

  it('renders mobile and reemits pressed', async () => {
    await TestBed.configureTestingModule({
      imports: [AfMetricCardHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfMetricCardHostComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const card = root.querySelector('af-metric-card-mobile') as HTMLElement;

    expect(card).not.toBeNull();
    expect(root.querySelector('af-metric-card-desktop')).toBeNull();

    card.click();
    expect(fixture.componentInstance.pressed).toBeTruthy();
  });

  /**
   * Contrato de honestidad analítica: una métrica sin muestra debe decirlo. Renderizar `0`
   * sería reportar mal el dato, porque un cero es en sí mismo una medición válida.
   */
  describe('estado del valor', () => {
    async function setup(platform: 'desktop' | 'mobile' = 'desktop') {
      await TestBed.configureTestingModule({
        imports: [AfMetricCardStateHostComponent],
        providers: [provideArgfitUi({ platform })],
      }).compileComponents();

      const fixture = TestBed.createComponent(AfMetricCardStateHostComponent);
      fixture.detectChanges();
      return fixture;
    }

    it('muestra valor, muestra y procedencia cuando hay dato', async () => {
      const fixture = await setup();
      const card = fixture.nativeElement as HTMLElement;

      expect(card.textContent).toContain('77.4');
      expect(card.textContent).toContain('24 / 31');
      expect(card.textContent).toContain('Calculado');
      expect(card.textContent).toContain('Julio 2026');
      expect(card.textContent).not.toContain('Sin muestra');
    });

    it('sustituye el valor por «Sin muestra» y oculta la unidad en estado vacío', async () => {
      const fixture = await setup();
      fixture.componentInstance.state.set('empty');
      fixture.componentInstance.value.set(0);
      fixture.componentInstance.sample.set({ numerator: 0, denominator: 0 });
      fixture.detectChanges();

      const card = fixture.nativeElement as HTMLElement;
      const valueRow = card.querySelector('.af-metric-card-desktop__value-row') as HTMLElement;

      expect(valueRow.textContent).toContain('Sin muestra');
      // Ni el cero ni la unidad: «Sin muestra %» no significa nada.
      expect(valueRow.textContent).not.toContain('0');
      expect(valueRow.textContent).not.toContain('%');
      expect(card.textContent).toContain('Todavía no hay eventos capturados.');
    });

    it('omite la muestra cuando el denominador es cero', async () => {
      const fixture = await setup();
      fixture.componentInstance.state.set('empty');
      fixture.componentInstance.sample.set({ numerator: 0, denominator: 0 });
      fixture.detectChanges();

      expect((fixture.nativeElement as HTMLElement).textContent).not.toContain('0 / 0');
    });

    it('anuncia el estado vacío en la etiqueta accesible, no un valor', async () => {
      const fixture = await setup();
      fixture.componentInstance.state.set('empty');
      fixture.detectChanges();

      const card = fixture.nativeElement.querySelector('af-metric-card-desktop') as HTMLElement;
      expect(card.getAttribute('aria-label')).toBe('% de paradas: Sin muestra');
      expect(card.getAttribute('data-state')).toBe('empty');
    });

    it('marca el estado de error como alerta', async () => {
      const fixture = await setup();
      fixture.componentInstance.state.set('error');
      fixture.detectChanges();

      const card = fixture.nativeElement as HTMLElement;
      expect(card.querySelector('[role="alert"]')).not.toBeNull();
      expect(card.textContent).toContain('Dato no disponible');
      // El detalle del error es su propia entrada, no la del estado vacío.
      expect(card.textContent).toContain('No se pudo recuperar la serie.');
      expect(card.textContent).not.toContain('Todavía no hay eventos capturados.');
    });

    it('mantiene la compatibilidad de `loading` sobre `state`', async () => {
      const fixture = await setup();
      fixture.componentInstance.state.set('ready');
      fixture.detectChanges();

      const card = fixture.nativeElement.querySelector('af-metric-card-desktop') as HTMLElement;
      expect(card.getAttribute('data-state')).toBe('ready');
      expect(card.getAttribute('aria-busy')).toBeNull();
    });

    it('aplica el mismo contrato en móvil', async () => {
      const fixture = await setup('mobile');
      fixture.componentInstance.state.set('empty');
      fixture.detectChanges();

      const card = fixture.nativeElement.querySelector('af-metric-card-mobile') as HTMLElement;
      expect(card.getAttribute('data-state')).toBe('empty');
      expect(card.textContent).toContain('Sin muestra');
    });
  });

  /**
   * La altura de la tarjeta es una decisión del layout que la contiene, no del largo de su
   * contenido. jsdom no calcula layout — `offsetHeight` siempre es 0 — así que acá se
   * verifica el contrato que produce esa altura; la medición real está en la verificación
   * manual descrita en el plan de la HU.
   */
  describe('contrato de altura', () => {
    async function setupFill(platform: 'desktop' | 'mobile' = 'desktop') {
      await TestBed.configureTestingModule({
        imports: [AfMetricCardFillHostComponent],
        providers: [provideArgfitUi({ platform })],
      }).compileComponents();

      const fixture = TestBed.createComponent(AfMetricCardFillHostComponent);
      fixture.detectChanges();
      return fixture;
    }

    it('deja que el renderer mida lo que mide el host, no su contenido', async () => {
      const fixture = await setupFill();
      const hosts = fixture.nativeElement.querySelectorAll('af-metric-card') as NodeListOf<HTMLElement>;

      expect(hosts).toHaveLength(2);

      for (const host of hosts) {
        const styles = getComputedStyle(host);
        expect(styles.display).toBe('flex');
        expect(styles.flexDirection).toBe('column');

        const renderer = host.querySelector('af-metric-card-desktop') as HTMLElement;
        expect(renderer).not.toBeNull();
        // El renderer es hijo directo del host: es la regla `flex: 1 1 auto` la que aplica.
        expect(renderer.parentElement).toBe(host);
      }
    });

    it('no marca `fill` cuando nadie lo pidió', async () => {
      const fixture = await setupFill();
      const host = fixture.nativeElement.querySelector('af-metric-card') as HTMLElement;
      const renderer = host.querySelector('af-metric-card-desktop') as HTMLElement;

      expect(host.getAttribute('data-fill')).toBeNull();
      expect(renderer.getAttribute('data-fill')).toBeNull();
      expect(renderer.className).not.toContain('af-metric-card-desktop--fill');
    });

    it('propaga `fill` al host y al renderer', async () => {
      const fixture = await setupFill();
      fixture.componentInstance.fill.set(true);
      fixture.detectChanges();

      const hosts = fixture.nativeElement.querySelectorAll('af-metric-card') as NodeListOf<HTMLElement>;

      for (const host of hosts) {
        const renderer = host.querySelector('af-metric-card-desktop') as HTMLElement;
        expect(host.getAttribute('data-fill')).toBe('');
        expect(renderer.getAttribute('data-fill')).toBe('');
        expect(renderer.className).toContain('af-metric-card-desktop--fill');
      }
    });

    it('aplica el mismo contrato en móvil', async () => {
      const fixture = await setupFill('mobile');
      fixture.componentInstance.fill.set(true);
      fixture.detectChanges();

      const host = fixture.nativeElement.querySelector('af-metric-card') as HTMLElement;
      const renderer = host.querySelector('af-metric-card-mobile') as HTMLElement;

      expect(renderer.parentElement).toBe(host);
      expect(renderer.getAttribute('data-fill')).toBe('');
      expect(renderer.className).toContain('af-metric-card-mobile--fill');
    });
  });
});
