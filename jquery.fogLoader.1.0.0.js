/*
 * fogLoader, an ajax modal loader supporting jQuery UI themes
 * by Corbin Camp - ccamp@onebox.com @corbincamp
 * Version 1.0.0
 * Created 2010
 * License: GPL
 * 
 */
(function ($) {
    var _progval = 0;
    var _interval;
    
    $.fn.fogLoader = function (opts) {
        var defaults = {
            message: 'Loading',
            animated: false,
            closeOnEscape: true,
            height: 25,
            maxHeight: false,
            maxWidth: false,
            minHeight: 15,
            minWidth: 20,
            position: 'center',
            width: 135,
            textAlign: 'center',
            wrapText: 'nowrap',
            fontSize: null,
            fontFamily: null,
            fontWeight: null,
            borderRadius: null,
            borderWidth: '1px',
            spell: false,
            style: 'message',
            progressMax: 10,
            activityChar: '.',
            progressDelay: 250,
            progressValue: 0,
            progressMessage: null
        };
        var stgs = null; 
        var spelllen = 1;
        var methods = {
            close: function () {
                $('.ui-progressbar, .ui-progressbar-msg').remove();
                clearInterval(_interval);
                $(this).dialog('close')
            },
            destroy: function () {
                $('.ui-progressbar, .ui-progressbar-msg').remove();
                clearInterval(_interval);
                $(this).dialog('destroy')
            },
            progressValue: function(){
                return _progval;
            },
            updateProgress: function (step) {
                fillProgressBar(step)
            }
        };
        if (typeof opts === 'object' || !opts) {
            stgs = $.extend({}, defaults, opts)
        } else {
            if (methods[opts]) {
                return methods[opts].apply(this, Array.prototype.slice.call(arguments, 1))
            } else {
                $.error('_method ' + opts + ' does not exist on jQuery.fogLoader')
            }
        };
        function fillProgressBar(args) {
            _progval = args.val;
            if(args.msg){
                $('.ui-progressbar-msg').html(args.msg);
            }
            $('.ui-progressbar-value').css('width', _progval  + '%').show();
        }
        $(this).each(function () {
            var dlg = '#ui-dialog-title-' + $(this).attr('id');
            var msg;
            if (stgs.style == 'message') {
                if (stgs.animated) {
                    if (stgs.progressSpell) {
                        msg = stgs.message.substring(0, 1);
                    } else {
                        msg = stgs.message;
                    }
                } else {
                    msg = stgs.message + '...';
                }
            }
            $(this).dialog({
                modal: true,
                resizable: false,
                closeText: '',
                draggable: false,
                closeOnEscape: stgs.closeOnEscape,
                height: stgs.height,
                width: stgs.width,
                maxHeight: stgs.maxHeight,
                minHeight: stgs.minHeight,
                maxWidth: stgs.maxWidth,
                minWidth: stgs.minWidth,
                position: stgs.position,
                title: msg,
                beforeclose: function (a, b) {
                    $('#ui-dialog-title-loader-progressbar').remove();
                    clearInterval(_interval);
                    $(this).dialog('destroy')
                }
            });
            var ttlbar = $('.ui-dialog-titlebar');
            ttlbar.show().addClass('ui-state-default').removeClass('ui-widget-header').css({whiteSpace: stgs.wrapText,'border-width': '0px'});
            // font overrides
            if(stgs.fontSize){ttl.css({fontSize: stgs.fontSize});}
            if(stgs.fontFamily) {ttl.css({fontFamily: stgs.fontFamily});}
            if(stgs.fontWeight){ttlbar.css({fontWeight: stgs.fontWeight})}
            $('.ui-dialog-titlebar-close').remove();
            $('.ui-dialog').css({padding: '0',borderWidth: stgs.borderWidth});
            if (stgs.borderRadius) {
                $('.ui-dialog, .ui-dialog-titlebar').css({'-moz-border-radius': stgs.borderRadius,'-webkit-border-radius': stgs.borderRadius });
            };
            if (stgs.style == 'progressbar') {
                var pbar = $('<div>').attr('id', dlg + '-' + stgs.style)
                                     .css('height', (stgs.height -5) + 'px')
                                     .progressbar({value: stgs.progressValue, max: stgs.progressMax})
                var pbarval = $('.ui-progressbar-value');
                ttlbar.hide();
                $(this).css({height: 'auto', padding: 1, overflow: 'hidden'})
                if(stgs.progressMessage){
                    $(this).append($('<span>').addClass('ui-progressbar-msg').html(stgs.progressMessage).css({margin: '1px', fontSize: '.75em'}));
                }
                $(this).append(pbar);
                pbarval.css('margin', '-2px');
                if (!$.support.htmlSerialize){
                    pbarval.css('height', (stgs.height + 5) + 'px')
                }
                $('.ui-dialog .ui-widget-content').css('border-width', '0px');
                if(stgs.progressValue != false){
                    fillProgressBar(stgs.progressValue);
                }
            }else{
                $(this).hide();
            }
            if (stgs.animated && stgs.style != 'progressbar') {
                stgs.progressMax = stgs.message.length + 3;
                if(stgs.spell){
                    $('.ui-dialog-title').html(stgs.message.substring(0,1));
                }
                _interval = setInterval(function () {
                    var spellmsg = $('.ui-dialog-title').html();
                    if (!spellmsg) {
                        clearInterval(_interval);
                    } else {
                        if (spellmsg.length < (stgs.message.length + (stgs.progressMax - stgs.message.length))) {
                            if (stgs.spell && stgs.animated) {
                                if (spelllen < stgs.message.length) {
                                    spellmsg += stgs.message.substring(spelllen, spelllen+1);
                                } else {
                                    spellmsg += stgs.activityChar;
                                }
                                spelllen++;
                            } else {
                                spellmsg += stgs.activityChar;
                            }
                        } else {
                            spelllen = 1;
                            spellmsg = stgs.spell ? stgs.message.substring(0, 1) : stgs.message;
                        }
                        $('.ui-dialog-title').html(spellmsg);
                    }
                }, stgs.progressDelay);
            };
            $('.ui-widget-overlay').css('position', 'fixed');
        })
    }
})(jQuery);