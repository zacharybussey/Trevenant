## QOL features

Now that we have the dex info pulled in, I think we can do some really neat stuff that other calcs don't.

We should be able to get icons for all the pokemon now.  Lets set that up so all the box buttons, trainer team, and the top damage calc section have icons for all of the mons.  Oh lets throw our boy Trevenat in the top nav somewhere, and the favicon.

The Smogon team builder... which, I don't think is included in the libs we pulled from, but that probably uses the same libs for its own code, anyways, that has the concept of "usually usless moves".  So, a mon might learn 50 moves, but most of them are junk and you only get to pick 4.  I'd like to extend that idea into other things, like specifically the items.  You generally only use maybe 10 or 15 different items in a run, and most of them are not useful.  It would be nice to come up with a good list of items for each game and maybe rank them by usefulness.  Having another section on the bottom of the list for the not so good items.

Another big thing, now that we have the dex info, would be to help suggest moves and abilities based on the mon you are actually using.  Every other calc just shows you all of the items in a list and you have to find the ability you want.  But, each mon really only has up to 3 options.  That info should be in the dex lib.  We would want to do a similar thing where we have the 3 actual options and then everything else.  Pokemon is a really complex game, and sometimes you can change abilities to other ones that you don't normally have, so we still want to keep everything available, but suggest the 99.9 percent option.

And, this also goes into the moves.  We can use the dex lib to get the list of moves a mon is actually able to use, either by learning or TM, etc.  Extra credit would be if also subtly tell the player if its a TM, HM, learnset, egg, whatever else move, but thats pretty secondary info, so some suble helper text should be used.  If we can get the same kind of list that the team builder uses that also is the usually useless moves, that would be good too, but I find its not always the case for Nuzlocks, and you often are using lower level mons anyways that can't get the good moves yet.  If you can't readily find that right away, its fine to skip that part.

I'd also like to look into surfacing accuracy of moves at the very least.  Possibly secondary effects of moves as well.  Just something to give you odds on Focus Blast missing and then loosing your mon to a crit.

And, possibly do something different with representing crits.  I'm thinking of always having the calc run the crit damage as well and then adding a representation of that somehow.

There are also a couple of things that other calcs do that we should probably include as well.  That would be stuff like abilities that trigger weather should automatically set that weather when the ability is selected by the user or the trainer mon has that ability.  Or, holding a flame orb should burn the mon holding it, and probably boost damage if its guts.  There should be a way to find these triggers in the other projects.