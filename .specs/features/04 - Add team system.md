## Teambuilding

Both the VGC and the Vanilia calc have a teambuilder component.  In the VGC, its only a team of 6 that you can switch between, which reflects how you do a VGC match, pick 6 and train them however.  But, you don't generally change mons between games.

In a nuzlock though, you build up a box of mons, and in planning the fights against tough opponents you want to look over the box and find the right fit for any particular matchup.  The Vanila calc does try to do this, but its very clunky and hard to use well.

Essentailly, you should be able to see the mons in the box, cycle between them, and move them to the current "team" for whatever you are planning.  We don't have to be super strict in only having 6 though, since this is a planning tool, and sometime you are evaluating different options.  Drag and drop seemed ok here to move between box and team, but the reorder logic was pretty annoying.  We can try implementing it with drag/drop and see how it feels though.

The clunky parts where how the persistance was handled, which involved exporting and importing the mons to save them.  The VGC calc has a "save" button for each mon.  But, I think I'd rather have it persist on any change.  That way if you are iterating on a fight, you don't loose any info and have the wrong stuff in the calc.  The things saved are going to be the peristent attributes of the mon.  What it is, the level, nature, ability, ev/iv and moves.  The items are kind of debatable.  I think also include that as well for now, but its pretty common to change things out between fights.

This all is probably backed in localStorage.