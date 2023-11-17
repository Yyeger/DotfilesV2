#
# ~/.bashrc
#

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

alias ls='ls --color=auto'
alias grep='grep --color=auto'
alias code='code  --enable-features=UseOzonePlatform --ozone-platform=wayland'
PS1='[\u@\h \W]\$ '

if [ "$XDG_SESSION_DESKTOP" = "sway" ] ; then
    # https://github.com/swaywm/sway/issues/595
    export _JAVA_AWT_WM_NONREPARENTING=1
fi

if [ "$XDG_SESSION_DESKTOP" = "sway" ] ; then
    export MOZ_ENABLE_WAYLAND=1
fi

if [ "$XDG_SESSION_DESKTOP" = "sway" ] ; then
    export XDG_CURRENT_DESKTOP=sway
fi
if [ "$XDG_SESSION_DESKTOP" = "sway" ] ; then
    export XCURSOR_SIZE=14
fi

export PATH=$PATH:/home/yeger/.spicetify
