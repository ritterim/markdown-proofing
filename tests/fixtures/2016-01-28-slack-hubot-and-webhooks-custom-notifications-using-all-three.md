---
layout: post
title: "Slack, Hubot, and Webhooks: Custom Notifications Using All Three"
date: 2016-01-28 16:00:00
image: # if no image, color defaults dark blue
description: "We're using custom Hubot scripts to get webhooks into Slack!"
tags:
- Hubot
- Slack
- Webhooks
authors:
- Ken Dale
- Khalid Abuhakmeh
categories:
- OSS
twitter_text: 'Slack, Hubot, and Webhooks: Custom Notifications Using All Three'
---

Choosy devs choose [Slack](https://slack.com/). It's dev tested, mother approved. Slack has become the main source of our team collaboration.

One of the benefits of Slack is the sheer number of pre-built integrations. There's integrations for GitHub, Raygun, and [all sorts of stuff](https://slack.com/apps). These work great! But, sometimes you need a *special* custom notification.

For these custom notifications, we've found that creating custom scripts for [our Hubot instance](https://github.com/ritterim/hubot) fills the gap.

## Our Hubot and custom scripts

[Hubot](https://hubot.github.com/) is a chat bot created by GitHub that can work with various chat networks. There are adapters for HipChat, Slack, etc. Hubot can be great for all sorts of fun -- but it can be a platform for Serious Business &trade;, too.

As a team, we've used Hubot in the past with non-Slack chat networks. However, since we've moved to Slack, we've re-discovered some of its usefulness. In that regard, we've created some Hubot scripts that are available on the [https://www.npmjs.com/](https://www.npmjs.com/) public registry.

Currently, we have two published npm scripts:

- [hubot-azure-alert-notifier](https://www.npmjs.com/package/hubot-azure-alert-notifier)
- [hubot-github-issue-label-notifier](https://www.npmjs.com/package/hubot-github-issue-label-notifier)

These are both open source. If you have any ideas, find any bugs, or have any general feedback let us know!
