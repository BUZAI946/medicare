#!/bin/bash
git filter-branch -f --env-filter '
if [ "$GIT_AUTHOR_EMAIL" = "Serein@users.noreply.github.com" ]; then
  export GIT_AUTHOR_NAME="BUZAI946"
  export GIT_AUTHOR_EMAIL="BUZAI946@users.noreply.github.com"
fi
if [ "$GIT_COMMITTER_EMAIL" = "Serein@users.noreply.github.com" ]; then
  export GIT_COMMITTER_NAME="BUZAI946"
  export GIT_COMMITTER_EMAIL="BUZAI946@users.noreply.github.com"
fi
if [ "$GIT_AUTHOR_NAME" = "phili1999" ]; then
  export GIT_AUTHOR_NAME="phili2013"
fi
if [ "$GIT_COMMITTER_NAME" = "phili1999" ]; then
  export GIT_COMMITTER_NAME="phili2013"
fi
' -- --all
