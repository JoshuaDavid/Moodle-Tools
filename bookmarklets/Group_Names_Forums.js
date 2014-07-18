/* Little utility script to put the names of a group, listed in the title, into the body and save.
 * I don't know if anyone will run into this particular situation again, but if anyone does, that's
 * what this script does.
 */
javascript:var fname = document.getElementById("id_name");var fintro = document.getElementById("id_introeditor");fintro.value = fintro.value.replace("List group members here", fname.value.match(/\(([^\)]*)\)/)[1]);fname.form.submit();void 0;
