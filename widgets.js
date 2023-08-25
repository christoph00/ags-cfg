const { Hyprland, Notifications, Mpris, Audio, Battery } = ags.Service;
const { App } = ags;
const { exec, execAsync } = ags.Utils;
const {
    Box, Button, Stack, Label, Icon, CenterBox, Window, Slider, ProgressBar
} = ags.Widget;

import {
    BrightnessSlider,
} from './widgets/brightness.js';

import {
    Settings,
} from './settings.js';

export const Desktop = props => Box({
    className: 'desktop',
    ...props,
});

const Workspaces = () => Box({
    className: 'workspaces',
    connections: [[Hyprland, box => {
        // generate an array [1..10] then make buttons from the index
        const arr = Array.from({ length: 6 }, (_, i) => i + 1);
        box.children = arr.map(i => Button({
            onClicked: () => execAsync(`hyprctl dispatch workspace ${i}`),
            child: Label({ label: `${i}` }),
            className: Hyprland.active.workspace.id == i ? 'focused' : '',
        }));
    }]],
});

const ClientTitle = () => Label({
    className: 'client-title',
    // an initial label value can be given but its pointless
    // because callbacks from connections are run on construction
    // so in this case this is redundant
    label: Hyprland.active.client.title || '',
    connections: [[Hyprland, label => {
        label.label = Hyprland.active.client.title || '';
    }]],
});

const Clock = () => Label({
    className: 'clock',
    connections: [
        [1000, label => execAsync(['date', '+%H:%M %b %e.'])
            .then(date => label.label = date).catch(console.error)],
    ],
});

// we don't need dunst or any other notification daemon
// because ags has a notification daemon built in
const Notification = () => Box({
    className: 'notification',
    children: [
        Icon({
            icon: 'preferences-system-notifications-symbolic',
            connections: [
                [Notifications, icon => icon.visible = Notifications.popups.size > 0],
            ],
        }),
        Label({
            connections: [[Notifications, label => {
                // notifications is a map, to get the last elememnt lets make an array
                label.label = Array.from(Notifications.popups.values())?.pop()?.summary || '';
            }]],
        }),
    ],
});

const Media = () => Button({
    className: 'media',
    onPrimaryClick: () => Mpris.getPlayer('')?.playPause(),
    onScrollUp: () => Mpris.getPlayer('')?.next(),
    onScrollDown: () => Mpris.getPlayer('')?.previous(),
    child: Label({
        connections: [[Mpris, label => {
            const mpris = Mpris.getPlayer('');
            // mpris player can be undefined
            if (mpris)
                label.label = `${mpris.trackArtists.join(', ')} - ${mpris.trackTitle}`;
            else
                label.label = 'Nothing is playing';
        }]],
    }),
});

const Volume = () => Box({
    className: 'volume',
    style: 'min-width: 180px',
    children: [
        Stack({
            items: [
                // tuples of [string, Widget]
                ['101', Icon('audio-volume-overamplified-symbolic')],
                ['67', Icon('audio-volume-high-symbolic')],
                ['34', Icon('audio-volume-medium-symbolic')],
                ['1', Icon('audio-volume-low-symbolic')],
                ['0', Icon('audio-volume-muted-symbolic')],
            ],
            connections: [[Audio, stack => {
                if (!Audio.speaker)
                    return;

                if (Audio.speaker.isMuted) {
                    stack.shown = '0';
                    return;
                }

                const show = [101, 67, 34, 1, 0].find(
                    threshold => threshold <= Audio.speaker.volume * 100);

                stack.shown = `${show}`;
            }, 'speaker-changed']],
        }),
        Slider({
            hexpand: true,
            drawValue: false,
            onChange: ({ value }) => Audio.speaker.volume = value,
            connections: [[Audio, slider => {
                if (!Audio.speaker)
                    return;

                slider.value = Audio.speaker.volume;
            }, 'speaker-changed']],
        }),
    ],
});

const BatteryLabel = () => Box({
    className: 'battery',
    children: [
        Icon({
            connections: [[Battery, icon => {
                icon.icon = `battery-level-${Math.floor(Battery.percent / 10) * 10}-symbolic`;
            }]],
        }),
        ProgressBar({
            valign: 'center',
            connections: [[Battery, progress => {
                if (Battery.percent < 0)
                    return;

                progress.fraction = Battery.percent / 100;
            }]],
        }),
    ],
});


export const BarLeft = () => Box({
    children: [
        Workspaces(),
    ],
});

export const BarCenter = () => Box({
    children: [
        Notification(),
    ],
});

export const BarRight = () => Box({
    halign: 'end',
    children: [
        BrightnessSlider(),
        Volume(),
        BatteryLabel(),
        Clock(),
    ],
});
