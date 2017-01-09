# 2017 FRC STEAMworks Score Sheet

This is a quickly made example of how scoring works within the game.

A few assumptions were made while reviewing table 4-1 (rewards) and section 4-4 (rule violations).
* Fouls and Technical Fouls are subtractive from the point score, however in the real game they are additive to the opposing team's score.
* As I currently understand it, the rotors which are spinning at T=0 during autonomous are counted.
* Then, if the same rotors which began spinning in autonomous continue to spin at T=0 during teleop, they are counted a second time.
