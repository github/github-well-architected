---
# SPDX-FileCopyrightText: GitHub and The Project Authors
# SPDX-License-Identifier: MIT
draft: false   # Set to false when ready to publish
title: 'When to use Git LFS'
publishDate: 2024-09-03
params:
  authors: [
    {name: "James Garcia", handle: "colossus9"},
  ]

# Classifications of the framework to drive key concepts, design principles, and architectural best practices
pillars:
  - architecture

# The areas of the GitHub adoption journey. Inspiration taken from docs.github.com
areas:
  - ci-cd-and-devops
  - collaborative-coding
  - developers

# Classifications of industries who may be at different stages of the customer journey.
verticals:
  - automotive
  - manufacturing
  - finance
  - gaming
  - media
  - government
  - information-technology
  - smb-corporate

# Individuals in key roles on the customer journey, typically consisting of one or more administrators and the end-user community.
personas:
  - administrator
  - customer-internal-support
  - developer
  - end-user

# Deployment options for GitHub Enterprise, including Cloud (GHEC), Server (GHES), and Hybrid.
platform:
  - github-enterprise-cloud
  - github-enterprise-cloud-plus-emu
  - github-enterprise-server

# GitHub product functions designed to support every stage of development.
features:
  - repositories

# Deeper-level topics of the GitHub Platform and its features. They are most often interacted with by end-users.
components:
  - best-practice
  - git-lfs
  - version-control

# Associated teams and other GitHub and Partner resources that can provide additional support.
github:
  - engineering-and-product
  - enterprise-support
  - expert-services
  - fast-track
---

<!-- This disables the linting rule for multiple top-level headers -->
<!-- markdownlint-disable MD013 -->
<!-- markdownlint-disable MD025 -->
<!-- markdownlint-disable MD036 -->

A Git repository contains every version of every file. But for some file types, this is not practical. Multiple revisions of large files increase the clone and fetch times for other users of a repository.

