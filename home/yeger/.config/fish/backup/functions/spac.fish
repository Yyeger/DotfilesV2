function spac --description 'Searches Arch repositories for packages and installs selected packages'
    set -l packages $(pacman -Ssq | fzf -m --preview="pacman -Si {}" --preview-window=:hidden --bind=space:toggle-preview)
    if [ -n "$packages" ]
        sudo pacman -Syy $packages
    end
end
