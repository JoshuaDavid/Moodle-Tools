/* Clear the date restriction on ALL ITEMS IN A COURSE. Do not use this unless 
 * that is your intention. If it is your intention to clear all date restrictions
 * on all assignments, then this is a handy script.
 */
javascript:var jq = document.createElement('script'); document.head.appendChild(jq); jq.onload = main; jq.src = window.location.protocol + '//code.jquery.com/jquery.min.js'; function main() { var delay = 0; $('.editing_update').filter(function(){return $(this).parent().parent().find('.availabilityinfo').length;}).each(function() { var $icon = $(this); $.get(this.href, function(response) { $icon.parent().parent().css('background-color', '#FF3333'); var $form = $(response).find('form'); var action = $form.attr('action'); var data = {}; $form.serializeArray().forEach(function(attr) { data[attr.name] = attr.value; }); data['availablefrom[enabled]'] = "0"; data['availableuntil[enabled]'] = "0"; setTimeout(function() { $icon.parent().parent().css('background-color', '#CCCC00'); $.post(action, data, function() { $icon.parent().parent().css('background-color', '#33FFCC'); $icon.parent().parent().find('.availabilityinfo').hide(); }); }, delay); delay += 1000; }); }); } void 0;