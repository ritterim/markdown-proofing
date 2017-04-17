---
layout: post
title: Deploying Jekyll to Windows Azure App Services
date: 2016-02-10 09:43:52
image:  # if no image, color defaults dark blue
description: A Kudu script that works!
tags:
- Windows Azure
- Kudu
categories:
- Development
twitter_text: 'Deploying #jekyll to #windowsazure app services'
authors: Khalid Abuhakmeh
---

As the development team at [Ritter Insurance Marketing](https://ritterim.com), we are leaning more on static site generation than ever. We have chosen [Jekyll](https://jekyllrb.com/) as our static site generator of choice. We actually host this blog on [GitHub](https://github.com) pages, but there are other marketing sites we manage that need to go through a more rigorous deployment cycle, Dev. to QA then to Prod, which doesn't fit well on GitHub. We also utilize [Windows Azure](https://windowsazure.com) for our production environment. To keep our apps consistent, I wanted to figure out how to deploy a Jekyll site from GitHub to Windows Azure App Services (Web Apps).

## Step 1 : Setup GitHub Deployment  

This step is pretty simple, and I am not going to rehash it here. If you don't know how to do deploy via GitHub I recommend this [post](https://azure.microsoft.com/en-us/documentation/articles/web-sites-publish-source-control/) from Microsoft.

## Step 2 : Setup Scripts

I actually started with [Scott Hanselman's](http://www.hanselman.com/blog/RunningTheRubyMiddlemanStaticSiteGeneratorOnMicrosoftAzure.aspx) example but found a few issues with it. The two issues were located in the `getruby.cmd` file.

First, I updated line #1 of the command file. The previous first line of `ECHO ON` was spitting out each line as if it were a command into the Azure Console output, which didn't end well for the deployment. Switching to the following fixed this problem.

```text
@if "%SCM_TRACE_LEVEL%" NEQ "4" @echo off
```

Secondly, I updated the creation script of the `tools` folder to be more defensive. Previously it couldn't find the tools folder to move into and create the `r` folder where Ruby will be installed.

```text
REM I am in the repository folder
pushd D:\home\site\deployments
if not exist tools md tools
cd tools 
if not exist r md r
cd r 
if exist ruby-2.2.4-x64-mingw32 goto end
```

 Finally, I upgraded the version of Ruby to the latest installer (2.2.4). All issues I had with the original script should now be fixed in the files below. Now that the scripts are updated, you will need to create four files in your `git` repository, if they are not already there.

1. `.deployment`
2. `getruby.cmd`
3. `deploy.cmd`
4. `Gemfile`

### .deployment

The `.deployment` file will be seen by Kudu and run `deploy.cmd`.

```text
[config]
command = deploy.cmd
```

### .deploy.cmd

The `deploy.cmd` file does two things:

- Call `getruby.cmd` and ensures Ruby is installed
- Kudu sync the files from Jekyll under the `_site` directory

```text
@if "%SCM_TRACE_LEVEL%" NEQ "4" @echo off

:: ----------------------
:: KUDU Deployment Script
:: Version: 1.0.6
:: ----------------------

:: Prerequisites
:: -------------

:: Verify node.js installed
where node 2>nul >nul
IF %ERRORLEVEL% NEQ 0 (
  echo Missing node.js executable, please install node.js, if already installed make sure it can be reached from current environment.
  goto error
)

:: Setup
:: -----

setlocal enabledelayedexpansion

SET ARTIFACTS=%~dp0%..\artifacts

IF NOT DEFINED DEPLOYMENT_SOURCE (
  SET DEPLOYMENT_SOURCE=%~dp0%.
)

IF NOT DEFINED DEPLOYMENT_TARGET (
  SET DEPLOYMENT_TARGET=%ARTIFACTS%\wwwroot
)

IF NOT DEFINED NEXT_MANIFEST_PATH (
  SET NEXT_MANIFEST_PATH=%ARTIFACTS%\manifest

  IF NOT DEFINED PREVIOUS_MANIFEST_PATH (
    SET PREVIOUS_MANIFEST_PATH=%ARTIFACTS%\manifest
  )
)

IF NOT DEFINED KUDU_SYNC_CMD (
  :: Install kudu sync
  echo Installing Kudu Sync
  call npm install kudusync -g --silent
  IF !ERRORLEVEL! NEQ 0 goto error

  :: Locally just running "kuduSync" would also work
  SET KUDU_SYNC_CMD=%appdata%\npm\kuduSync.cmd
)
ECHO CALLING GET RUBY

call :ExecuteCmd "getruby.cmd"

ECHO WE MADE IT

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: Deployment
:: ----------

echo Handling Basic Web Site deployment.

:: 1. KuduSync
IF /I "%IN_PLACE_DEPLOYMENT%" NEQ "1" (
  call :ExecuteCmd "%KUDU_SYNC_CMD%" -v 50 -f "%DEPLOYMENT_SOURCE%/_site" -t "%DEPLOYMENT_TARGET%" -n "%NEXT_MANIFEST_PATH%" -p "%PREVIOUS_MANIFEST_PATH%" -i ".git;.hg;.deployment;deploy.cmd"
  IF !ERRORLEVEL! NEQ 0 goto error
)

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

:: Post deployment stub
IF DEFINED POST_DEPLOYMENT_ACTION call "%POST_DEPLOYMENT_ACTION%"
IF !ERRORLEVEL! NEQ 0 goto error

goto end

:: Execute command routine that will echo out when error
:ExecuteCmd
setlocal
set _CMD_=%*
call %_CMD_%
if "%ERRORLEVEL%" NEQ "0" echo Failed exitCode=%ERRORLEVEL%, command=%_CMD_%
exit /b %ERRORLEVEL%

:error
endlocal
echo An error has occurred during web site deployment.
call :exitSetErrorLevel
call :exitFromFunction 2>nul

:exitSetErrorLevel
exit /b 1

:exitFromFunction
()

:end
endlocal
echo Finished successfully.
```

### getruby.cmd

The `getruby.cmd` file will download the latest version of Ruby and install it on your App Service instance. In addition to that, it will install all the dependencies in your `Gemfile` which is below. Finally, it will execute the `jekyll build` command via `bundler`.

```text
@if "%SCM_TRACE_LEVEL%" NEQ "4" @echo off

REM Put Ruby in Path
REM You can also use %TEMP% but it is cleared on site restart. Tools is persistent.
SET PATH=%PATH%;D:\home\site\deployments\tools\r\ruby-2.2.4-x64-mingw32\bin

REM I am in the repository folder
pushd D:\home\site\deployments
if not exist tools md tools
cd tools 
if not exist r md r
cd r 
if exist ruby-2.2.4-x64-mingw32 goto end

echo No Ruby, need to get it!

REM Get Ruby and Rails
REM 64bit
curl -o ruby224.zip -L https://bintray.com/artifact/download/oneclick/rubyinstaller/ruby-2.2.4-x64-mingw32.7z?direct
REM Azure puts 7zip here!
echo START Unzipping Ruby
SetLocal DisableDelayedExpansion & d:\7zip\7za x -xr!*.ri -y ruby224.zip > rubyout
echo DONE Unzipping Ruby

REM Get DevKit to build Ruby native gems  
REM If you don't need DevKit, rem this out.
curl -o DevKit.zip http://cdn.rubyinstaller.org/archives/devkits/DevKit-mingw64-64-4.7.2-20130224-1432-sfx.exe
echo START Unzipping DevKit
d:\7zip\7za x -y -oDevKit DevKit.zip > devkitout
echo DONE Unzipping DevKit

REM Init DevKit
ruby DevKit\dk.rb init

REM Tell DevKit where Ruby is
echo --- > config.yml
echo - D:/home/site/deployments/tools/r/ruby-2.2.4-x64-mingw32 >> config.yml

REM Setup DevKit
ruby DevKit\dk.rb install

REM Update Gem223 until someone fixes the Ruby Windows installer https://github.com/oneclick/rubyinstaller/issues/261
curl -L -o update.gem https://github.com/rubygems/rubygems/releases/download/v2.2.3/rubygems-update-2.2.3.gem
call gem install --local update.gem
call update_rubygems --no-ri --no-rdoc > updaterubygemsout
ECHO What's our new Rubygems version?
call gem --version
call gem uninstall rubygems-update -x

popd

:end

REM Need to be in Reposistory
cd %DEPLOYMENT_SOURCE%
cd

call gem install bundler

ECHO Bundler install (not update!)
call bundle install

cd %DEPLOYMENT_SOURCE%
cd

ECHO Running Jekyll
call bundle exec jekyll build

REM KuduSync is after this!
```

### Gemfile

If you **don't** already have a `Gemfile`, create one that looks like the following.

```text
source 'https://rubygems.org'

gem 'github-pages'
```

## Deploying

Once these files are committed to your repository, Kudu should deploy your site. Be patient during the first deployment, as it may take up to 3 minutes to download and install Ruby. I found on my instance, after the Ruby installation, that generating a simple Jekyll site took less than 10 seconds. Obviously your results will vary depending on your site.

## Conclusion

It took a little work to get this right. I thought the `Azure CLI` would have a Jekyll deployment template all ready for use, but it didn't. The nice thing about this deployment script is it will work for any Jekyll setup and is easy to modify if you need to add other steps. If you need more Ruby dependencies please use the `Gemfile` and it should just work. I hope you found this post helpful.

**Side note: running the `deploy.cmd` from the Azure Console does not guarantee the environment variables will be the same as when Kudu runs the `deploy.cmd`. This can make it difficult to debug issues.**
