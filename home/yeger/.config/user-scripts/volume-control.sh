#!/bin/sh

# Script to control volume 

ctl=""
val=3
msgTag="audio-volume"

# Get argument
if [ "$1" = "up" ]
then
	ctl="$val%+"
elif [ "$1" = "down" ]
then
	ctl="$val%-"
	val=-$val
else
	echo "Run script with correct argument:\n$0 <up|down>"
	exit 1
fi

# Show notification
wpctl set-mute @DEFAULT_AUDIO_SINK@ 0
volume="$(wpctl get-volume @DEFAULT_AUDIO_SINK@ | sed -r 's/Volume:\s//g;s/(0\.|0\.0|\.)//g')" 
volume=$(($volume + $val))
if [ "$volume" -le "0" ]
then
	# Show the sound muted notification
	volume="0"
	dunstify -a "change-volume" -u low 
	#dunstify -a "change-volume" -u low --icon=/usr/share/icons/Papirus-Dark/symbolic/status/audio-volume-muted-symbolic.svg -h string:x-dunst-stack-tag:$msgTag -h int:value:"$volume" "Audio muted" 

else
	# Show the volume notification
	dunstify -a "change-volume" -u low 

	#dunstify -a "change-volume" -u low --icon=/usr/share/icons/Papirus-Dark/symbolic/status/audio-volume-high-symbolic.svg -h string:x-dunst-stack-tag:$msgTag -h int:value:"$volume" "Audio volume"
fi

# Set volume
wpctl set-volume --limit 1.0 @DEFAULT_AUDIO_SINK@ $ctl
