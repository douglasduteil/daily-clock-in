# daily-clock-in
Nothing important here... 

- 2015/03/02 (post-commit)
- 2015/03/03

### Dirty post-dated commit cmd

```sh
$ git --no-pager log -1 --stat --pretty=fuller
commit 778f8414b4d853c7358609227e2f0262e79af8c7
Author:     Douglas Duteil <douglasduteil@gmail.com>
AuthorDate: Tue Mar 3 00:42:05 2015 +0100
Commit:     Douglas Duteil <douglasduteil@gmail.com>
CommitDate: Tue Mar 3 00:42:05 2015 +0100

$ GIT_AUTHOR_DATE="`LANG=en_US date -R --date='1 day ago'`" GIT_COMMITTER_DATE="$GIT_AUTHOR_DATE" git commit --amend -C HEAD --date="$GIT_AUTHOR_DATE"

$ git --no-pager log -1 --stat --pretty=fuller                               
commit 54e05e99eb2433bfcb76b5c51dd2acd38cfbf283
Author:     Douglas Duteil <douglasduteil@gmail.com>
AuthorDate: Mon Mar 2 00:44:33 2015 +0100
Commit:     Douglas Duteil <douglasduteil@gmail.com>
CommitDate: Mon Mar 2 00:44:33 2015 +0100

```
