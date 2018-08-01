#!/bin/bash

sessionName="my-blog"

tmux has-session -t $sessionName
hasSession=$?
type="dev"

if [ "$hasSession" = "0" ];then
    tmux attach -t $sessionName
    exit 0
fi

if [ $1 = "prod" ];then
  type=$1
fi

echo "Starting dev session for $sessionName"

tmux new-session -d -s $sessionName -n "compile" ". utils/env;$SHELL"
t=$sessionName:"compile"
tmux split-window -vb -t $t "trap '' 2;yarn run $type;$SHELL"
tmux select-pane -D -t $t

tmux attach -t $sessionName
