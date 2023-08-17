const desktop = ags.Window({
    name: 'desktop',
    className: 'desktop',
    monitor: 0,
    anchor: ['top', 'left', 'bottom', 'right'],
  });



var config = {
    baseIconSize: 18,
    exitOnError: false,
    stackTraceOnError: false,
    style: '/home/christoph/.config/ags/style.css',
    windows: [
      desktop
    ]
  }