---
layout: post
title: "Windows Azure, IdentityServer3, and Valid Issuers"
date: 2016-01-16 16:35:33
image:  # if no image, color defaults dark blue
description: "a frustrating bug while hosting in the cloud"
tags:
- Security
- Windows Azure
categories:
- Development
twitter_text: "#windowsazure, #identityserver3, and valid issuers via RIMdev @aspnet @dotnet"
authors:
- Khalid Abuhakmeh
- Bill Boga
- Ken Dale
---

At [Ritter Insurance Marketing](https://ritterim.com), we utilize [IdentityServer3](https://github.com/IdentityServer/IdentityServer3) for our authentication mechanism. It has been almost a year of hosting in [Windows Azure](https://windowsazure.com) with great success. While it has been a positive experience, but there has been **one frustrating issue**. Unpredictably, our authentication system would break, leaving our applications inaccessible. We started noticing a specific exception in our error log when these events would occur:

{% highlight text %}
System.IdentityModel.Tokens.SecurityTokenInvalidIssuerException

IDX10205: Issuer validation failed. Issuer: 'https://auth.ritterim.com/identity'. Did not match: validationParameters.ValidIssuer: 'null' or validationParameters.ValidIssuers: 'https://auth.ritterim.com/, https://rim-auth-east.azurewebsites.net/identity'.
{% endhighlight %}

We have noticed that the `Issuer` url value being provided by an authentication request changes randomly in Windows Azure. The unknown bug causes our applications to break. While the change is random, the expected issuer urls are not. We have narrowed it down to these known variations.

- `https://{custom domain name}.com`
- `https://{custom domain name}.com/identity`
- `https://{azure app name}.azurewebsites.net`
- `https://{azure app name}.azurewebsites.net/identity`

To setup the valid issuers for IdentityServer3, we just use the APIs provided by the library.

{% highlight csharp %}
app.UseOpenIdConnectAuthentication(new OpenIdConnectAuthenticationOptions
{
    // other settings...
    TokenValidationParameters = new TokenValidationParameters()
    {
        AuthenticationType = "Cookies",
        // a comma seperated list of urls
        ValidIssuers = config.ValidIssuers
    }
    // other settings...
});
{% endhighlight %}

We hope we've found all the variations, and for the last several weeks our authentication has become a lot more stable. I hope this helps anyone experiencing issues with IdentityServer3 and Windows Azure.
