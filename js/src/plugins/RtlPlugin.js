import {getIsRtl, AttributeBackup} from '../ToolsDom';
import {isBoolean} from '../ToolsJs';

export function RtlPlugin(pluginData){
    let {configuration, staticContent} = pluginData;
    let {isRtl} = configuration;
    let forceRtlOnContainer = false; 
    if (isBoolean(isRtl))
        forceRtlOnContainer = true;
    else
        isRtl = getIsRtl(staticContent.initialElement);
    
    var attributeBackup = AttributeBackup();
    if (forceRtlOnContainer){
        attributeBackup.set(staticContent.containerElement, "dir", "rtl");
    }
    else if (staticContent.selectElement){
        var dirAttributeValue = staticContent.selectElement.getAttribute("dir");
        if (dirAttributeValue){
            attributeBackup.set(staticContent.containerElement, "dir", dirAttributeValue);
        }
    } 
    return {
        afterConstructor(multiSelect){
            var origCreatePopperConfiguration = multiSelect.createPopperConfiguration.bind(multiSelect);
            multiSelect.createPopperConfiguration = () => {
                var configuration = origCreatePopperConfiguration();
                configuration.placement = isRtl?'bottom-end':'bottom-start';
                return configuration;
            }
            return attributeBackup.restore;
        }
    }
}