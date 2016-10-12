<a href="http://apartmate.com/"><img src="https://pbs.twimg.com/profile_images/508779982986805248/3gIuLfgs.png" width="250px" height="250px"></a>

========================

## Installation:

```
git clone https://github.com/apartmate/apartmate.git
```

Make sure you have Node/NPM and Bower installed! To run in the server as root user, make sure your `.bowerrc` has the following:

```
{ "allow_root": true }
```

And then type the following commands to install:

```
sudo npm install pm2 -g
sudo npm install --unsafe-perm
gulp
```
Note: run `gulp local` to compile and watch for changes.
For development and production servers use `gulp dev` and `gulp pro` commands instead. 

## Usage:

See <a href="https://github.com/Unitech/pm2" target="_blank">pm2</a> documentation for further instructions.

To start server on development or localhost:8080 :
```
pm2 start process.json
```

To start server on production (live data):
```
pm2 start process.json --env production
```

## About the servers:

Log into <a href="https://www.digitalocean.com/" target="_blank">digital ocean</a>

It is best to create a new user with root privilages and ssh into the servers.
Instructions <a href="https://www.digitalocean.com/community/tutorials/how-to-add-and-delete-users-on-an-ubuntu-14-04-vps" target="_blank">here</a>

Each server has it's own mongodb database (production and development). Pushing to this github's `master` branch will update the pro.apartmate.ca server (http://www.apartmate.ca)
Pushing to this github's `development` branch will update the dev.apartmate.ca server (http://dev.apartmate.ca)

To move over your work from development into production:
```
git checkout master
git merge development
git push
```

Wait approx one minute for apartmate.ca to be updated after pushing.

The following are the most current backups (snapshots) if need be:

`dev.apartmate.ca (stable)`
`pro.apartmate.ca (stable)`

## Prerender:

In order to cache apartmate related links (aka, blog post, advice columns..) for SEO, follow these steps:

1. Log into <a href="https://prerender.io" target="_blank">prerender.io</a>
2. Click `Add Url` button to open the textbox
3. In another page copy the url link (i.e. http:/apartmate.ca/blog/NAME-OF-ARTICLE )
4. Paste it in the text area and click `Add Url` button again

## Wordpress CMS:

[DEPRICATED] Go to the site <a href="http://www.apartmate.ca:5000/wp-login.php" target="_blank">http://www.apartmate.ca:5000/wp-login.php</a>
and login.

#####  Change Roommate Mixer info

Click `Pages` on the sidebar and then `Roommate Mixer`. Scroll down and fill in the following fields [Date, Time, Link, Address] 
Note: If date has passed, apartmate will automatically show TBA messages to users. No need to remove date if passed.
Then click `update`. This will update the roommate mixer info the home page and events page

#####  Add a blog post

See this link for instructions <a href="http://www.apartmate.ca:5000/wp-login.php" target="_blank">https://codex.wordpress.org/Writing_Posts</a>
The only additional step would be to set the category for `blog`. The article will appear in the blog section.

#####  Add an advice post

See this link for instructions <a href="http://www.apartmate.ca:5000/wp-login.php" target="_blank">https://codex.wordpress.org/Writing_Posts</a>
The only additional step would be to set the categories for   `advice/landlords`, `advice/renters`, `advice/roommates`. 
The article will appear in the correlated section. You may set up multiple advice categories.
Also the user is responsible for ordering all articles.





