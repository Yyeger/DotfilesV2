function sopen --description 'Searches for one or more files and opens selected files'
    fzf -m --preview="xdg-mime query default {}" | xargs -ro -d "\n" xdg-open 2>&-
end
