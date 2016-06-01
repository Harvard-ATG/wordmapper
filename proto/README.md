jQuery Alignment Editor usage notes
Mark Schiefsky
February 2015

1. The environment works best in Google Chrome, though it also functions in Firefox and Safari. In Safari the “Export” function is very slow.  

2. Clicking on a word will highlight it in yellow.  When you have highlighted all the words you want to align, press the “Align” button.  The aligned words will turn red, and be highlighted in blue on mouse-over.

3. To remove a word from an alignment, click on that word and press “Align”.

4. Saving is a little tricky because JavaScript (in which this is implemented) does not allow writing directly to the local filesystem due to security reasons. On the Mac:

a) Open a new file in the program "TextEdit" and select "Make Plain Text" in the "Format" menu. Save this file in the same folder as the file you are working on. Give it a name like "table_2015-12-16.html".  

b) When you are ready to save your alignments, use the "export" button to open a new window that will contain the text *along with* the alignments. 

c) Click in the new window, do a "select all" (command-A on the Mac), and paste the entire contents into a new file (command-V on the Mac).  This file now contains the text *with* all the alignments you have added.  If you open this file in the browser it should function exactly like the file you started with.

