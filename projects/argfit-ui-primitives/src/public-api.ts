/*
 * Public API Surface of argfit-ui-primitives
 */

export * from './lib/a11y/af-live-region.component';
export * from './lib/a11y/af-visually-hidden.component';
export * from './lib/dismiss/af-escape-key.directive';
export * from './lib/focus/af-focus-initial.directive';
export * from './lib/focus/af-focus-trap.directive';
export * from './lib/icon/af-icon.component';
export { provideAfLucideIcons, provideAfNgIcons } from './lib/icon/af-icon.providers';
export type {
  AfIconRegistration,
  AfLucideIconRegistration,
  AfNgIconRegistration,
} from './lib/icon/af-icon.providers';
export * from './lib/pointer/af-pointer-drag.directive';
