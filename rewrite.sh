#!/usr/bin/env bash

git filter-branch -f --env-filter '
    # 2026-03-20 00:00:00 UTC+0530 is 1773945000
    # 2026-03-21 00:00:00 UTC+0530 is 1774031400

    AD_RAW=${GIT_AUTHOR_DATE% *}
    AD_TZ=${GIT_AUTHOR_DATE#* }
    AD_EPOCH=${AD_RAW#@}

    if [ "$AD_EPOCH" -lt "1773945000" ]; then
        AD_EPOCH=$((AD_EPOCH + 172800))
    elif [ "$AD_EPOCH" -lt "1774031400" ]; then
        AD_EPOCH=$((AD_EPOCH + 86400))
    fi
    export GIT_AUTHOR_DATE="@$AD_EPOCH $AD_TZ"

    CD_RAW=${GIT_COMMITTER_DATE% *}
    CD_TZ=${GIT_COMMITTER_DATE#* }
    CD_EPOCH=${CD_RAW#@}

    if [ "$CD_EPOCH" -lt "1773945000" ]; then
        CD_EPOCH=$((CD_EPOCH + 172800))
    elif [ "$CD_EPOCH" -lt "1774031400" ]; then
        CD_EPOCH=$((CD_EPOCH + 86400))
    fi
    export GIT_COMMITTER_DATE="@$CD_EPOCH $CD_TZ"
' -- --all
