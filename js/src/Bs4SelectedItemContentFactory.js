import  { ExtendIfUndefined } from './Tools';

function Bs4SelectedItemContentStylingMethodCss(configuration) {
    const defaults = {
            selectedItemContentDisabledClass: 'disabled',
    };
    ExtendIfUndefined(configuration, defaults);

    return {
        disableSelectedItemContent($content){
            $content.addClass(configuration.selectedItemContentDisabledClass )
        }
    }
}

const defSelectedItemStyle = {'padding-left': '0px', 'line-height': '1.5em'};
const defRemoveSelectedItemButtonStyle = {'font-size':'1.5em', 'line-height': '.9em'};

function Bs4SelectedItemContentStylingMethodJs(configuration) {
        const defaults = {
            selectedItemContentDisabledOpacity: '.65',
        };
        ExtendIfUndefined(configuration, defaults);
    
    return {
        disableSelectedItemContent($content){
            $content.css("opacity", configuration.selectedItemContentDisabledOpacity )
        },
    
        createSelectedItemContent($selectedItem, $button){
            $selectedItem.css(defSelectedItemStyle);
            if ($button)
                $button.css(defRemoveSelectedItemButtonStyle);
        }
    }
}

function ComposeBs4SelectedItemContentFactory(stylingMethod, configuration, $) {
        const defaults = {
            selectedItemClass: 'badge',
            removeSelectedItemButtonClass: 'close'
        };
        ExtendIfUndefined(configuration, defaults);
        
        return function (selectedItem, optionItem, removeSelectedItem){
                let $selectedItem = $(selectedItem)
                $selectedItem.addClass(configuration.selectedItemClass);
                let $content = $(`<span/>`).text(optionItem.text);
                $content.appendTo($selectedItem);
                if (optionItem.disabled)
                    stylingMethod.disableSelectedItemContent($content);
                let $button = $('<button aria-label="Close" tabIndex="-1" type="button"><span aria-hidden="true">&times;</span></button>')
                    // bs 'close' class that will be added to button set the float:right, therefore it impossible to configure no-warp policy 
                    // with .css("white-space", "nowrap") or  .css("display", "inline-block"); TODO: migrate to flex? 
                    .css("float", "none").appendTo($selectedItem)
                    .addClass(configuration.removeSelectedItemButtonClass) // bs close class set the float:right
                    .on("click", (jqEvent) => removeSelectedItem(jqEvent));
                
                if (stylingMethod.createSelectedItemContent)
                    stylingMethod.createSelectedItemContent($selectedItem, $button);
                return {
                    disable(isDisabled){ $button.prop('disabled', isDisabled); }
                };
            }
    
}

export { ComposeBs4SelectedItemContentFactory, Bs4SelectedItemContentStylingMethodJs, Bs4SelectedItemContentStylingMethodCss};