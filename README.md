# Life v2

I am trying to write a program with JavaScript that mimics some sort of evolution.

Lifeforms inhabit a grid. They eat, reproduce, etc.

My initial idea was to have a list of traits, all numeral values, that represented things like:

  Energy Requirement for Birth: 10
  Max Energy: 100

 Each time a life form reproduced, there would be a chance that some of these traits would be slightly altered in the offspring.
 
 This would serve as some sort of evolution, as I would expect a lifeform with a lower birthing energy requirement to be more succesful.
 But this doesn't lead to anything interesting because the traits I had planned are strictly better or strictly worse depending on the 
 trait. I expect that if life on the grid was sustainable, we would find that at the end of the day we woud be left with superpecies: 
 strict upgrades of what we started with, which would not be interesting.
 
 I want the species to evolve in a way I can't anticipate. I don't really know how to go about doing this. 
 
 We now have plant like creatures that are immobile and reproduce. We also have predatory critters that seek out vegetation when it is sight
 and follow fellow predators if they are persueing prey. When there is no prey in sight, they randomly move from block to block, but make
 no net advances. Predators die out if no vegetation is in sight.
 
 I want some sort of evolution to occur that I cannot anticipate.
 
 I am thinking about including a 3rd creature that seeks out the smaller predators.
 
 This 3rd critter, i'll call it an apex for now, can be multiple blocks long. When it births a child, the structure of these multiple blocks can change.
 
 I want to see if a sustainable grid will produce an apex with an optimal shape.
 

