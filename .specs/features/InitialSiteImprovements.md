# Some improvments to how things work

The inital pass is pretty impressive.  It has much of the functionality that we are looking for in a basic calc.  However, there are some adjustments to be made.  I'm just going to go through a big list of things to address.

Default values for fields are sometimes off.  Item should default to No Item.  This matters for some attacks, like Knock Off or just not having a damage boost item.  I guess that may just be the empty state, but that should probably be explicit.

Status should always default to healthy
Weather and terrain should default to None
I think it would also be nice to have a default set loaded in, just you can see it actually calcluating something
Also, probably most importantly, the actual calculation should be done whenever any value changes.  And, it should be doing the calculation of all moves instead of just choosing one.  The whole concept of this is going to be layout out all the different team members on either side, and how can your team most effectivly deal with the other ones.  Being able to plan quickly an effortlessly is very important, so getting to an answer with the fewest keystrokes and clicks is imporant.

I realize I may not have discribed exactly how the other calcs work in detail and just let you infer it.  I've added a screenshot for each of the calcs we have been looking at.  They are in the features folder.

Basically, using the typeahead to pick the two pokemon you are interested in, setting the moves each one has, adjusting any stats as needed.  Then, maybe there is a field condition or two that need set as well.  The section at the top of these calcs update as each value changes.  Thats also helpful when planning out an upcoming fight, as you may be trying to decide between different items or moves, and you would like to flip between a few different possibilities quickly.

Note that I don't want you to replicate exactly all of the inputs and layout that you see in the screenshots.  I have lots of other ideas for trying to improve over this current UX that most of these calcs share.  I'm more interested in getting the functionality correct at this point.