
# Inital setup of site

We are going to build out a new site for doing Pokemon damage calculations.  There are already quite a few, but none of them really have all of the features I'm looking for.  This project will be an attempt to mush a few different ones together.
I think the closest match in terms of UI features is this one https://github.com/nerd-of-now/NCP-VGC-Damage-Calculator.  I've pulled it down in ./NCP-VGC-Damage-Calculator
The offical calc is in ./damage-calc.  This has all of the actual calculations for stats, damage, moves, items, etc.  We won't any of that code directly, but it may be good for reference.
Another version is in `./VanillaNuzlockeCalc`.  This has all of the same calc logic, but it also has info about what the trainers are for the different games.  That functinality will be useful, as well as porting over all of that data.  It has some features of the first NCP calc, but the team builder in this one does not work as well.

Add .Cluade files to each of these repos describing them.

I think this is a pretty good basis of functionality.  But, the plan is to convert this whole thing over to Elm to start with.  I prefer working in Elm when possible, and I think it would be neat to try using that language again.

## Setup and basics

Probably the first order of buisness is get the new Elm skelton setup and running.  I ran `elm init` but that is all.  We will need some basic utilities installed, like the encode/decode library.  I'm not exactly sure what else would be needed at this point.  We also need to put together a shell webpage which needs to host the elm code, the build pipeline, and scripts that would be nice to have, something to serve the site on for local dev, etc.

We also need to pull in the libraries for the actual calculations.  Check the readme in the damage-calc project.  You can install the contents off of npm, so we should do that rather than using that code directly so that it can be updated easier in the future.  There are always new games coming out with changes.


## Inital page and starting the port

I don't really know how the other codebases are is structured.  You'll need to dig around to figure out what is going on.  I think the first thing to do would be build out a UI like the VGC calc that has all of the controls and inputs available.  Probably use a better CSS framework than they do.  I think its Elm style elements or something like that.  This should also include any of the UI validations or input limits.

## Actual calcs

Once the UI skeleton is in place, start hooking up a "backend" or some kind of system to talk to the calc library.  All of that communication will be through ports. Whenever values get changed we will need the calc to run and update the results.  All of the different dropdowns and content needs to be filled in as well.