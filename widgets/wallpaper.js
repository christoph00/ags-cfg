const { Widget } = ags;
const { Theme } = ags.Service;

Widget.widgets['wallpaper'] = props => Widget({
    ...props,
    type: 'box',
    className: 'wallpaper',
});