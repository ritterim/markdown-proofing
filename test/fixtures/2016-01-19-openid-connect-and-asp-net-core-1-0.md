---
layout: post
title: OpenID Connect and ASP.NET Core 1.0
date: 2016-01-20 13:52:00
description: Demonstrate differences between OpenID Connect middleware on classic ASP.NET and ASP.NET Core 1.0.
tags:
  - OpenID
  - ASP.NET Core 1.0
  - rc1-update1
categories: Development
twitter_text: OpenID Connect with @aspnet #aspnetvnext @openid
authors: Bill Boga
---

***Please note this information is current as of ASP.NET Core 1.0 RC1.***

## Introduction

The overall process of getting OpenID Connect ([OIDC](http://openid.net/connect/)) working on ASP.NET Core 1.0 is similar to previous versions of ASP.NET, but does require knowledge of the various property and package changes. This post
will highlight some of the major differences and demonstrate a few pitfalls to avoid.

## Classic ASP.NET

Here's an example of pre-ASP.NET Core 1.0 `Startup.cs` leveraging OpenID Connect:

```csharp
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OpenIdConnect;
using Owin;
using System.Collections.Generic;
using System.IdentityModel.Tokens;
using System.Security.Claims;
using System.Threading.Tasks;

public class Startup
{
    public void Configuration(IAppBuilder app)
    {
        JwtSecurityTokenHandler.InboundClaimTypeMap = new Dictionary<string, string>();

        app.UseCookieAuthentication(new CookieAuthenticationOptions
        {
            AuthenticationType = "Cookies",
            CookieName = "MyApp",
            CookieSecure = CookieSecureOption.Always
        });

        app.UseOpenIdConnectAuthentication(new OpenIdConnectAuthenticationOptions
        {
            Authority = "https://example.org/",
            ClientId = "my-client",
            Scope = "openid profile email",
            RedirectUri = "https://path-to-app.com",
            ResponseType = "token id_token",
            SignInAsAuthenticationType = "Cookies",
            AuthenticationType = "oidc",
            Notifications = new OpenIdConnectAuthenticationNotifications()
            {
                SecurityTokenValidated = async x =>
                {
                    var identity = x.AuthenticationTicket.Identity;

                    var subject = identity.Claims.FirstOfDefault(y => y.Type == "sub");

                    // Do something with subject like lookup in local users DB.

                    var newIdentity = new ClaimsIdentity(
                        identity.AuthenticationType,
                        "given_name",
                        "role");

                    // Do some stuff to `newIdentity` like adding claims.

                    // Create a new ticket with `newIdentity`.
                    x.AuthenticationTicket = new AuthenticationTicket(
                        newIdentity,
                        x.AuthenticationTicket.Properties);

                    await Task.FromResult(0);
                }
            }
        });
    }
}
```

Then, just prepend a controller or controller-action with `[Authorize]` and you are in business.

## ASP.NET Core 1.0

Now, the same behavior in ASP.NET Core 1.0:

```csharp
using Microsoft.AspNet.Authentication;
using Microsoft.AspNet.Authentication.Cookies;
using Microsoft.AspNet.Authentication.OpenIdConnect;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Authorization.Infrastructure;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Owin;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

public class Startup
{
    // Some boilerplate removed for readability.

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddAuthentication(options =>
        {
            options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        });

        // This section can also be achieved using attributes on controllers and controller-actions.
        services
            .AddMvc(x =>
            {
                x.Filters.Add(new AuthorizeFilter(
                    new AuthorizationPolicy(
                        requirements: new List<RolesAuthorizationRequirement>()
                        {
                            new RolesAuthorizationRequirement(
                                new List<string>() { "User" })
                        },
                        authenticationSchemes: new List<string>() { "Cookies", "oidc" })));
            });
    }

    // Configure is called after ConfigureServices is called.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
    {
        app.UseCookieAuthentication(x =>
        {
            x.AutomaticAuthenticate = true;
            x.CookieName = "MyApp";
            x.CookieSecure = CookieSecureOption.Always;
            x.AuthenticationScheme = "Cookies";
        });

        JwtSecurityTokenHandler.DefaultInboundClaimTypeMap = new Dictionary<string, string>();

        app.UseOpenIdConnectAuthentication(x =>
        {
            x.AutomaticAuthenticate = true;
            x.Authority = "https://example.org/";
            x.ClientId = "my-client";
            x.ResponseType = "token id_token";
            x.AuthenticationScheme = "oidc";
            x.CallbackPath = "signin-oidc"; // This the default-value.

            x.Scope.Add("openid");
            x.Scope.Add("profile");
            x.Scope.Add("email");

            x.Events = new OpenIdConnectEvents()
            {
                OnAuthenticationValidated = async y =>
                {
                    var identity = y.AuthenticationTicket.Principal.Identity as ClaimsIdentity;

                    var subject = identity.Claims.FirstOrDefault(z => z.Type == "sub");

                    // Do something with subject like lookup in local users DB.

                    var newIdentity = new ClaimsIdentity(
                        y.AuthenticationTicket.AuthenticationScheme,
                        "given_name",
                        "role");

                    // Do some stuff to `newIdentity` like adding claims.

                    // Create a new ticket with `newIdentity`.
                    x.AuthenticationTicket = new AuthenticationTicket(
                        new ClaimsPrincipal(newIdentity),
                        y.AuthenticationTicket.Properties,
                        y.AuthenticationTicket.AuthenticationScheme);

                    await Task.FromResult(0);
                }
            };
        });
    }
}
```

## Here are highlights between the two

- `AuthenticationType` is now `AuthenticationScheme`.
- `Scope` is now `IList` instead of `string`.
- `RedirectUri` is gone in favor of `CallbackPath`. Former is an absolute URI while the latter is a post-domain path. This value cannot be blank. See [this issue on GitHub](https://github.com/aspnet/Security/issues/455). **This may cause the most headache if you have many clients registered pointing to the client's base-domain.**
- `Notifications` is now `Events` along with updated property names (i.e. `SecurityTokenValidated` is now `OnAuthenticationValidated` and `RedirectToIdentityProvider` is now `OnRedirectToAuthenticationEndpoint`).

## Some common pitfalls

- Using same `AuthenticationScheme` between `UseCookieAuthentication` and `UseOpenIdConnectAuthentication`. Trying this will work up until the request comes back from the authority. You will receive this exception:

```
System.NotSupportedException: Specified method is not supported.
   at Microsoft.AspNet.Authentication.RemoteAuthenticationHandler`1.HandleSignInAsync(SignInContext context)
   at Microsoft.AspNet.Authentication.AuthenticationHandler`1.<SignInAsync>d__61.MoveNext()
--- End of stack trace from previous location where exception was thrown ---
   at System.Runtime.CompilerServices.TaskAwaiter.ThrowForNonSuccess(Task task)
   at System.Runtime.CompilerServices.TaskAwaiter.HandleNonSuccessAndDebuggerNotification(Task task)
   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()
   at Microsoft.AspNet.Http.Authentication.Internal.DefaultAuthenticationManager.<SignInAsync>d__13.MoveNext()
--- End of stack trace from previous location where exception was thrown ---
   at System.Runtime.CompilerServices.TaskAwaiter.ThrowForNonSuccess(Task task)
   at System.Runtime.CompilerServices.TaskAwaiter.HandleNonSuccessAndDebuggerNotification(Task task)
   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()
   at Microsoft.AspNet.Authentication.RemoteAuthenticationHandler`1.<HandleRemoteCallbackAsync>d__1.MoveNext()
--- End of stack trace from previous location where exception was thrown ---
   at System.Runtime.CompilerServices.TaskAwaiter.ThrowForNonSuccess(Task task)
   at System.Runtime.CompilerServices.TaskAwaiter.HandleNonSuccessAndDebuggerNotification(Task task)
   at System.Runtime.CompilerServices.TaskAwaiter`1.GetResult()
   at Microsoft.AspNet.Authentication.RemoteAuthenticationHandler`1.<HandleRequestAsync>d__0.MoveNext()
--- End of stack trace from previous location where exception was thrown ---
   at System.Runtime.CompilerServices.TaskAwaiter.ThrowForNonSuccess(Task task)
   at System.Runtime.CompilerServices.TaskAwaiter.HandleNonSuccessAndDebuggerNotification(Task task)
   at System.Runtime.CompilerServices.TaskAwaiter`1.GetResult()
   at Microsoft.AspNet.Authentication.AuthenticationMiddleware`1.<Invoke>d__18.MoveNext()
--- End of stack trace from previous location where exception was thrown ---
   at System.Runtime.ExceptionServices.ExceptionDispatchInfo.Throw()
   at Microsoft.AspNet.Authentication.AuthenticationMiddleware`1.<Invoke>d__18.MoveNext()
--- End of stack trace from previous location where exception was thrown ---
   at System.Runtime.CompilerServices.TaskAwaiter.ThrowForNonSuccess(Task task)
   at System.Runtime.CompilerServices.TaskAwaiter.HandleNonSuccessAndDebuggerNotification(Task task)
   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()
   at Microsoft.AspNet.Authentication.AuthenticationMiddleware`1.<Invoke>d__18.MoveNext()
--- End of stack trace from previous location where exception was thrown ---
   at System.Runtime.ExceptionServices.ExceptionDispatchInfo.Throw()
   at Microsoft.AspNet.Authentication.AuthenticationMiddleware`1.<Invoke>d__18.MoveNext()
--- End of stack trace from previous location where exception was thrown ---
   at System.Runtime.CompilerServices.TaskAwaiter.ThrowForNonSuccess(Task task)
   at System.Runtime.CompilerServices.TaskAwaiter.HandleNonSuccessAndDebuggerNotification(Task task)
   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()
   at Microsoft.AspNet.Owin.WebSocketAcceptAdapter.<>c__DisplayClass6_0.<<AdaptWebSockets>b__0>d.MoveNext()
--- End of stack trace from previous location where exception was thrown ---
   at System.Runtime.CompilerServices.TaskAwaiter.ThrowForNonSuccess(Task task)
   at System.Runtime.CompilerServices.TaskAwaiter.HandleNonSuccessAndDebuggerNotification(Task task)
   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()
   at Microsoft.AspNet.Diagnostics.DeveloperExceptionPageMiddleware.<Invoke>d__7.MoveNext()
```

- Ordering `authenticationSchemes` within `AuthorizationPolicy` is **important**. In this particular example, reversing the order (i.e. `new List<string>() { "oidc", "Cookies" }`) will result in a login redirect loop since cookies set during the initial authentication process are never read by the middleware and the request gets passed back to the authority.

## Summary

Aside from middleware name-changes and the separation of concerns between NuGet packages, the new middleware works as-expected with current OIDC providers like [IdentityServer](https://github.com/IdentityServer/IdentityServer3).
