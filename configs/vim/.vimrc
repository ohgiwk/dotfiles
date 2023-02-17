"################################################
" 基本設定
"################################################

set encoding=utf-8   "Vim 内部で使用されるエンコーディングを指定する
scriptencoding utf-8 "Vim Script 内で使用するエンコーディングを指定する

set nocompatible

"#################################
" 表示
"#################################

syntax on           " カラーシンタックス
set number          " 行番号を表示
set ruler           " カーソル位置の表示
set notitle         " タイトル表示
"set list           " 不可視文字を表示
set cursorline      " カーソル行のハイライト
"set cursorcolumn   " カーソル列のハイライト
let &t_ti.="\e[5 q" " カーソルの形状を変更
set whichwrap=b,s,h,l,<,>,[,],~ "行頭、行末で行のカーソル移動を可能にする
set virtualedit=onemore         "カーソルを行末の一つ先まで移動可能にする
set listchars=tab:>-,trail:-,extends:>,precedes:<,nbsp:%,eol:↲
set nowrap          " 折り返しを行わない
set antialias       " アンチエイリアスを有効にする
set scrolloff=8     " 上下の視界を確保
set sidescrolloff=8 " 左右スクロール時の視界を確保
set showtabline=2   " タブバーを常に表示
set laststatus=2
set colorcolumn=80  " 80行目に罫線をいれる
"set columns=120
"set lines=45
set history=1000    " ヒストリーの数
set visualbell t_vb= " ビープ音をオフ
set clipboard+=unnamed " clipboard を有効化
set termguicolors
set t_Co=256

" ####################################
" 検索
" ####################################

set hlsearch     " 検索語句のハイライト
set incsearch    " インクリメンタルサーチを行う
set ignorecase   " 大文字小文字を区別しない
set smartcase    " 大文字と小文字が混在した言葉を検索を行った場合に限り、大文字と小文字を区別する
set wrapscan     " 最尾まで検索を終えたら次の検索で先頭に戻る
set backspace=indent,eol,start
set hidden       " 編集中でも他のファイルを開けるようにする
set showcmd      " 入力中のコマンドを表示する
set confirm      " 保存されてないファイルがある場合は修了前に確認
set autoread     " 外部でファイルが変更された場合に読み直す
set mouse=a      " マウス入力を有効にする
set noswapfile   " スワップファイルを使用しない
set nobackup     " バックアップファイルを作らない
"set directory=~/.vim/tmp
"set backupdir=~/.vim/tmp
"set undodir=~/.vim/tmp
set undodir=~/.vim/undo

set wildmenu     " コマンドラインモードでの<TAB>キーによるファイル名補完を有効にする
set t_ut=

"bufdo tab split  " バッファを全てタブに変更

" 全角スペースをハイライト
highlight ZenkakuSpace cterm=underline ctermfg=lightblue guibg=#666666
au BufNewFile,BufRead * match ZenkakuSpace /　/