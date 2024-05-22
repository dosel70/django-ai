$(".tooltip-symbol").on('mouseover', function(e) {
    var selectedTooltip = $(this).find($(".tooltip-tooltip"))
    selectedTooltip.addClass("tooltip-tooltip-active")
    // selectedMessageBox.css('color', 'white')
    var selectedMessageBox = $(this).next($(".tooltip-messagebox"))
    selectedMessageBox.addClass("Tooltip_show")
    selectedMessageBox.css('display', 'block')
    selectedMessageBox.css('opacity', '1')
})

$(".tooltip-symbol").on('mouseout', function(e) {
    var selectedTooltip = $(this).find($(".tooltip-tooltip"))
    selectedTooltip.removeClass("tooltip-tooltip-active")
    var selectedMessageBox = $(this).next($(".tooltip-messagebox"))
    selectedMessageBox.removeClass("Tooltip_show")
    selectedMessageBox.css('display', 'none')
    selectedMessageBox.css('opacity', '0')
})