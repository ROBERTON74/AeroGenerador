import { Component, HostListener, AfterViewInit, OnDestroy } from '@angular/core';
import { WindLab } from './wind-lab';

@Component({
  selector: 'app-root',
  imports: [WindLab],
  templateUrl: './app-new.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit, OnDestroy {
  readonly applicationUrl = location.port === '4200' ? 'http://127.0.0.1:5177/' : '/';
  menuOpen = false;
  activeSection = 'aplicacion';

  readonly metrics = [
    { value: 'ESIOS 551', label: 'Generacion eolica agregada en MW' },
    { value: '31.679 MW', label: 'Referencia de potencia instalada' },
    { value: '5 MW', label: 'Turbina tipo calibrada para el dashboard' },
    { value: '5 min', label: 'Actualizacion periodica mediante polling', featured: true },
  ];

  readonly videos = [
    {
      kicker: 'Pitch / mordida',
      title: 'Variacion del angulo de pala en 4K',
      text: 'Render de 10 segundos preparado para explicar el movimiento de pitch de las palas como variable tecnica derivada del modelo.',
      src: 'assets/media/blender_pitch_mordida_10s_4k_30fps.mp4',
      poster: 'assets/renders/07_front_rotor_full_proportion_review.png',
      download: 'Descargar video pitch',
      featured: true,
    },
    {
      kicker: 'Rotor',
      title: 'Rotacion normal de las palas en 4K',
      text: 'Render de 10 segundos para mostrar el giro del conjunto rotor-buje y relacionarlo con rpm estimadas y factor de carga.',
      src: 'assets/media/blender_rotacion_rotor_10s_4k_30fps.mp4',
      poster: 'assets/renders/preview_torre_gondola_completa.png',
      download: 'Descargar video rotacion',
    },
    {
      kicker: 'Proceso Blender',
      title: 'Animaciones tecnicas con datos a escala',
      text: 'Video explicativo del desarrollo realizado en Blender, usando proporciones a escala y referencias reales de aerogeneradores modernos.',
      src: 'assets/media/explicacion_blender_datos_escala.mp4',
      poster: 'assets/renders/07_front_rotor_full_proportion_review.png',
      download: 'Descargar explicacion tecnica',
    },
  ];

  readonly papers = [
    {
      number: '01',
      kicker: 'Fatiga estructural',
      title: 'Damage Equivalent Load (DEL)',
      text: 'Explica como una senal de cargas variables puede resumirse en una carga equivalente que produce el mismo dano por fatiga.',
      points: ['Rainflow como paso previo al DEL.', 'Uso de exponente S-N / Wohler.', 'Aplicacion didactica a pala, torre y tren mecanico.'],
      href: 'assets/papers/del.html',
      link: 'Abrir paper DEL',
    },
    {
      number: '02',
      kicker: 'Mantenimiento predictivo',
      title: 'Vida util y RUL',
      text: 'Desarrolla como se estima la vida util restante de un aerogenerador, diferenciando vida de diseno, dano acumulado y condiciones reales.',
      points: ['Vida de diseno de 20-25 anos.', 'Dano acumulado tipo Miner.', 'SCADA, sensores virtuales y extension de vida.'],
      href: 'assets/papers/vida-util.html',
      link: 'Abrir paper vida util',
    },
    {
      number: '03',
      kicker: 'Aerodinamica y ciclos',
      title: 'Rainflow, Cp y Ct',
      text: 'Relaciona el conteo de ciclos rainflow con los coeficientes de potencia y empuje para explicar energia, cargas y fatiga.',
      points: ['Cp como rendimiento de captura energetica.', 'Ct como empuje estructural del rotor.', 'Puente entre energia, cargas y fatiga.'],
      href: 'assets/papers/rainflow-cp-ct.html',
      link: 'Abrir paper rainflow Cp Ct',
    },
  ];

  readonly methodology = [
    { title: 'Web interactiva', text: 'Es el nucleo del proyecto: datos reales agregados, calculo de variables estimadas y visualizacion SCADA en tiempo real.' },
    { title: 'Blender', text: 'Se mantiene como herramienta de modelado, renderizado y apoyo visual para explicar pitch, rotacion y fidelidad geometrica.' },
    { title: 'Alcance de los datos', text: 'ESIOS proporciona generacion eolica agregada. Las variables de turbina individual son estimaciones didacticas calibradas.' },
  ];

  readonly deliverables = [
    { kicker: 'Web', title: 'Portal y aplicacion', text: 'Portal Angular de presentacion y acceso a la aplicacion interactiva con datos reales agregados de ESIOS.' },
    { kicker: 'Blender', title: 'Modelo animable', text: 'Escenas del aerogenerador con rotor, buje, gondola, pitch de palas, yaw y version offshore para contexto visual.' },
    { kicker: 'Videos', title: 'Renders HD', text: 'Piezas en 4K para explicar rotacion, variacion de pitch y el proceso de construccion visual a escala.' },
    { kicker: 'Memoria', title: 'Documentacion y papers', text: 'Archivos de apoyo sobre modelo web animable, pitch, fatiga, vida util, DEL, rainflow y calibracion tecnica.' },
  ];

  private modelObserver?: IntersectionObserver;

  ngAfterViewInit() {
    const frames = document.querySelectorAll<HTMLIFrameElement>('.blender-model-frame, .offshore-platform-frame');
    this.modelObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const frame = entry.target as HTMLIFrameElement;
        frame.contentWindow?.postMessage({ type: 'aerogenerador-visibility', visible: entry.isIntersecting }, window.location.origin);
      }
    });
    frames.forEach(frame => this.modelObserver?.observe(frame));
  }

  onModelFrameLoad(event: Event) {
    const frame = event.target as HTMLIFrameElement;
    const rect = frame.getBoundingClientRect();
    frame.contentWindow?.postMessage({ type: 'aerogenerador-visibility', visible: rect.bottom > 0 && rect.top < window.innerHeight }, window.location.origin);
  }

  ngOnDestroy() { this.modelObserver?.disconnect(); }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  @HostListener('window:scroll')
  onScroll() {
    const ids = ['aplicacion', 'modelo3d', 'plataformas-offshore', 'laboratorio', 'videos', 'papers', 'metodologia', 'entregables'];
    const current = ids
      .map((id) => ({ id, top: document.getElementById(id)?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY }))
      .filter((item) => item.top < window.innerHeight * 0.45)
      .pop();

    if (current) {
      this.activeSection = current.id;
    }
  }
}
