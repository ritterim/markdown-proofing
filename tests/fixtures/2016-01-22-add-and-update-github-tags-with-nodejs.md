---
layout: post
title: "Add And Update GitHub Tags With Node.js"
date: 2016-01-22 12:36:45
image:  # if no image, color defaults dark blue
description:
tags: 
- NodeJs
- GitHub
categories:
- Tools
- Development
twitter_text: "Add and Update @GitHub Tags With #nodejs"
authors: Khalid Abuhakmeh
---

In a previous post, [Leveling up our project management]({% post_url 2016-01-15-leveling-up-our-project-mangement%}), I mentioned that we had settled on base set of tags for across our [GitHub organization](https://github.com/ritterim). We thought we had found a tool to allow us to do this, but it turns out that tool didn't work. We didn't want to resort to manually updating all of our repositories, so I wrote this Node.js script.

```javascript
/*
    How To Run
    1. npm install unirest
    2. set the apiToken (get from GitHub)
    3. update the defaultOwner to the organization or account
    4. update the repositories array
    5. update the labels with names and colors
 */
/*
    Configuration
*/
var unirest = require("unirest");
var githubApi = "https://api.github.com";

var apiToken = ""; // your api token
var defaultOwner = ""; // your account / organization
// all the repositories 
var repositories = [
    // { name : "", owner : "" }
    { name : "test-labels" } 
];
// the labels
// target is used to "replace"
var labels = {
    values : [
        { name : "test", color : "ff0000", target : "" },
        { name: "world", color : "00ff00", target : "Hello" }
    ]
}
/*
    Code & Logic
*/
function getOwner(repo) {
    return repo.owner == null ? defaultOwner : repo.owner;
}

repositories.forEach(function (repo) {
      
   var labelsUrl =`${githubApi}/repos/${getOwner(repo)}/${repo.name}/labels`;

   // get existing labels on repository   
    unirest
        .get(labelsUrl)
        .headers("Authorization", `Token ${apiToken}`)
        .headers("User-Agent", "script")
        .end(function (response) {
            var repoLabels = response.body;
            console.log(`successfully retrieved ${repoLabels.length} labels from ${repo.name}`); 
                      
            // loop through labels
            // - If label doesn't exist create it
            // - If label exists and has replaces, replace it
            // - If label exists and doesn't have replace, update it
            labels.values.forEach(function (label) {    
                var exists = repoLabels
                    .findIndex(x => x.name.toLowerCase() === label.name.toLowerCase()) > -1;
                var targetExists = repoLabels
                    .findIndex(x => x.name.toLowerCase() === label.target.toLowerCase()) > -1; 
                    
                var updateLabel = function(name) {
                     unirest.patch(`${labelsUrl}/${name}`)
                        .headers("Authorization", `Token ${apiToken}`)
                        .headers("User-Agent", "script")
                        .type('json')
                        .send(label)
                        .end(function (response) {
                            console.log(`succesfully UPDATED ${name} on ${repo.name}.`)
                        });  
                }; // updateLabel
                                                                           
                if (targetExists) {                                             
                   updateLabel(label.target);                                         
                }                
                else if (exists) {
                   updateLabel(label.name)
                } else {
                   // create label
                    unirest.post(labelsUrl)
                        .headers("Authorization", `Token ${apiToken}`)
                        .headers("User-Agent", "script")
                        .type('json')
                        .send(label)
                        .end(function (response) {
                            console.log(`succesfully ADDED ${label.name} on ${repo.name}.`)
                        });    
                }          
            }); // labels forEach 
   });
}); // repositories forEach
``` 

Save this script, make the necessary modifications, and then run it via the command line.

```console
$ node app.js
```

Hope the script helps other teams looking to normalize the tags across their GitHub repositories. 