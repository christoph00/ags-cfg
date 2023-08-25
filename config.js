const { Window, CenterBox } = ags.Widget;

import {
  Desktop,
  BarLeft,
  BarCenter,
  BarRight,
} from './widgets.js';

import {
  Settings,
} from './settings.js';


const DesktopWindow = () => Window({
  name: 'desktop-window',
  layer: 'background',
  anchor: ['top', 'bottom', 'left', 'right'],
  child: Desktop(),
});

const Bar = ({ monitor } = {}) => Window({
  name: `bar${monitor || ''}`, // name has to be unique
  className: 'bar',
  monitor,
  anchor: ['top', 'left', 'right'],
  exclusive: true,
  child: CenterBox({
    startWidget: BarLeft(),
    centerWidget: BarCenter(),
    endWidget: BarRight(),
  }),
})


export default {
  style: ags.App.configDir + '/style.css',
  windows: [
    DesktopWindow(),
    Bar()
  ],
};