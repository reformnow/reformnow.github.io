#!/usr/bin/env ruby
#
# Check for changed posts

require 'shellwords'

Jekyll::Hooks.register :posts, :post_init do |post|
  path = Shellwords.escape(post.path)
  commit_num = `git rev-list --count HEAD #{path}`

  if commit_num.to_i > 1
    lastmod_date = `git log -1 --pretty="%ad" --date=iso #{path}`
    post.data['last_modified_at'] = lastmod_date
  end
end