There is long-standing advice from the developers of Git (the version control system) that it shouldn't be used for binaries and large files. The short version: _Git as a version control system, no matter where it is hosted, doesn't handle binaries and large files well_. To help address some of the challenges, a Git extension was created that moves files out of the repository and uses a pointer to reference the object and pull down only the version you need in your working space. This extension is Git [Large File Storage (LFS)](https://git-lfs.com). It's source is [located on GitHub](https://github.com/git-lfs/git-lfs).

![lfs-diagram](https://git-lfs.com/images/graphic.gif)

While LFS can help significantly improve the performance of some development workflows, it also introduces new challenges. This article is less concerned with telling you how to use LFS, and more concerned with helping you to understand if and when it is the right fit for you and your teams.

## Key design strategies and checklist

When deciding whether or not to use LFS, here are a list of things to consider:

1. Does the file `diff`?
    - Binaries don't diff
    - Some file formats are a mixture of text and binary
1. Does the file compress well?
    - Image files (png, jpg) are typically already compressed and won't normally compress much further
    - Archive files (zip, tgz) are already compressed and won't compress further
    - Markup files (xml) can be large, but are text and usually compress very well
1. Does the file change often?
    - Binaries and files that don't compress well duplicate when changed

## Scenarios and use cases

Git LFS is an extension for managing large files with Git, offering both advantages and challenges. It's crucial to understand these aspects when considering LFS for your project, especially if contemplating migrating an existing repository to LFS.

Here are some perspectives:

- **Migration to LFS**: While it's a common misconception that Git LFS always necessitates rewriting Git history, this primarily applies when integrating LFS into an existing repository with large files already tracked by Git. Initiating a project with LFS from the start avoids this complexity. However, migrating to LFS later often involves history rewriting to efficiently manage large files from past commits.

- **Extension vs. Native Feature**: Git LFS is an extension, not a built-in feature of Git. This distinction means some additional setup is required, including configuration changes and learning some additional commands specific to LFS.

- **Storage and Bandwidth Considerations**: Contrary to some beliefs, LFS objects can be stored more efficiently on disk and transferred more effectively than regular Git blobs, especially when configured correctly. However, without proper configuration, there can be increased bandwidth and disk space requirements due to the size of the files being managed.

- **Architectural Complexity**: Utilizing Git LFS introduces additional architectural considerations. While Git LFS works seamlessly with its default storage backends like GitHub, integrating it with third-party storage solutions like Artifactory or Nexus can introduce challenges, including potential for corrupt objects. It's important to carefully evaluate and test any such integrations to ensure reliability and performance.

Understanding these aspects can help in making an informed decision about whether Git LFS is the right solution for managing large files in your Git repositories. With the caveats in mind, let's have a look at the use cases for LFS and see how we can determine if LFS is a good path for our repository.

### When to use LFS

Here are some of the use cases where LFS is a clear benefit.

1. Frequently changing binary files
2. Auto-generated manifest files
3. Excessively large files not reviewed by humans
4. A large number of small-sized files

#### Frequently changing binary files

It is well known that binary files (e.g. media, images, etc) are better left outside of the repository, but this often creeps up on developers without realizing the effect. For example, if you're building a website and have a few image files, it's not harmful at first. But over time, these images can turn a 500MB repository into a 10GB repository through multiple commits, and impact the overall performance of the git repository. Using LFS for these files can significantly improve the developer experience and reduce friction with git.

#### Auto-generated manifest files

Many build, test and automation tools can generate manifest files or other text-based data. These are not generally things most people care about keeping with their repo, but often end up there early in the development process for the sake of convenience. If you have a 150MB JSON file that is automatically generated, the odds of it being something humans care about are pretty slim. Using LFS can help reduce the clone time and size of the working directory pretty significantly.

_Note: There is a case where this can be detrimental as well. See below._

#### Excessively large files not reviewed by humans

Just like the case above, if you don't have humans reviewing the changes and are simply storing the large file in git so you can track its history and revert to older versions, you're probably using Git in a way it is not optimized for. Introducing LFS for this will reduce the amount of bloat your developers have to deal with for this convenience.

#### A large number of small-sized files

Handling a large number of small-sized files in a Git repository can lead to inefficiencies and slow down operations like cloning and fetching. While individually these files may not take up much space, their sheer volume can significantly increase the size of the repository and impact performance. Git LFS stores these files outside the main repository, thereby keeping the repository size manageable and improving the speed and efficiency of Git operations. This approach is particularly beneficial for projects that accumulate a vast number of small files over time, ensuring that the repository remains optimized for developer productivity.

### When NOT to use LFS

These are some of the scenarios where LFS may not be a help.

1. Shared low-bandwidth networks with large files that compress well
2. Repositories with excessively large text files that change often
3. Shallow clone workflows

#### Shared low-bandwidth networks with large files that compress well

At first glance the low-bandwidth nature of this scenario seems like a perfect fit for LFS. But if we take into account the repository characteristic that large files compress well, we could be potentially _increasing_ the amount of bandwidth required to clone the repo. For example:

| File Type | File Size | File Count | File Compression |
| :---: | :---: | :---: | :---: |
| `JSON` | `150 MB` | `10` | `85% - 95%` |

In this scenario, an LFS-based clone would pull down 10 files at 150MB each, for a total of 1.5GB across the wire. Even if the user pulls down only one of the files, because LFS doesn't use compression, it costs 150MB to store. If instead, we had stored these 10 files in Git rather than LFS, they'd be compressed at 85%. On-disk a file would be 22MB, and over the wire, the 10 would be only 220MB.

| | Repo 1 | Repo 2 |
| :---: | :---: | :---: |
| **Repo Size on Disk** | `2.01 GiB` | `34.9 GiB` |
| **LFS Size on Disk** | `152 GiB` | `37.2 GiB` |
| **Files per Branch** | `1-2` | `1` |
| **Max File Size** | `1.2 GiB` | `498 MiB` |
| **Files in History** | `794` | `32` |
| **Full Clone Size** | `2.01 GiB` | `34.9 GiB` |
| **Shallow Clone Size** | `492 MiB` | `891 MiB` |
| **LFS Clone Size** | `1.6 GiB` | `902 MiB` |

When comparing the clone sizes above, `Repo 1` benefits more from having a shallow clone than storing files in LFS. These numbers are based on a real world scenario's ratios and ranges. There is the additional issue that each subsequent checkout of a version using LFS would require more bandwidth still. Because the files are text and the compress well, there is another issue of storage on the server side. With the number of files stored in LFS as uncompressed objects, the storage utilization balloons from 2 GiB to 152 GiB. With these factors, LFS is not a useful solution for `Repo 1` in a low-bandwidth shared environment.

This is not the case for `Repo 2`, however. The files don't compress well in this case, so removing them from the repository has a net positive effect on the overall experience. The clone times between `shallow clone` and `lfs pull` are roughly the same, but the impact on the git server, as well as the enumerating of objects on the client is an overall net positive. LFS for `Repo 2` is highly recommended because of the characteristics of the repository.

_Note: To optimize the experience, using `shallow clone` and `partial clone` will greatly improve the developer experience when working with monorepos and extensive history. See [Get up to speed with partial clone and shallow clone](https://github.blog/2020-12-21-get-up-to-speed-with-partial-clone-and-shallow-clone/) for proper guidance._

#### Repositories with excessively large text files that change often

As noted above, text files compress well (see the bottom for how to test compression of a file). If the file changes often, git will be able to handle the compression and decompression of these files. There will, of course, be an impact on certain git operations (i.e. git status), but if they change often you have additional bandwidth and storage considerations that may negate the benefit of LFS (see example above). By keeping up with the latest version of Git you can take advantage of some of the newer features that reduce friction with geometric repacking, merge-ort, or a number of new features released in Git [v2.33](https://github.blog/2021-08-16-highlights-from-git-2-33), [v2.34](https://github.blog/2021-11-15-highlights-from-git-2-34) and [v2.35](https://github.blog/2022-01-24-highlights-from-git-2-35).

#### Shallow clone workflows

When it comes down to cloning the repository, LFS only brings down the file you need for your workspace. This is helpful for keeping the repository nimble. But if you're working with highly compressible or diff-able files, shallow clone and partial clone may provide a better user experience. By avoiding the need to modify history and use a non-native extension, you may get the same effect for users without having to deal with the additional complexity of plugins, configuration and history migration. If your workflow involves full clones, LFS may be benefitial. If your workflow involves shallow or partial clones, LFS adds complexity with little to no benefit for users and admins.

**Note:** Shallow clones inherently introduce additional complexity at the git layer that must be considered. This is especially true when working with monorepos or repositories with extensive history. The use of shallow clones should be carefully evaluated to ensure it aligns with the overall development workflow and requirements.

### Evaluate git compression efficiency

One evaluation we can perform to decide whether a file should be in Git or LFS is a compression level test. This test help us understand whether or not `git` will handle the file efficiently.

It involves creating a new file called `lfstest.rb` and add the following contents:

```ruby
#!/usr/bin/env ruby
require "zlib"

class Numeric
  def percent_of(n)
    self.to_f / n.to_f * 100.0
  end
end

data_to_compress = File.read(ARGV[0])
puts "Input size: #{data_to_compress.size}"
data_compressed = Zlib::Deflate.deflate(data_to_compress)
puts "Compressed size: #{data_compressed.size}"

puts "Compression ratio: #{(100 - (data_compressed.size).percent_of(data_to_compress.size)).to_f.round(2)}%"
```

Next check execution permission on the file:

```bash
chmod +x lfstest.rb
```

Then simply run `lfstest <file>` and you will get sample outputs similar to the following:

For binary file type (e.g. .mp4), there is no diff capability. LFS may be most appropriate:

```bash
$ ./lfstest.rb Untitled.mp4
Input size: 9419571
Compressed size: 8623799
Compression ratio: 8.45%
```

For text file type, there is a high diff capability. Git may be most appropriate:

```bash
$ ./test.rb users1.csv
Input size: 152719
Compressed size: 23065
Compression ratio: 84.9%
```

### High-level heuristics

- If the file does not compress/diff well and changes often, then it should go into LFS for the sake of developer experience
- If the file compresses/diffs well, then it should remain version controlled in git
- If the file does not change often and there are few versions in history, then it may be negligible which route is taken

## Dedication

To our beloved friend John ([@jwiebalk](https://github.com/jwiebalk)), a Hubber who was always there to help and never wanted the credit. ❤️

## Seeking further assistance
<!-- The Hugo shortcode below will fully populate this section -->

{{% seeking-further-assistance-details %}}

## Related links

<!-- The Hugo shortcode below will include a subsection that links to GitHub's documentation. -->

{{% related-links-github-docs %}}

<!-- ### External Resources -->

<!-- Optionally add any external resources that are related to your article or that could provide additional information or context for your readers.
This could include links to tutorials, blog posts, or other articles. -->
