#!/bin/sh

# Script to control brightness of keyboard

ctl=""
val=3
msgTag="kb-brightness"

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
bright="$(brightnessctl -m --device=smc::kbd_backlight get)" 
bright=$(($bright * 100 / 255))
bright=$(($bright + $val))
if [ "$bright" -le "0" ]
then
	bright=0
fi
#dunstify -a "change-kb-brightness" -u low --icon=/usr/share/icons/Papirus-Dark/symbolic/status/keyboard-brightness-symbolic.svg -h string:x-dunst-stack-tag:$msgTag -h int:value:"$bright" "Keyboard brightness"

# Set brightness
brightnessctl -q --device=smc::kbd_backlight set $ctl
