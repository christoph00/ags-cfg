const { exec, CONFIG_DIR } = ags.Utils;

Object.keys(imports.widgets).forEach(m => imports.widgets[m]);

var config = {
  style: CONFIG_DIR + '/style.css',
  windows: [
      imports.windows.desktop,
  ],
};