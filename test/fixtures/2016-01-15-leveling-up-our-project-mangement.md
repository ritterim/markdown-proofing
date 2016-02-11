---
layout: post
title: 'Leveling Up Our Project Management'
date: 2016-01-15 11:00:00
image: # if no image, color defaults dark blue
description: 'Tweaking our project management approach to work better with GitHub'
tags:
- Development
- Team
- GitHub
authors: Khalid Abuhakmeh
categories:
- Development
twitter_text: 'Leveling Up Our Project Management'
---

 For almost two years, the RIMdev team has worked exclusively in and around [GitHub](https://github.com) tools to manage and deploy our applications. While GitHub has been fun, it hasn't been perfect. In 2016, we are addressing some of our project management processes to deliver features, bug fixes, and all around awesomeness to our users. This post describes what changes we are making to our process.

## ZenHub

GitHub has always lacked organizational tools. The unit of work with GitHub is clearly the **repository**. Most teams work across multiple repositories. Gaining visibility across multiple repositories and projects was growing more difficult.

We decided to adopt [ZenHub](https://zenhub.io) into our process as it gives us some much-needed features we intend to use: 

- Task Boards
- Burndown Charts
- Pipelines
- Estimation

The biggest advantage of ZenHub is it layers right on top of GitHub via a browser extension. The tight integration with GitHub means zero context switching for team members.

## Labels

Our `labels` across repositories were inconsistent and were doing two things: describing the content of the issue, and also defining the status of our issue. Our new approach to labels is to **describe the contents of the issue only.** Pipelines, through ZenHub, better represents the state of the issue.

The labels we've agreed on are the following:

- bug
- enhancement
- question
- database
- story
- wontfix
- hold
- p1
- p2
- p3
- up-for-grabs (OSS)

We are using tools like [Sprinter](https://libraries.io/npm/sprinter) and [org-labels](https://github.com/repo-utils/org-labels) to make this change across all of our organizational repositories.

## Goodbye to Staging Slots

We used [Windows Azure](http://windowsazure.com) staging slots for deployments for that same period, and we came to the realization they were not a good fit for us.

1. Our staging slots were still pointing to the production databases. A deployment to the staging slot that included a database migration would adversely affect production. 
2. Multi-app solutions were deploying to multiple targets, each of which required swapping. Multi-app deployments would create a higher chance of missing a swap.

We treat our `master` branch as the truth. The branch is what is in production at the time, and if any pull request gets merged into that branch, then it should be production ready.

## Release Cadence

We are adopting a strict release cadence for each project currently under our responsibility. Right now we have chosen a **2-week release cycle**. That means whatever issues are deemed **"done"** will be deployed to our production environment. This approach is also known as the [release train](https://en.wikipedia.org/wiki/Software_release_train).

We previously found that waiting for a completed milestone would keep us from deploying features, putting us behind. It also meant there was an opportunity for other features to creep in and increase the size of a deployment. Bigger deployments make us feel uncomfortable.

## Welcome Our New Robot Overlords

![rimbot - horse bot]({{ site.url }}/assets/img/rimbot.png)

We are currently customizing our version of [Hubot](https://hubot.github.com/) to serve the team, communicate important events, and perform tedious tasks. While [Slack](https://slack.com/) integrations are nice, and we do utilize them, we wanted that extra level of configuration.


## Conclusion

As a development team, we are constantly reevaluating our process. We want to deliver on our promise of a great user experience and to do it quickly and efficiently. These alterations are probably not the last time we change our process, but we feel it moves us and the business we service in a positive direction.