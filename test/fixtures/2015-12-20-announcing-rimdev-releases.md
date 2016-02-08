---
layout: post
title: "Announcing RIMdev Releases"
date: 2015-12-20 19:32:44
image: # if no image, color defaults dark blue
description: 'How two developers and one designer conquered release notes'
tags:
- OSS
- GitHub
- ASP.NET 5
authors:
- Khalid Abuhakmeh
- Bill Boga
- Kevin Hougasian
categories:
- OSS
twitter_text: 'Announcing RIMdev Releases'
---

We wanted to create a tool that allowed non-GitHub user's access to our GitHub releases with the hope that they would be more informed about the progress our team is making in squashing bugs, adding features, and kicking butt. With [Releases](https://github.com/ritterim/releases) we can do just that.

![aspnet 5 releases](https://silvrback.s3.amazonaws.com/uploads/7ee735c2-d192-43fa-bb14-b72975aadc67/Latest_releases_large.png)

While being a simple concept, this project packs some heat. Below are some of the features we've added:

- GitHub theming (thanks [@hougasian](https://twitter.com/hougasian))
- Customizable title and logo
- Feedback button (email to link)
- Support for public and private repository release notes
- Full GitHub markdown rendering (all links work!)
- Avatar support
- Latest release notes from all repositories on home page
- Individual repository release notes with paging

The project utilizes ASP.NET 5 and currently runs on Windows and OS X (with mono). It probably could be made to work with CoreCLR, but we haven't tried yet. If you want to try using it, it is simple to get started. Head over to our [GitHub page](https://github.com/ritterim/releases) at https://github.com/ritterim/releases and feel free to fork it. If you are feeling more adventurous, submit a pull request.

___

Thanks to [Bill Boga](https://github.com/billboga), [Kevin Hougasian](https://github.com/hougasian), and other [contributors](https://github.com/ritterim/releases/graphs/contributors).
