// Source - https://stackoverflow.com/a/13504775
// Posted by Delan Azabani, modified by community. See post 'Timeline' for change history
// Retrieved 2026-08-19, License - CC BY-SA 3.0

$(document).ready(function(){
$('.floater').hover(function() {
    var a = Math.random() * 10 - 5;
    $(this).css('transform', 'rotate(' + a + 'deg)');
}, function() {
    $(this).css('transform', 'none');
});
});