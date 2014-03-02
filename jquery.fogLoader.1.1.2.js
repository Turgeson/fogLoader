/*
 * fogLoader, an ajax modal loader supporting jQuery UI themes
 * by Corbin Camp - ccamp@onebox.com @corbincamp
 * Version 1.1.2
 * Created 2014
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
            width: 135,
            height: 25,
            maxWidth: false,
            maxHeight: false,
            minWidth: 20,
            minHeight: 15,
            position: 'center',
            text: {
                align: 'center',
                wrap: 'nowrap'
            },
            font: {
                family: null,
                size: null,
                weight: null
            },
            border: {
                radius: null,
                wdith: '1px'
            },
            spell: false,
            style: 'message',
            activityChar: '.',
            progress: {
                val: 0,
                max: 10,
                text: null,
                loc: 'inside',
                shadow: false,
                delay: 250
            }
        };
        var stgs = null; 
        var spelllen = 1;
        var methods = {
            close: function () {
                $('.ui-progressbar, .ui-progressbar-msg, .progress-label').remove();
                clearInterval(_interval);
                $(this).dialog('close');
            },
            destroy: function () {
                $('.ui-progressbar, .ui-progressbar-msg, .progress-label').remove();
                clearInterval(_interval);
                $(this).dialog('destroy');
            },
            progressValue: function(){
                return _progval;
            },
            updateProgress: function (args) {
                fillProgressBar(args);
            }
        };
        if (typeof opts === 'object' || !opts) {
            stgs = $.extend({}, defaults, opts);
        } else {
            if (methods[opts]) {
                return methods[opts].apply(this, Array.prototype.slice.call(arguments, 1));
            } else {
                $.error('_method ' + opts + ' does not exist on jQuery.fogLoader');
            }
        };
        function fillProgressBar(args) {
            _progval = args.value;
            if(args.msg){
                $('.progress-label').html(args.msg);
            }
            $('.ui-progressbar-value').css('width', _progval  + '%').show();
            if(_progval >=100){
                $('.ui-progressbar-value').css('width', '102%').addClass('ui-corner-all');
            }
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
                    $(this).dialog('destroy');
                }
            });
            var ttlbar = $('.ui-dialog-titlebar');
            ttlbar.show().addClass('ui-state-default').removeClass('ui-widget-header').css({whiteSpace: stgs.text.wrap,'border-width': '0px'});
            // font overrides
            if(stgs.fontSize){ttl.css({fontSize: stgs.font.size});}
            if(stgs.fontFamily) {ttl.css({fontFamily: stgs.font.family});}
            if(stgs.fontWeight){ttlbar.css({fontWeight: stgs.font.weight});}
            $('.ui-dialog-titlebar-close').remove();
            $('.ui-dialog').css({padding: '0',borderWidth: stgs.border.width});
            if (stgs.border.radius) {
                $('.ui-dialog, .ui-dialog-titlebar').css({'-moz-border-radius': stgs.border.radius,'-webkit-border-radius': stgs.border.radius });
            };
            if (stgs.style == 'progressbar') {
                var pbar = $('<div>').attr('id', dlg + '-' + stgs.style)
                                     .css('height', (stgs.height -5) + 'px')
                                     .progressbar({value: stgs.progress.value, max: stgs.progress.max});
                var pbarval = $('.ui-progressbar-value');
                ttlbar.hide();
                $(this).css({height: 'auto', padding: 1, overflow: 'hidden'});
                if(stgs.progress.message){
                    var pmsg = $('<div>').addClass('progress-label').html(stgs.progress.message).css({fontSize: '.75em'});
                    if(stgs.progress.loc == 'top'){
                        pmsg.css({margin: '1px'});
                        $(this).append(pmsg);
                    }else{
                        if(stgs.progress.loc != 'bottom'){
                            pmsg.css({position: 'absolute',left: '50%', top: '1px', fontWeight: 'bold',textShadow: '1px 1px 0 ' + stgs.progress.shadow ? '#fff':''});
                            pbar.append(pmsg);
                        }
                    }
                }
                $(this).append(pbar);
                if(stgs.progress.loc == 'bottom'){
                    $(this).append(pmsg);
                }
                pbarval.css('margin', '-2px');
                if (!$.support.htmlSerialize){
                    pbarval.css('height', (stgs.height + 5) + 'px');
                }
                $('.ui-dialog .ui-widget-content').css('border-width', '0px');
                if(stgs.progress.value !== false){
                    fillProgressBar({val:stgs.progress.value});
                }
            }else{
                $(this).hide();
            }
            if (stgs.animated && stgs.style != 'progressbar') {
                stgs.progress.max = stgs.message.length + 3;
                if(stgs.spell){
                    $('.ui-dialog-title').html(stgs.message.substring(0,1));
                }
                _interval = setInterval(function () {
                    var spellmsg = $('.ui-dialog-title').html();
                    if (!spellmsg) {
                        clearInterval(_interval);
                    } else {
                        if (spellmsg.length < (stgs.message.length + (stgs.progress.max - stgs.message.length))) {
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
                }, stgs.progress.delay);
            };
            $('.ui-widget-overlay').css('position', 'fixed');
        })
    }
})(jQuery);