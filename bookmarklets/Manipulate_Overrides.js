/* Remove the overridden coloration from either individual cells or entire
 * columns of the gradebook. Simply click the cell in question in the gradebook
 * and choose to override that cell or all cells in the column.
 * 
 * This script was created in response to a bug that would cause random items
 * in the gradebook to be marked as overridden, even when nobody had overridden 
 * them.
 *
 */
javascript:var jqscript = document.createElement('script'); document.body.appendChild(jqscript); jqscript.onload = init; jqscript.src = window.location.protocol + "//code.jquery.com/jquery.min.js"; function init() { var delay = 0; $('body').click(function() { setTimeout(function() { $('.josh-menu').remove(); }, 2500); }); $('.grade.overridden').click(function(e) { var $cell = $(e.target); var $menu = $('<div/>').addClass('josh-menu').css({ background: 'white', width: '15em', 'z-index': 2, 'font-size': '70%', 'position': 'absolute', 'left': e.pageX, 'top': e.pageY, 'border': '1px solid black' }) .append($('<div/>').html('Clear override').click(function() { override($cell); $(this).parent().remove(); }).css('border', '1px solid black')) .append($('<div/>').html('Clear all overrides in column').click(function() { $menu.remove(); var column = $cell[0].classList[3]; if(!column.match(/c\d+/g)) throw up; $cells = $('.grade.overridden.' + column); $cells.slice(0,2).each(function() { var $cell = $(this); delay += 1000; setTimeout(function() { override($cell); }, delay); }); }).css('border', '1px solid black')) .appendTo('body'); }); function override($cell) { var href = $cell.find('a.action-icon').attr('href'); $.get(href, function(response) { var $response = $(response); var $form = $response.find('form'); var data = {}; $form.serializeArray().forEach(function(el) { data[el.name] = el.value; }); data['overridden'] = 0; var action = $form.attr('action'); $.post(action, data, function() { $cell.removeClass('overridden'); }) }); } }; void 0;
