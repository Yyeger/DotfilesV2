function fish_command_not_found --on-event fish_command_not_found
        set -l cows $(ls /usr/share/cows/*.cow)
        fortune|cowsay -f $cows[$(random 1 $(count $cows))]|lolcat -F 0.5
        __fish_default_command_not_found_handler $argv
end
