---
layout: post
title: 'Copying App Settings and Connection Strings Between Azure Web Apps'
date: 2016-01-12 16:00:00
image: # if no image, color defaults dark blue
description: 'Work smarter, not harder using our command line tool!'
tags:
- Azure
- Web
- Configuration
authors: Ken Dale
categories:
- OSS
twitter_text: 'Copying App Settings and Connection Strings Between Azure Web Apps'
---

At [Ritter Insurance Marketing](https://www.ritterim.com/) we utilize [Azure Web Apps](https://azure.microsoft.com/en-us/documentation/articles/app-service-web-overview/) for hosting many of our web applications. [Azure Web Apps](https://azure.microsoft.com/en-us/documentation/articles/app-service-web-overview/) is a platform as a service (PaaS) offering from Microsoft, enabling their customers to host web applications without managing and maintaining the server infrastructure.

One difficulty we've encountered using Azure Web Apps is configuration difficulty arising from spinning up another copy of an application, whether for debugging or other purposes. Using the Azure portal in a web browser, copying app settings and connection strings is a tedious copy and paste process --- especially when there's a bunch of them!

We prefer to work smarter, rather than harder. That said, we're pleased to announce our cross-platform [Azure Web App Configuration Copier](https://github.com/ritterim/azure-web-app-configuration-copier) tool for copying app settings and connection strings between applications!

## Getting started

The [Azure Web App Configuration Copier](https://github.com/ritterim/azure-web-app-configuration-copier) tool is a command line tool built on JavaScript / Node.js.

First, you'll need [Node.js](https://nodejs.org) installed.

Next, the tool uses the Microsoft Azure Cross Platform Command Line tool, available on npm as [azure-cli](https://www.npmjs.com/package/azure-cli). With [Node.js](https://nodejs.org) / npm installed, it's as simple as `npm install -g azure-cli` to install it globally -- then use `azure login` to authenticate.

Now that the prerequisites are ready, we can move onto installing and using the [Azure Web App Configuration Copier](https://github.com/ritterim/azure-web-app-configuration-copier) tool. Do the following:

1. `git clone git@github.com:ritterim/azure-web-app-configuration-copier.git` <small>*(or navigate to the [GitHub repository](https://github.com/ritterim/azure-web-app-configuration-copier) and download the repository manually)*</small>
2. `cd azure-web-app-configuration-copier`
3. `npm install`

We're all set! Now, to run it:

{% highlight text %}

> node main.js \
    --sourceApp MySourceApp \
    --destApp MyDestinationApp \
    --subscription "My Subscription"

{% endhighlight %}

It'll begin copying the app settings and connection strings. Be patient, it takes some time.

**Note:** The `--subscription` parameter is optional. If omitted, it will use the current subscription configured in the azure-cli.

## Contributions

Found a bug or have an idea? We welcome contributions at the [GitHub repository](https://github.com/ritterim/azure-web-app-configuration-copier).

___

We hope you find this tool useful!
