#!/bin/sh

# Script to control brightness of screen

ctl=""
val=3
msgTag="screen-brightness"

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
max_bright="$(brightnessctl -m max)" 
bright="$(brightnessctl -m get)" 
bright=$(($bright * 100 / max_bright))
bright=$(($bright + $val))
if [ "$bright" -le "0" ]
then
	bright=0
fi
#dunstify -a "change-brightness" -u low --icon=/usr/share/icons/Papirus-Dark/symbolic/status/display-brightness-symbolic.svg -h string:x-dunst-stack-tag:$msgTag -h int:value:"$bright" "Screen brightness"

# Set brightness
brightnessctl -q set $ctl
