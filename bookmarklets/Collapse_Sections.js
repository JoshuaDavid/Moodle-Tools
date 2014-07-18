/* Hide everything in all sections except for the section titles.
 * This allows you to easily move sections around in a course 
 * without the scroll of doom. 
 * 
 * To return to the normal view, refresh the page.
 */
javascript:[].slice.call(document.querySelectorAll('.section.main .content .section, .section.main .content .summary')).forEach(function(el) {el.style.display="none";});
