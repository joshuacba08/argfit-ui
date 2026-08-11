import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';

addons.setConfig({
  theme: create({
    base: 'dark',
    brandTitle: 'ArgFit UI',
    brandUrl: '/',
    colorPrimary: '#2599d5',
    colorSecondary: '#00d4ff',
    appBg: '#08111f',
    appContentBg: '#0f1d32',
    appBorderColor: 'rgba(37, 153, 213, 0.18)',
    barBg: '#0a1628',
    barTextColor: '#bcccdc',
    barSelectedColor: '#57b0e7',
    inputBg: '#0f1d32',
    inputBorder: 'rgba(37, 153, 213, 0.22)',
    inputTextColor: '#f0f4f8',
  }),
});
