/**
 * `echarts-gl` no publica tipos propios.
 *
 * Sólo se importa de forma dinámica para registrar los tipos volumétricos, así que no
 * se consume ninguna de sus API: basta declarar el módulo para que la importación
 * diferida compile sin apagar `strict` en todo el paquete.
 */
declare module 'echarts-gl/dist/echarts-gl.js';
