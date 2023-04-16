#! /bin/zsh

#################################
# 環境変数
#################################

export LANG=ja_JP.UTF-8     # Locale指定
export TERM=xterm-256color  # ターミナルの色を256色にする
export EDITOR=vim           # 既定のエディタを指定する

# Java
export JAVA_HOME=`/usr/libexec/java_home -v 1.8`
# Android
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools:$PATH
# Golang
export GOPATH=$HOME/.go
export GOROOT=$HOME/.goenv/versions/1.9/
# PostgreSQL
export PGDATA=/usr/local/var/postgres

# Dart pub global activate
export PATH="$PATH":"$HOME/.pub-cache/bin"

# オリジナルのbinフォルダ
export PATH="$HOME/bin:$PATH"

# cdpath=(.. ~)

# stty -ixon -ixoff

bindkey -e # emacs #キーバインドをemacsモードに設定する bindkey -v # vim

umask 022 # デフォルトパーミッションの設定(新規ファイル:644 新規ディレクトリ:755)

zmodload -a zsh/stat stat
zmodload -a zsh/zpty zpty
zmodload -a zsh/zprof zprof
zmodload -a zsh/mapfile mapfile

autoload -U compinit; compinit # 補完機能の強化
autoload -U colors; colors     # プロンプトに色を付ける


#################################
# zsh オプション
#################################

setopt auto_cd           # ディレクトリ名だけで cd
setopt auto_pushd        # 自動的にディレクトリスタックに追加して移動
setopt pushd_ignore_dups # 同じディレクトリを pushd しない
setopt correct           # コマンドのミススペルを修正して実行
setopt notify            # バックグラウンドジョブの状態変化を即時報告する
setopt equals           # =commandを`which command`と同じ処理にする

## Complement

setopt auto_list         # 補完候補を一覧表示
setopt auto_menu         # TAB で順に補完候補を切り替える
setopt auto_param_keys   # カッコの対応などを自動的に補完
setopt auto_param_slash  # ディレクトリ名の補完で末尾の / を自動的に付加し、次の補完に備える
setopt list_packed       # 補完候補をできるだけ詰めて表示する
setopt list_types        # 補完候補一覧でファイルの種別をマーク表示
setopt prompt_subst      # 色を使う
setopt nobeep            # ビープを鳴らさない
setopt nolistbeep

## history

setopt histnostore          # historyコマンドをヒストリに記録しない
setopt hist_ignore_dups     # 直前と同じコマンドはヒストリに記録しない
setopt hist_ignore_all_dups # 重複を記入しない
setopt hist_no_store        # historyコマンドは履歴に残さない
setopt histreduceblanks     # コマンドの余分なスペースを削除して記録
setopt extended_history     # ヒストリに実行時間と経過時間を記録する
setopt incappendhistory     # コマンド実行後にヒストリを記録する
setopt histignorespace      # 先頭がスペースで始まるコマンドは記録しない
setopt sharehistory         # 複数セッションでヒストリを共有する

HISTFILE=~/.zsh_history     # コマンド履歴ファイルの場所
HISTSIZE=100000             # メモリ上に保存される件数（検索できる件数）
SAVEHIST=100000             # ファイルに保存される件数
HISTORY_IGNORE="(ls|cd|pwd|exit)" # 保存しないコマンド

# rootは履歴を残さないようにする

if [ $UID = 0 ]; then
unset HISTFILE
SAVEHIST=0
fi

# zshでオプション一覧の出力する ([https://qiita.com/mollifier/items/26c67347734f9fcda274](https://qiita.com/mollifier/items/26c67347734f9fcda274))

function showoptions() {
  set -o | sed -e 's/^no\(.*\)on$/\1  off/' -e 's/^no\(.*\)off$/\1  on/'
}






################################
# エイリアス
################################

# タイポでも実行できるように
alias sl=ls
alias dc=cd

alias z="vim ~/.zshrc" # zshrc ファイルを編集する
alias grep="grep --color"
alias ps="ps --sort=start_time"

# alias ssh="sshrc"

# グローバルエイリアス

alias -g G='| grep'
alias -g GI='| grep -i'
alias -g T='| tail'
alias -g M='| more'
alias -g H='| head'

case "${OSTYPE}" in
  darwin*) # Mac
    alias ls="ls -GAF"
    alias ll="ls -lFGh"
    alias la="ls -aFG"
    alias lla="ls -laFG"
  ;;
  linux*)
    alias ls='ls -AF --color'
    alias ll='ls -lFh'
    alias la='ls -aF'
    alias lla='ls -laFh'
  ;;
esac

function restart () { source $HOME/.zshrc; clear }
function cd () { pushd $@; exa --icons }
function bd () { popd $@; ls }

################################
### rust commands
################################

alias ls="exa --icons"
alias ll="exa -hl --git --icons"
alias la="exa -a --icons"
alias lla="exa -ahl --git --icons"
alias cat="bat"
#alias ps="procs"
#alias find="fd"
#alias grep="rg" # ripgrep

################################
# バージョン管理ツール
################################
# asdf
# asdfコマンドがあったら、asdfの設定を読み込む
if [ -f "/opt/homebrew/opt/asdf/libexec/asdf.sh" ]; then
  . /opt/homebrew/opt/asdf/libexec/asdf.sh
fi

# Volta
# Voltaコマンドがあったら、Voltaの設定を読み込む
if [ -f "$HOME/.volta/bin/volta" ]; then
  export VOLTA_HOME="$HOME/.volta"
  export PATH="$VOLTA_HOME/bin:$PATH"
fi

# SDKMAN
# sdkコマンドがあったら、SDKMANの設定を読み込む
if [ -f "$HOME/.sdkman/bin/sdkman-init.sh" ]; then
  export SDKMAN_DIR="$HOME/.sdkman"
  source "$SDKMAN_DIR/bin/sdkman-init.sh"
fi
#THIS MUST BE AT THE END OF THE FILE FOR SDKMAN TO WORK!!!

# Jabba
# Jabbaコマンドがあったら、Jabbaの設定を読み込む
if [ -s "$HOME/.jabba/jabba.sh" ]; then
  export PATH="$PATH:$HOME/Library/PackageManager/bin"
  source "$HOME/.jabba/jabba.sh"
fi