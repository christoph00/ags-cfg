import {
  Desktop,
} from './widgets.js';

const { exec, CONFIG_DIR } = ags.Utils;
const { Window, Box, Label } = ags.Widget;


const DesktopWindow = () => Window({
  name: 'desktop-window',
  anchor: 'background',
  child: Desktop(),
});


export default {
  style: CONFIG_DIR + '/style.css',
  windows: [
    DesktopWindow()
  ],
};