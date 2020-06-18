/*!
  * DashboardCode BsMultiSelect v0.6.14 (https://dashboardcode.github.io/BsMultiSelect/)
  * Copyright 2017-2020 Roman Pokrovskij (github user rpokrovskij)
  * Licensed under APACHE 2 (https://github.com/DashboardCode/BsMultiSelect/blob/master/LICENSE)
  */
function PluginManager(plugins, pluginData) {
  var instances = [];

  if (plugins) {
    for (var i = 0; i < plugins.length; i++) {
      var instance = plugins[i](pluginData);
      if (instance) instances.push(instance);
    }
  }

  var disposes = [];
  return {
    buildApi: function buildApi(api) {
      for (var _i = 0; _i < instances.length; _i++) {
        var _instances$_i$buildAp, _instances$_i;

        var dispose = (_instances$_i$buildAp = (_instances$_i = instances[_i]).buildApi) == null ? void 0 : _instances$_i$buildAp.call(_instances$_i, api);
        if (dispose) disposes.push(dispose);
      }
    },
    dispose: function dispose() {
      for (var _i2 = 0; _i2 < disposes.length; _i2++) {
        disposes[_i2]();
      }

      disposes = null;

      for (var _i3 = 0; _i3 < instances.length; _i3++) {
        var _instances$_i3$dispos, _instances$_i2;

        (_instances$_i3$dispos = (_instances$_i2 = instances[_i3]).dispose) == null ? void 0 : _instances$_i3$dispos.call(_instances$_i2);
      }

      instances = null;
    }
  };
}
function plugDefaultConfig(constructors, defaults) {
  for (var i = 0; i < constructors.length; i++) {
    var _constructors$i$plugD, _constructors$i;

    (_constructors$i$plugD = (_constructors$i = constructors[i]).plugDefaultConfig) == null ? void 0 : _constructors$i$plugD.call(_constructors$i, defaults);
  }
}
function plugMergeSettings(constructors, configuration, defaults, settings) {
  for (var i = 0; i < constructors.length; i++) {
    var _constructors$i$plugM, _constructors$i2;

    (_constructors$i$plugM = (_constructors$i2 = constructors[i]).plugMergeSettings) == null ? void 0 : _constructors$i$plugM.call(_constructors$i2, configuration, defaults, settings);
  }
}
function plugStaticDom(constructors, pluginData) {
  for (var i = 0; i < constructors.length; i++) {
    var _constructors$i$plugS, _constructors$i3;

    (_constructors$i$plugS = (_constructors$i3 = constructors[i]).plugStaticDom) == null ? void 0 : _constructors$i$plugS.call(_constructors$i3, pluginData);
  }
}

function isBoolean(value) {
  return value === true || value === false;
}
function isString(value) {
  return value instanceof String || typeof value === 'string';
}
function extendIfUndefined(destination, source) {
  for (var property in source) {
    if (destination[property] === undefined) destination[property] = source[property];
  }
}
function shallowClearClone(source) {
  // override previous, no null and undefined
  var destination = {};

  for (var property in source) {
    // TODO:  Object.assign (need polyfill for IE11)
    var v = source[property];
    if (!(v === null || v === undefined)) destination[property] = v;
  }

  for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    sources[_key - 1] = arguments[_key];
  }

  if (sources) sources.forEach(function (s) {
    for (var _property in s) {
      var _v = s[_property];
      if (!(_v === null || _v === undefined)) destination[_property] = _v;else if (destination.hasOwnProperty(_property)) {
        delete destination[_property];
      }
    }
  });
  return destination;
}

function forEachRecursion(f, i) {
  if (!i) return;
  f(i.value);
  forEachRecursion(f, i.prev);
}

function List() {
  var tail = null;
  var count = 0;
  return {
    add: function add(e) {
      if (tail) {
        tail.next = {
          value: e,
          prev: tail,
          next: null
        };
        tail = tail.next;
      } else tail = {
        value: e,
        prev: null,
        next: null
      };

      count++;
      var node = tail;

      function remove() {
        if (node.prev) {
          node.prev.next = node.next;
        }

        if (node.next) {
          node.next.prev = node.prev;
        }

        if (tail == node) {
          tail = node.prev;
        }

        count--;
      }

      return remove;
    },
    forEach: function forEach(f) {
      forEachRecursion(f, tail);
    },
    getTail: function getTail() {
      return tail ? tail.value : null;
    },
    getCount: function getCount() {
      return count;
    },
    isEmpty: function isEmpty() {
      return count == 0;
    },
    reset: function reset() {
      tail = null;
      count = 0;
    }
  };
}
function DoublyLinkedList(getPrev, setPrev, getNext, setNext) {
  var head = null,
      tail = null;
  var count = 0;
  return {
    add: function add(e, next) {
      if (!tail) {
        head = tail = e;
        setPrev(e, null);
        setNext(e, null);
      } else {
        if (!next) {
          setPrev(e, tail);
          setNext(e, null);
          setNext(tail, e);
          tail = e;
        } else {
          if (next === head) head = e;
          var prev = getPrev(next);
          setNext(e, next);
          setPrev(next, e);

          if (prev) {
            setPrev(e, prev);
            setNext(prev, e);
          } else {
            setPrev(e, null);
          }
        }
      }

      count++;
    },
    remove: function remove(e) {
      var next = getNext(e);
      var prev = getPrev(e);

      if (prev) {
        setNext(prev, next);
      }

      if (next) {
        setPrev(next, prev);
      }

      if (tail == e) {
        tail = prev;
      }

      if (head == e) {
        head = next;
      }

      count--;
    },
    getHead: function getHead() {
      return head;
    },
    getTail: function getTail() {
      return tail;
    },
    getCount: function getCount() {
      return count;
    },
    isEmpty: function isEmpty() {
      return count == 0;
    },
    reset: function reset() {
      tail = head = null;
      count = 0;
    }
  };
}
function ArrayFacade() {
  var list = [];
  return {
    push: function push(e) {
      list.push(e);
    },
    add: function add(e, key) {
      list.splice(key, 0, e);
    },
    get: function get(key) {
      return list[key];
    },
    getNext: function getNext(key, predicate) {
      var count = list.length;
      var start = key + 1;

      if (key < count) {
        if (!predicate) return list[start];

        for (var i = start; i < count; i++) {
          var c = list[i];
          if (predicate(c)) return c;
        }
      }
    },
    remove: function remove(key) {
      var e = list[key];
      list.splice(key, 1);
      return e;
    },
    forLoop: function forLoop(f) {
      for (var i = 0; i < list.length; i++) {
        var e = list[i];
        f(e);
      }
    },
    getHead: function getHead() {
      return list[0];
    },
    getCount: function getCount() {
      return list.length;
    },
    isEmpty: function isEmpty() {
      return list.length == 0;
    },
    reset: function reset() {
      list = [];
    }
  };
}
function composeSync() {
  for (var _len2 = arguments.length, functions = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    functions[_key2] = arguments[_key2];
  }

  return function () {
    return functions.forEach(function (f) {
      if (f) f();
    });
  };
}
function defCall() {
  for (var _len3 = arguments.length, functions = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    functions[_key3] = arguments[_key3];
  }

  for (var _i = 0, _functions = functions; _i < _functions.length; _i++) {
    var f = _functions[_i];

    if (f) {
      if (f instanceof Function) {
        var tmp = f();
        if (tmp) return tmp;
      } else return f;
    }
  }
}
function ObservableValue(value) {
  var list = List();
  return {
    getValue: function getValue() {
      return value;
    },
    setValue: function setValue(newValue) {
      value = newValue;
      list.forEach(function (f) {
        return f(newValue);
      });
    },
    attach: function attach(f) {
      return list.add(f);
    },
    detachAll: function detachAll() {
      list.reset();
    }
  };
}
function ObservableLambda(func) {
  var list = List();
  var value = func();
  return {
    getValue: function getValue() {
      return value;
    },
    call: function call() {
      value = func();
      list.forEach(function (f) {
        return f(value);
      });
    },
    attach: function attach(f) {
      return list.add(f);
    },
    detachAll: function detachAll() {
      list.reset();
    }
  };
}

function findDirectChildByTagName(element, tagName) {
  var value = null;

  for (var i = 0; i < element.children.length; i++) {
    var tmp = element.children[i];

    if (tmp.tagName == tagName) {
      value = tmp;
      break;
    }
  }

  return value;
}
function closestByTagName(element, tagName) {
  return closest(element, function (e) {
    return e.tagName === tagName;
  }); // TODO support xhtml?  e.tagName.toUpperCase() ?
}
function closestByClassName(element, className) {
  return closest(element, function (e) {
    return e.classList.contains(className);
  });
}
function closestByAttribute(element, attributeName, attribute) {
  return closest(element, function (e) {
    return e.getAttribute(attributeName) === attribute;
  });
}
function containsAndSelf(node, otherNode) {
  return node === otherNode || node.contains(otherNode);
}
function getDataGuardedWithPrefix(element, prefix, name) {
  var tmp1 = element.getAttribute('data-' + prefix + '-' + name);

  if (tmp1) {
    return tmp1;
  } else {
    var tmp2 = element.getAttribute('data-' + name);
    if (tmp2) return tmp2;
  }

  return null;
}

function closest(element, predicate) {
  if (!element || !(element instanceof Element)) return null; // should be element, not document (TODO: check iframe)

  if (predicate(element)) return element;
  return closest(element.parentNode, predicate);
}

function siblingsAsArray(element) {
  var value = [];

  if (element.parentNode) {
    var children = element.parentNode.children;
    var l = element.parentNode.children.length;

    if (children.length > 1) {
      for (var i = 0; i < l; ++i) {
        var e = children[i];
        if (e != element) value.push(e);
      }
    }
  }

  return value;
}
function getIsRtl(element) {
  var isRtl = false;
  var e = closestByAttribute(element, "dir", "rtl");
  if (e) isRtl = true;
  return isRtl;
}
function EventBinder() {
  var list = [];
  return {
    bind: function bind(element, eventName, handler) {
      element.addEventListener(eventName, handler);
      list.push({
        element: element,
        eventName: eventName,
        handler: handler
      });
    },
    unbind: function unbind() {
      list.forEach(function (e) {
        var element = e.element,
            eventName = e.eventName,
            handler = e.handler;
        element.removeEventListener(eventName, handler);
      });
    }
  };
}
function AttributeBackup() {
  var list = [];
  return {
    set: function set(element, attributeName, attribute) {
      var currentAtribute = element.getAttribute(attributeName);
      list.push({
        element: element,
        currentAtribute: currentAtribute,
        attribute: attribute
      });
      element.setAttribute(attributeName, attribute);
    },
    restore: function restore() {
      list.forEach(function (e) {
        var element = e.element,
            attributeName = e.attributeName,
            attribute = e.attribute;
        if (attributeName) element.setAttribute(attributeName, attribute);else element.removeAttribute(attributeName);
      });
    }
  };
}
function EventLoopFlag(window) {
  var flag = false;
  return {
    get: function get() {
      return flag;
    },
    set: function set() {
      flag = true;
      window.setTimeout(function () {
        flag = false;
      }, 0);
    }
  };
}

function addStyling(element, styling) {
  var backupStyling = {
    classes: [],
    styles: {}
  };

  if (styling) {
    var classes = styling.classes,
        styles = styling.styles;
    classes.forEach(function (e) {
      return element.classList.add(e);
    }); // todo use add(classes)

    backupStyling.classes = classes.slice();

    for (var property in styles) {
      backupStyling.styles[property] = element.style[property];
      element.style[property] = styles[property]; // todo use Object.assign (need polyfill for IE11)
    }
  }

  return backupStyling;
}

function removeStyling(element, styling) {
  if (styling) {
    var classes = styling.classes,
        styles = styling.styles;
    classes.forEach(function (e) {
      return element.classList.remove(e);
    }); // todo use remove(classes)

    for (var property in styles) {
      element.style[property] = styles[property];
    } // todo use Object.assign (need polyfill for IE11)

  }
}

function toggleStyling(element, styling) {
  var backupStyling = {
    classes: [],
    styles: {}
  };
  var isOn = false;
  return function (value) {
    if (value) {
      if (isOn === false) {
        backupStyling = addStyling(element, styling);
        isOn = true;
      }
    } else {
      if (isOn === true) {
        removeStyling(element, backupStyling);
        isOn = false;
      }
    }
  };
}

function extendClasses(out, param, actionStr, actionArr, isRemoveEmptyClasses) {
  if (isString(param)) {
    if (param === "") {
      if (isRemoveEmptyClasses) {
        out.classes = [];
      }
    } else {
      var c = param.split(' ');
      out.classes = actionStr(c);
    }

    return true;
  } else if (param instanceof Array) {
    if (param.length == 0) {
      if (isRemoveEmptyClasses) {
        out.classes = [];
      }
    } else {
      out.classes = actionArr(param);
    }

    return true;
  }

  return false;
}

function extend(value, param, actionStr, actionArr, actionObj, isRemoveEmptyClasses) {
  var success = extendClasses(value, param, actionStr, actionArr, isRemoveEmptyClasses);

  if (success === false) {
    if (param instanceof Object) {
      var classes = param.classes,
          styles = param.styles;
      extendClasses(value, classes, actionStr, actionArr, isRemoveEmptyClasses);

      if (styles) {
        value.styles = actionObj(styles);
      } else if (!classes) {
        value.styles = actionObj(param);
      }
    }
  }
}

function Styling(param) {
  var value = {
    classes: [],
    styles: {}
  };

  if (param) {
    extend(value, param, function (a) {
      return a;
    }, function (a) {
      return a.slice();
    }, function (o) {
      return shallowClearClone(o);
    }, true);
  }

  return Object.freeze(value);
}

function createStyling(isReplace, param) {
  var value = {
    classes: [],
    styles: {}
  };

  if (param) {
    extend(value, param, function (a) {
      return a;
    }, function (a) {
      return a.slice();
    }, function (o) {
      return shallowClearClone(o);
    }, true);

    for (var _len = arguments.length, params = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      params[_key - 2] = arguments[_key];
    }

    if (params) {
      var classes = value.classes,
          styles = value.styles;
      var extendInt = isReplace ? function (p) {
        return extend(value, p, function (s) {
          return s;
        }, function (a) {
          return a.slice();
        }, function (o) {
          return shallowClearClone(styles, o);
        }, true);
      } : function (p) {
        return extend(value, p, function (a) {
          return classes.concat(a);
        }, function (a) {
          return classes.concat(a);
        }, function (o) {
          return shallowClearClone(styles, o);
        }, false);
      };
      params.forEach(function (p) {
        return extendInt(p);
      });
    }
  }

  return Styling(value);
}

function createCss(stylings1, stylings2) {
  var destination = {};

  for (var property in stylings1) {
    var param1 = stylings1[property];
    var param2 = stylings2 ? stylings2[property] : undefined;
    if (param2 === undefined) destination[property] = Styling(param1);else {
      destination[property] = createStyling(true, param1, param2);
    }
  }

  if (stylings2) for (var _property in stylings2) {
    if (!stylings1[_property]) destination[_property] = Styling(stylings2[_property]);
  }
  return destination;
}
function extendCss(stylings1, stylings2) {
  for (var property in stylings2) {
    var param2 = stylings2[property];
    var param1 = stylings1[property];
    if (param1 === undefined) stylings1[property] = Styling(param2);else {
      stylings1[property] = createStyling(false, param1, param2);
    }
  }
}

function PickDomFactory(css, componentPropertiesAspect, optionPropertiesAspect) {
  return {
    create: function create(pickElement, choice, remove) {
      var eventBinder = EventBinder();
      pickElement.innerHTML = '<span></span><button aria-label="Remove" tabIndex="-1" type="button"><span aria-hidden="true">&times;</span></button>';
      var pickContentElement = pickElement.querySelector('SPAN');
      var pickButtonElement = pickElement.querySelector('BUTTON');
      eventBinder.bind(pickButtonElement, "click", remove); // TODO: explicit conditional styling 

      return {
        pickDom: {
          pickContentElement: pickContentElement,
          pickButtonElement: pickButtonElement
        },
        pickDomManager: {
          init: function init() {
            addStyling(pickContentElement, css.pickContent);
            addStyling(pickButtonElement, css.pickButton);
            var disableToggle = toggleStyling(pickContentElement, css.pickContent_disabled);

            function updateData() {
              pickContentElement.textContent = optionPropertiesAspect.getText(choice.option);
            }

            function updateDisabled() {
              disableToggle(choice.isOptionDisabled);
            }

            function updateRemoveDisabled() {
              pickButtonElement.disabled = componentPropertiesAspect.getDisabled();
            }

            updateData();
            updateDisabled();
            updateRemoveDisabled();
            return {
              updateData: updateData,
              updateDisabled: updateDisabled,
              updateRemoveDisabled: updateRemoveDisabled
            };
          },
          dispose: function dispose() {
            eventBinder.unbind();
          }
        }
      };
    }
  };
}

function ChoiceDomFactory(css, optionPropertiesAspect) {
  return {
    create: function create(choiceElement, choice, toggle) {
      choiceElement.innerHTML = '<div><input formnovalidate type="checkbox"><label></label></div>';
      var choiceContentElement = choiceElement.querySelector('DIV');
      var choiceCheckBoxElement = choiceContentElement.querySelector('INPUT');
      var choiceLabelElement = choiceContentElement.querySelector('LABEL');
      var eventBinder = EventBinder();
      eventBinder.bind(choiceElement, "click", toggle); // TODO: explicit conditional styling 

      return {
        choiceDom: {
          choiceContentElement: choiceContentElement,
          choiceCheckBoxElement: choiceCheckBoxElement,
          choiceLabelElement: choiceLabelElement
        },
        choiceDomManager: {
          init: function init() {
            addStyling(choiceContentElement, css.choiceContent);
            addStyling(choiceCheckBoxElement, css.choiceCheckBox);
            addStyling(choiceLabelElement, css.choiceLabel);
            var choiceSelectedToggle = toggleStyling(choiceElement, css.choice_selected);
            var choiceDisabledToggle = toggleStyling(choiceElement, css.choice_disabled);
            var choiceHoverToggle = toggleStyling(choiceElement, css.choice_hover);
            var choiceCheckBoxDisabledToggle = toggleStyling(choiceCheckBoxElement, css.choiceCheckBox_disabled);
            var choiceLabelDisabledToggle = toggleStyling(choiceLabelElement, css.choiceLabel_disabled);

            function updateData() {
              choiceLabelElement.textContent = optionPropertiesAspect.getText(choice.option);
            }

            function updateSelected() {
              choiceSelectedToggle(choice.isOptionSelected);
              choiceCheckBoxElement.checked = choice.isOptionSelected;
            }

            function updateDisabled() {
              choiceDisabledToggle(choice.isOptionDisabled);
              choiceCheckBoxDisabledToggle(choice.isOptionDisabled);
              choiceLabelDisabledToggle(choice.isOptionDisabled); // do not desable checkBox if option is selected! there should be possibility to unselect "disabled"

              choiceCheckBoxElement.disabled = choice.isOptionDisabled && !choice.isOptionSelected;
            }

            updateData();
            updateSelected();
            updateDisabled();
            return {
              updateData: updateData,
              updateSelected: updateSelected,
              updateDisabled: updateDisabled,
              updateHoverIn: function updateHoverIn() {
                choiceHoverToggle(choice.isHoverIn);
              }
            };
          },
          dispose: function dispose() {
            eventBinder.unbind();
          }
        }
      };
    }
  };
}

function CreateElementAspect(createElement) {
  return {
    createElement: createElement
  };
}
function StaticDomFactory(choicesDomFactory, createElementAspect) {
  return {
    create: function create(css) {
      var choicesDom = choicesDomFactory.create(css);
      return {
        choicesDom: choicesDom,
        createStaticDom: function createStaticDom(element, containerClass) {
          function showError(message) {
            element.style.backgroundColor = 'red';
            element.style.color = 'white';
            throw new Error(message);
          }

          var containerElement, picksElement;
          var removableContainerClass = false;

          if (element.tagName == 'DIV') {
            containerElement = element;

            if (!containerElement.classList.contains(containerClass)) {
              containerElement.classList.add(containerClass);
              removableContainerClass = true;
            }

            picksElement = findDirectChildByTagName(containerElement, 'UL');
          } else if (element.tagName == 'UL') {
            picksElement = element;
            containerElement = closestByClassName(element, containerClass);

            if (!containerElement) {
              showError('BsMultiSelect: defined on UL but precedentant DIV for container not found; class=' + containerClass);
            }
          } else if (element.tagName == "INPUT") {
            showError('BsMultiSelect: INPUT element is not supported');
          }

          var disposablePicksElement = false;

          if (!picksElement) {
            picksElement = createElementAspect.createElement('UL');
            disposablePicksElement = true;
          }

          return {
            choicesDom: choicesDom,
            staticDom: {
              initialElement: element,
              containerElement: containerElement,
              picksElement: picksElement,
              disposablePicksElement: disposablePicksElement
            },
            staticManager: {
              appendToContainer: function appendToContainer() {
                containerElement.appendChild(choicesDom.choicesElement);
                if (disposablePicksElement) containerElement.appendChild(picksElement);
              },
              dispose: function dispose() {
                containerElement.removeChild(choicesDom.choicesElement);
                if (removableContainerClass) containerElement.classList.remove(containerClass);
                if (disposablePicksElement) containerElement.removeChild(picksElement);
              }
            }
          };
        }
      };
    }
  };
}

function PicksDom(picksElement, disposablePicksElement, createElementAspect, css) {
  var pickFilterElement = createElementAspect.createElement('LI');
  addStyling(picksElement, css.picks);
  addStyling(pickFilterElement, css.pickFilter);
  var disableToggleStyling = toggleStyling(picksElement, css.picks_disabled);
  var focusToggleStyling = toggleStyling(picksElement, css.picks_focus);
  var isFocusIn = false;
  return {
    picksElement: picksElement,
    pickFilterElement: pickFilterElement,
    createPickElement: function createPickElement() {
      var pickElement = createElementAspect.createElement('LI');
      addStyling(pickElement, css.pick);
      return {
        pickElement: pickElement,
        attach: function attach() {
          return picksElement.insertBefore(pickElement, pickFilterElement);
        },
        detach: function detach() {
          return picksElement.removeChild(pickElement);
        }
      };
    },
    disable: function disable(isComponentDisabled) {
      disableToggleStyling(isComponentDisabled);
    },
    toggleFocusStyling: function toggleFocusStyling() {
      focusToggleStyling(isFocusIn);
    },
    getIsFocusIn: function getIsFocusIn() {
      return isFocusIn;
    },
    setIsFocusIn: function setIsFocusIn(newIsFocusIn) {
      isFocusIn = newIsFocusIn;
    },
    dispose: function dispose() {
      if (!disposablePicksElement) {
        disableToggleStyling(false);
        focusToggleStyling(false);
        if (pickFilterElement.parentNode) pickFilterElement.parentNode.removeChild(pickFilterElement);
      }
    }
  };
}

function FilterDom(disposablePicksElement, createElementAspect, css) {
  var filterInputElement = createElementAspect.createElement('INPUT');
  addStyling(filterInputElement, css.filterInput);
  filterInputElement.setAttribute("type", "search");
  filterInputElement.setAttribute("autocomplete", "off");
  var eventBinder = EventBinder();
  return {
    filterInputElement: filterInputElement,
    isEmpty: function isEmpty() {
      return filterInputElement.value ? false : true;
    },
    setEmpty: function setEmpty() {
      filterInputElement.value = '';
    },
    getValue: function getValue() {
      return filterInputElement.value;
    },
    setFocus: function setFocus() {
      filterInputElement.focus();
    },
    setWidth: function setWidth(text) {
      filterInputElement.style.width = text.length * 1.3 + 2 + "ch";
    },
    // TODO: check why I need this comparision? 
    setFocusIfNotTarget: function setFocusIfNotTarget(target) {
      if (target != filterInputElement) filterInputElement.focus();
    },
    onInput: function onInput(onFilterInputInput) {
      eventBinder.bind(filterInputElement, 'input', onFilterInputInput);
    },
    onFocusIn: function onFocusIn(_onFocusIn) {
      eventBinder.bind(filterInputElement, 'focusin', _onFocusIn);
    },
    onFocusOut: function onFocusOut(_onFocusOut) {
      eventBinder.bind(filterInputElement, 'focusout', _onFocusOut);
    },
    onKeyDown: function onKeyDown(onfilterInputKeyDown) {
      eventBinder.bind(filterInputElement, 'keydown', onfilterInputKeyDown);
    },
    onKeyUp: function onKeyUp(onFilterInputKeyUp) {
      eventBinder.bind(filterInputElement, 'keyup', onFilterInputKeyUp);
    },
    dispose: function dispose() {
      eventBinder.unbind();

      if (!disposablePicksElement) {
        if (filterInputElement.parentNode) filterInputElement.parentNode.removeChild(filterInputElement);
      }
    }
  };
}

function ChoicesDomFactory(createElementAspect) {
  return {
    create: function create(css) {
      var choicesElement = createElementAspect.createElement('UL');
      addStyling(choicesElement, css.choices);
      choicesElement.style.display = 'none';
      return {
        choicesElement: choicesElement,
        createChoiceElement: function createChoiceElement() {
          var choiceElement = createElementAspect.createElement('LI');
          addStyling(choiceElement, css.choice);
          return {
            choiceElement: choiceElement,
            setVisible: function setVisible(isVisible) {
              return choiceElement.style.display = isVisible ? 'block' : 'none';
            },
            attach: function attach(element) {
              return choicesElement.insertBefore(choiceElement, element);
            },
            detach: function detach() {
              return choicesElement.removeChild(choiceElement);
            }
          };
        }
      };
    }
  };
}

function PopupAspect(choicesElement, filterInputElement, Popper) {
  var popper = null;
  var popperConfiguration = {
    placement: 'bottom-start',
    modifiers: {
      preventOverflow: {
        enabled: true
      },
      hide: {
        enabled: false
      },
      flip: {
        enabled: false
      }
    }
  };
  return {
    init: function init() {
      //if (!!Popper.prototype && !!Popper.prototype.constructor.name) {
      popper = new Popper(filterInputElement, choicesElement, popperConfiguration);
      /*}else{
          popper=Popper.createPopper(
              filterInputElement,
              choicesElement,
              //  https://github.com/popperjs/popper.js/blob/next/docs/src/pages/docs/modifiers/prevent-overflow.mdx#mainaxis
              // {
              //     placement: isRtl?'bottom-end':'bottom-start',
              //     modifiers: { preventOverflow: {enabled:false}, hide: {enabled:false}, flip: {enabled:false} }
              // }
          );
      }*/
    },
    isChoicesVisible: function isChoicesVisible() {
      return choicesElement.style.display != 'none';
    },
    setChoicesVisible: function setChoicesVisible(visible) {
      choicesElement.style.display = visible ? 'block' : 'none';
    },
    popperConfiguration: popperConfiguration,
    updatePopupLocation: function updatePopupLocation() {
      popper.update();
    },
    dispose: function dispose() {
      popper.destroy();
    }
  };
}

function TriggerAspect(element, _trigger) {
  return {
    trigger: function trigger(eventName) {
      return _trigger(element, eventName);
    }
  };
}
function OnChangeAspect(triggerAspect, name) {
  return {
    onChange: function onChange() {
      triggerAspect.trigger(name);
    }
  };
}
function ComponentPropertiesAspect(getDisabled) {
  return {
    getDisabled: getDisabled
  };
}

function OptionsAspect(options) {
  return {
    getOptions: function getOptions() {
      return options;
    }
  };
}
function OptionPropertiesAspect(getText, getSelected, setSelected, getDisabled) {
  if (!getText) {
    getText = function getText(option) {
      return option.text;
    };
  }

  if (!getSelected) {
    getSelected = function getSelected(option) {
      return option.selected;
    };
  }

  if (!setSelected) {
    setSelected = function setSelected(option, value) {
      option.selected = value;
    }; // NOTE: adding this (setAttribute) break Chrome's html form reset functionality:
    // if (value) option.setAttribute('selected','');
    // else option.removeAttribute('selected');

  }

  if (!getDisabled) getDisabled = function getDisabled(option) {
    return option.disabled === undefined ? false : option.disabled;
  };
  return {
    getText: getText,
    getSelected: getSelected,
    setSelected: setSelected,
    getDisabled: getDisabled
  };
}

function ChoicesEnumerableAspect(countableChoicesList, getNext) {
  return {
    forEach: function forEach(f) {
      var choice = countableChoicesList.getHead();

      while (choice) {
        f(choice);
        choice = getNext(choice);
      }
    }
  };
}

function NavigateManager(list, getPrev, getNext) {
  return {
    navigate: function navigate(down, choice
    /* hoveredChoice */
    ) {
      if (down) {
        return choice ? getNext(choice) : list.getHead();
      } else {
        return choice ? getPrev(choice) : list.getTail();
      }
    },
    getCount: function getCount() {
      return list.getCount();
    },
    getHead: function getHead() {
      return list.getHead();
    }
  };
}
function FilterManagerAspect(emptyNavigateManager, filteredNavigateManager, filteredChoicesList, choicesEnumerableAspect) {
  var showEmptyFilter = true;

  var composeFilterPredicate = function composeFilterPredicate(text) {
    return function (choice) {
      return !choice.isOptionSelected && !choice.isOptionDisabled && choice.searchText.indexOf(text) >= 0;
    };
  };

  return {
    getNavigateManager: function getNavigateManager() {
      return showEmptyFilter ? emptyNavigateManager : filteredNavigateManager;
    },
    processEmptyInput: function processEmptyInput() {
      // redefined in PlaceholderPulgin
      showEmptyFilter = true;
      choicesEnumerableAspect.forEach(function (choice) {
        choice.setVisible(true);
      });
    },
    setFilter: function setFilter(text) {
      showEmptyFilter = false;
      var getFilterIn = composeFilterPredicate(text);
      filteredChoicesList.reset();
      choicesEnumerableAspect.forEach(function (choice) {
        choice.filteredPrev = choice.filteredNext = null;
        var v = getFilterIn(choice);
        if (v) filteredChoicesList.add(choice);
        choice.setVisible(v);
      });
    }
  };
}

function BuildAndAttachChoiceAspect(buildChoiceAspect) {
  return {
    buildAndAttachChoice: function buildAndAttachChoice(choice, getNextElement) {
      buildChoiceAspect.buildChoice(choice);
      choice.choiceElementAttach(getNextElement == null ? void 0 : getNextElement());
    }
  };
}
function BuildChoiceAspect(choicesDom, filterDom, choiceDomFactory, onChangeAspect, optionToggleAspect, createPickAspect, adoptChoiceElement, handleOnRemoveButton) {
  return {
    buildChoice: function buildChoice(choice) {
      var _choicesDom$createCho = choicesDom.createChoiceElement(),
          choiceElement = _choicesDom$createCho.choiceElement,
          setVisible = _choicesDom$createCho.setVisible,
          attach = _choicesDom$createCho.attach,
          detach = _choicesDom$createCho.detach;

      choice.choiceElement = choiceElement;
      choice.choiceElementAttach = attach;
      choice.isChoiceElementAttached = true;

      var _choiceDomFactory$cre = choiceDomFactory.create(choiceElement, choice, function () {
        optionToggleAspect.toggle(choice);
        filterDom.setFocus();
      }),
          choiceDomManager = _choiceDomFactory$cre.choiceDomManager;

      var choiceHanlders = choiceDomManager.init();
      var pickTools = {
        updateSelectedTrue: null,
        updateSelectedFalse: null
      };

      var updateSelectedTrue = function updateSelectedTrue() {
        var removePick = createPickAspect.buildPick(choice, handleOnRemoveButton);
        pickTools.updateSelectedFalse = removePick;
      };

      pickTools.updateSelectedTrue = updateSelectedTrue;

      choice.remove = function () {
        detach();

        if (pickTools.updateSelectedFalse) {
          pickTools.updateSelectedFalse();
          pickTools.updateSelectedFalse = null;
        }
      };

      choice.updateSelected = function () {
        choiceHanlders.updateSelected();
        if (choice.isOptionSelected) pickTools.updateSelectedTrue();else {
          pickTools.updateSelectedFalse();
          pickTools.updateSelectedFalse = null;
        }
        onChangeAspect.onChange();
      };

      var unbindChoiceElement = adoptChoiceElement(choice, choiceElement);
      choice.isFilteredIn = true;

      choice.setHoverIn = function (v) {
        choice.isHoverIn = v;
        choiceHanlders.updateHoverIn();
      };

      choice.setVisible = function (v) {
        choice.isFilteredIn = v;
        setVisible(choice.isFilteredIn);
      };

      choice.updateDisabled = choiceHanlders.updateDisabled;

      choice.dispose = function () {
        unbindChoiceElement();
        choiceDomManager.dispose();
        choice.choiceElement = null;
        choice.choiceElementAttach = null;
        choice.isChoiceElementAttached = false;
        choice.remove = null;
        choice.updateSelected = null;
        choice.updateDisabled = null; // not real data manipulation but internal state

        choice.setVisible = null; // TODO: refactor it there should be 3 types of not visibility: for hidden, for filtered out, for optgroup, for message item

        choice.setHoverIn = null;
        choice.dispose = null;
      };

      if (choice.isOptionSelected) {
        updateSelectedTrue();
      }
    }
  };
}

function FillChoicesAspect(document, createChoiceAspect, optionsAspect, choices, buildAndAttachChoice) {
  return {
    fillChoices: function fillChoices() {
      var fillChoicesImpl = function fillChoicesImpl() {
        var options = optionsAspect.getOptions();

        for (var i = 0; i < options.length; i++) {
          var option = options[i];
          var choice = createChoiceAspect.createChoice(option);
          choices.push(choice);
          buildAndAttachChoice(choice);
        }
      }; // browsers can change select value as part of "autocomplete" (IE11) 
      // or "show preserved on go back" (Chrome) after page is loaded but before "ready" event;
      // but they never "restore" selected-disabled options.
      // TODO: make the FROM Validation for 'selected-disabled' easy.


      if (document.readyState != 'loading') {
        fillChoicesImpl();
      } else {
        var domContentLoadedHandler = function domContentLoadedHandler() {
          fillChoicesImpl();
          document.removeEventListener("DOMContentLoaded", domContentLoadedHandler);
        };

        document.addEventListener('DOMContentLoaded', domContentLoadedHandler); // IE9+
      }
    }
  };
}

function UpdateDataAspect(choicesDom, choices, picks, fillChoicesAspect, before) {
  return {
    updateData: function updateData() {
      // close drop down , remove filter
      before();
      choicesDom.choicesElement.innerHTML = ""; // TODO: there should better "optimization"

      choices.clear();
      picks.clear();
      fillChoicesAspect.fillChoices();
    }
  };
}

function OptionToggleAspect(setOptionSelectedAspect) {
  return {
    toggle: function toggle(choice) {
      return _toggle(setOptionSelectedAspect, choice);
    }
  };
}

function _toggle(setOptionSelectedAspect, choice) {
  var success = false;
  if (choice.isOptionSelected || !choice.isOptionDisabled) success = setOptionSelectedAspect.setOptionSelected(choice, !choice.isOptionSelected);
  return success;
}

function IsChoiceSelectableAspect() {
  return {
    isSelectable: function isSelectable(choice) {
      return _isSelectable(choice);
    } // TODO: should be moved to new aspect

  };
}
function SetOptionSelectedAspect(optionPropertiesAspect) {
  return {
    setOptionSelected: function setOptionSelected(choice, booleanValue) {
      return _setOptionSelected(optionPropertiesAspect, choice, booleanValue);
    }
  };
}
function CreateChoiceAspect(optionPropertiesAspect) {
  return {
    createChoice: function createChoice(option) {
      return _createChoice(optionPropertiesAspect, option);
    }
  };
}

function _setOptionSelected(optionPropertiesAspect, choice, booleanValue) {
  var success = false;
  var confirmed = optionPropertiesAspect.setSelected(choice.option, booleanValue);

  if (!(confirmed === false)) {
    choice.isOptionSelected = booleanValue;
    choice.updateSelected();
    success = true;
  }

  return success;
}

function _isSelectable(choice) {
  return !choice.isOptionSelected && !choice.isOptionDisabled;
}

function _createChoice(optionPropertiesAspect, option) {
  var isOptionSelected = optionPropertiesAspect.getSelected(option);
  var isOptionDisabled = optionPropertiesAspect.getDisabled(option);
  return {
    option: option,
    isOptionSelected: isOptionSelected,
    isOptionDisabled: isOptionDisabled,
    updateDisabled: null,
    updateSelected: null,
    // navigation and filter support
    filteredPrev: null,
    filteredNext: null,
    searchText: optionPropertiesAspect.getText(option).toLowerCase().trim(),
    // TODO make an index abstraction
    // internal state handlers, so they do not have "update semantics"
    isHoverIn: false,
    isFilterIn: false,
    setVisible: null,
    setHoverIn: null,
    // TODO: is it a really sense to have them there?
    isChoiceElementAttached: false,
    choiceElement: null,
    choiceElementAttach: null,
    itemPrev: null,
    itemNext: null,
    remove: null,
    dispose: null,
    isOptionHidden: null
  };
}

function Choices(choicesCollection, listFacade_reset, listFacade_remove, listFacade_add) {
  return {
    push: function push(choice) {
      return _push(choice, choicesCollection, listFacade_add);
    },
    insert: function insert(key, choice) {
      return _insert(key, choice, choicesCollection, listFacade_add);
    },
    get: function get(key) {
      return choicesCollection.get(key);
    },
    getNext: function getNext(key, predicate) {
      return choicesCollection.getNext(key, predicate);
    },
    remove: function remove(key) {
      var choice = choicesCollection.remove(key);
      listFacade_remove(choice);
      return choice;
    },
    //  ---- dialog AI
    //getHead: ()  => choicesCollection.getHead(),
    forLoop: function forLoop(f) {
      return choicesCollection.forLoop(f);
    },
    clear: function clear() {
      choicesCollection.reset();
      listFacade_reset();
    },
    dispose: function dispose() {
      return choicesCollection.forLoop(function (choice) {
        return choice.dispose == null ? void 0 : choice.dispose();
      });
    }
  };
}

function _push(choice, choicesCollection, listFacade_add) {
  choicesCollection.push(choice);
  listFacade_add(choice);
}

function _insert(key, choice, choicesCollection, listFacade_add) {
  if (key >= choicesCollection.getCount()) {
    _push(choice, choicesCollection, listFacade_add);
  } else {
    choicesCollection.add(choice, key);
    listFacade_add(choice, key);
  }
}

function HoveredChoiceAspect() {
  var hoveredChoice = null;
  return {
    getHoveredChoice: function getHoveredChoice() {
      return hoveredChoice;
    },
    setHoveredChoice: function setHoveredChoice(choice) {
      hoveredChoice = choice;
    },
    resetHoveredChoice: function resetHoveredChoice() {
      if (hoveredChoice) {
        hoveredChoice.setHoverIn(false);
        hoveredChoice = null;
      }
    }
  };
}
function NavigateAspect(hoveredChoiceAspect, _navigate) {
  return {
    hoverIn: function hoverIn(choice) {
      hoveredChoiceAspect.resetHoveredChoice();
      hoveredChoiceAspect.setHoveredChoice(choice);
      choice.setHoverIn(true);
    },
    navigate: function navigate(down) {
      return _navigate(down, hoveredChoiceAspect.getHoveredChoice());
    }
  };
}

function Picks() {
  var list = List();
  return {
    addPick: function addPick(pick) {
      var removeFromList = list.add(pick);
      return removeFromList;
    },
    removePicksTail: function removePicksTail() {
      var pick = list.getTail();
      if (pick) pick.remove(); // always remove in this case

      return pick;
    },
    isEmpty: list.isEmpty,
    // function
    getCount: list.getCount,
    disableRemoveAll: function disableRemoveAll() {
      list.forEach(function (i) {
        return i.updateRemoveDisabled();
      });
    },
    removeAll: function removeAll() {
      list.forEach(function (i) {
        return i.remove();
      });
    },
    clear: function clear() {
      list.forEach(function (i) {
        return i.dispose();
      });
      list.reset();
    },
    dispose: function dispose() {
      list.forEach(function (i) {
        return i.dispose();
      });
    }
  };
}

function BuildPickAspect(setOptionSelectedAspect, picks, picksDom, pickDomFactory) {
  return {
    buildPick: function buildPick(choice, handleOnRemoveButton) {
      var _picksDom$createPickE = picksDom.createPickElement(),
          pickElement = _picksDom$createPickE.pickElement,
          attach = _picksDom$createPickE.attach,
          detach = _picksDom$createPickE.detach;

      var setSelectedFalse = function setSelectedFalse() {
        return setOptionSelectedAspect.setOptionSelected(choice, false);
      };

      var remove = handleOnRemoveButton(setSelectedFalse);

      var _pickDomFactory$creat = pickDomFactory.create(pickElement, choice, remove),
          pickDomManager = _pickDomFactory$creat.pickDomManager;

      var pickHandlers = pickDomManager.init();
      var pick = {
        updateRemoveDisabled: function updateRemoveDisabled() {
          return pickHandlers.updateRemoveDisabled();
        },
        updateData: function updateData() {
          return pickHandlers.updateData();
        },
        updateDisabled: function updateDisabled() {
          return pickHandlers.updateDisabled();
        },
        remove: setSelectedFalse,
        dispose: function dispose() {
          detach();
          pickDomManager.dispose();
          pick.updateRemoveDisabled = null;
          pick.updateData = null;
          pick.updateDisabled = null;
          pick.remove = null;
          pick.dispose = null;
        }
      };
      attach();
      var choiceUpdateDisabledBackup = choice.updateDisabled;
      choice.updateDisabled = composeSync(choiceUpdateDisabledBackup, pick.updateDisabled); // add pickDisabled

      var removeFromList = picks.addPick(pick);

      var removePick = function removePick() {
        removeFromList();
        pick.dispose();
        choice.updateDisabled = choiceUpdateDisabledBackup; // remove pickDisabled

        choice.updateDisabled(); // make "true disabled" without it checkbox looks disabled
      };

      return removePick;
    }
  };
}

function InputAspect(filterDom, filterManagerAspect, setSelectedIfExactMatch) {
  return {
    processInput: function processInput() {
      var filterInputValue = filterDom.getValue();
      var text = filterInputValue.trim().toLowerCase();
      var isEmpty = false;
      if (text == '') isEmpty = true;else {
        filterManagerAspect.setFilter(text); // check if exact match inside

        isEmpty = setSelectedIfExactMatch(text);
      }

      if (isEmpty) {
        filterManagerAspect.processEmptyInput();
      } else filterDom.setWidth(filterInputValue);
    }
  };
}

function ResetFilterListAspect(filterDom, filterManagerAspect) {
  return {
    forceResetFilter: function forceResetFilter() {
      // over in PlaceholderPlugin
      filterDom.setEmpty();
      filterManagerAspect.processEmptyInput(); // over in PlaceholderPlugin
    }
  };
}
function ManageableResetFilterListAspect(filterDom, resetFilterListAspect) {
  return {
    resetFilter: function resetFilter() {
      // call in OptionsApiPlugin
      if (!filterDom.isEmpty()) // call in Placeholder
        resetFilterListAspect.forceResetFilter(); // over in Placeholder
    }
  };
}
function FocusInAspect(picksDom) {
  return {
    setFocusIn: function setFocusIn(focus) {
      // call in OptionsApiPlugin
      picksDom.setIsFocusIn(focus); // unique call, call BsAppearancePlugin

      picksDom.toggleFocusStyling(); // over BsAppearancePlugin
    }
  };
}

function MultiSelectInlineLayoutAspect(window, setFocus, picksElement, choicesElement, isChoicesVisible, setChoicesVisible, resetHoveredChoice, hoverIn, navigate, resetFilter, getNavigateManager, // , 
onClick, resetFocusIn, setFocusIn, alignToFilterInputItemLocation, toggleHovered, filterDom, processInput) {
  var document = window.document;
  var eventLoopFlag = EventLoopFlag(window);
  var skipFocusout = false;

  function getSkipFocusout() {
    return skipFocusout;
  }

  function resetSkipFocusout() {
    skipFocusout = false;
  }

  function setSkipFocusout() {
    skipFocusout = true;
  }

  var skipoutMousedown = function skipoutMousedown() {
    setSkipFocusout();
  };

  var documentMouseup = function documentMouseup(event) {
    // if we would left without focus then "close the drop" do not remove focus border
    if (choicesElement == event.target) setFocus(); // if click outside container - close dropdown
    else if (!containsAndSelf(choicesElement, event.target) && !containsAndSelf(picksElement, event.target)) {
        hideChoices();
        resetFilter();
        resetFocusIn();
      }
  };

  var preventDefaultClickEvent = null;
  var componentDisabledEventBinder = EventBinder(); // TODO: remove setTimeout: set on start of mouse event reset on end

  function skipoutAndResetMousedown() {
    skipoutMousedown();
    window.setTimeout(function () {
      return resetSkipFocusout();
    });
  }

  picksElement.addEventListener("mousedown", skipoutAndResetMousedown);

  function showChoices() {
    if (!isChoicesVisible()) {
      alignToFilterInputItemLocation();
      eventLoopFlag.set();
      setChoicesVisible(true); // add listeners that manages close dropdown on  click outside container

      choicesElement.addEventListener("mousedown", skipoutMousedown);
      document.addEventListener("mouseup", documentMouseup);
    }
  }

  function clickToShowChoices(event) {
    onClick(event);

    if (preventDefaultClickEvent != event) {
      if (isChoicesVisible()) {
        hideChoices();
      } else {
        if (getNavigateManager().getCount() > 0) showChoices();
      }
    }

    preventDefaultClickEvent = null;
  }

  function hideChoices() {
    resetMouseCandidateChoice();
    resetHoveredChoice();

    if (isChoicesVisible()) {
      setChoicesVisible(false);
      choicesElement.removeEventListener("mousedown", skipoutMousedown);
      document.removeEventListener("mouseup", documentMouseup);
    }
  }

  function processUncheck(uncheckOption, event) {
    // we can't remove item on "click" in the same loop iteration - it is unfrendly for 3PP event handlers (they will get detached element)
    // never remove elements in the same event iteration
    window.setTimeout(function () {
      return uncheckOption();
    });
    preventDefaultClickEvent = event; // setPreventDefaultMultiSelectEvent
  } // function handleOnRemoveButton(onRemove, setSelectedFalse){
  //     // processRemoveButtonClick removes the item
  //     // what is a problem with calling 'remove' directly (not using  setTimeout('remove', 0)):
  //     // consider situation "MultiSelect" on DROPDOWN (that should be closed on the click outside dropdown)
  //     // therefore we aslo have document's click's handler where we decide to close or leave the DROPDOWN open.
  //     // because of the event's bubling process 'remove' runs first. 
  //     // that means the event's target element on which we click (the x button) will be removed from the DOM together with badge 
  //     // before we could analize is it belong to our dropdown or not.
  //     // important 1: we can't just the stop propogation using stopPropogate because click outside dropdown on the similar 
  //     // component that use stopPropogation will not close dropdown (error, dropdown should be closed)
  //     // important 2: we can't change the dropdown's event handler to leave dropdown open if event's target is null because of
  //     // the situation described above: click outside dropdown on the same component.
  //     // Alternatively it could be possible to use stopPropogate but together create custom click event setting new target 
  //     // that belomgs to DOM (e.g. panel)
  //     onRemove(event => {
  //         processUncheck(setSelectedFalse, event);
  //         hideChoices();
  //         resetFilter(); 
  //     });
  // }


  function handleOnRemoveButton(setSelectedFalse) {
    return function (event) {
      processUncheck(setSelectedFalse, event);
      hideChoices();
      resetFilter();
    };
  }

  var mouseCandidateEventBinder = EventBinder();

  var resetMouseCandidateChoice = function resetMouseCandidateChoice() {
    mouseCandidateEventBinder.unbind();
  };

  var mouseOverToHoveredAndReset = function mouseOverToHoveredAndReset(choice) {
    if (!choice.isHoverIn) hoverIn(choice);
    resetMouseCandidateChoice();
  };

  function adoptChoiceElement(choice, choiceElement) {
    // in chrome it happens on "become visible" so we need to skip it, 
    // for IE11 and edge it doesn't happens, but for IE11 and Edge it doesn't happens on small 
    // mouse moves inside the item. 
    // https://stackoverflow.com/questions/59022563/browser-events-mouseover-doesnt-happen-when-you-make-element-visible-and-mous
    var onChoiceElementMouseover = function onChoiceElementMouseover() {
      if (eventLoopFlag.get()) {
        resetMouseCandidateChoice();
        mouseCandidateEventBinder.bind(choiceElement, 'mousemove', function () {
          return mouseOverToHoveredAndReset(choice);
        });
        mouseCandidateEventBinder.bind(choiceElement, 'mousedown', function () {
          return mouseOverToHoveredAndReset(choice);
        });
      } else {
        if (!choice.isHoverIn) {
          // NOTE: mouseleave is not enough to guarantee remove hover styles in situations
          // when style was setuped without mouse (keyboard arrows)
          // therefore force reset manually (done inside hoverIn)
          hoverIn(choice);
        }
      }
    }; // note 1: mouseleave preferred to mouseout - which fires on each descendant
    // note 2: since I want add aditional info panels to the dropdown put mouseleave on dropdwon would not work


    var onChoiceElementMouseleave = function onChoiceElementMouseleave() {
      if (!eventLoopFlag.get()) {
        resetHoveredChoice();
      }
    };

    var overAndLeaveEventBinder = EventBinder();
    overAndLeaveEventBinder.bind(choiceElement, 'mouseover', onChoiceElementMouseover);
    overAndLeaveEventBinder.bind(choiceElement, 'mouseleave', onChoiceElementMouseleave);
    return overAndLeaveEventBinder.unbind;
  } // -------------------


  function afterInput() {
    eventLoopFlag.set(); // means disable some mouse handlers; otherwise we will get "Hover On MouseEnter" when filter's changes should remove hover

    var visibleCount = getNavigateManager().getCount();

    if (visibleCount > 0) {
      var panelIsVisble = isChoicesVisible();

      if (!panelIsVisble) {
        showChoices();
      }

      if (visibleCount == 1) {
        hoverIn(getNavigateManager().getHead());
      } else {
        if (panelIsVisble) resetHoveredChoice();
      }
    } else {
      if (isChoicesVisible()) hideChoices();
    }
  }

  filterDom.onFocusIn(setFocusIn);
  filterDom.onFocusOut(function () {
    if (!getSkipFocusout()) {
      // skip initiated by mouse click (we manage it different way)
      hideChoices();
      resetFilter(); // if do not do this we will return to filtered list without text filter in input

      resetFocusIn();
    }

    resetSkipFocusout();
  }); // it can be initated by 3PP functionality
  // sample (1) BS functionality - input x button click - clears input
  // sample (2) BS functionality - esc keydown - clears input
  // and there could be difference in processing: (2) should hide the menu, then reset , when (1) should just reset without hiding.

  filterDom.onInput(function () {
    processInput();
    afterInput();
  }); // -------------------

  return {
    adoptChoiceElement: adoptChoiceElement,
    dispose: function dispose() {
      resetMouseCandidateChoice();
      picksElement.removeEventListener("mousedown", skipoutAndResetMousedown);
      componentDisabledEventBinder.unbind();
    },
    disableComponent: function disableComponent(isComponentDisabled) {
      if (isComponentDisabled) componentDisabledEventBinder.unbind();else componentDisabledEventBinder.bind(picksElement, "click", clickToShowChoices);
    },
    hideChoices: hideChoices,
    showChoices: showChoices,
    handleOnRemoveButton: handleOnRemoveButton,
    hoveredToSelected: function hoveredToSelected() {
      var wasToggled = toggleHovered();

      if (wasToggled) {
        hideChoices(); // !

        resetFilter(); // !
      }
    },
    keyDownArrow: function keyDownArrow(down) {
      var choice = navigate(down);

      if (choice) {
        hoverIn(choice); // !

        showChoices(); // !
      }
    }
  };
}

function FilterAspect(filterDom, onKeyDownArrowUp, onKeyDownArrowDown, onTabForEmpty, // tab on empty
onBackspace, // backspace alike
onTabToCompleate, // "compleate alike"
onEnterToCompleate, onKeyUpEsc, // "esc" alike
stopEscKeyDownPropogation) {
  var onfilterInputKeyDown = function onfilterInputKeyDown(event) {
    var keyCode = event.which;
    var empty = filterDom.isEmpty();

    if ([13, 27 // '27-esc' there is "just in case", I can imagine that there are user agents that do UNDO
    ].indexOf(keyCode) >= 0 || keyCode == 9 && !empty //  otherwice there are no keyup (true at least for '9-tab'),
    ) {
        event.preventDefault(); // '13-enter'  - prevention against form's default button 
        // but doesn't help with bootsrap modal ESC or ENTER (close behaviour);
      }

    if ([38, 40].indexOf(keyCode) >= 0) event.preventDefault();

    if (keyCode == 8
    /*backspace*/
    ) {
        // NOTE: this will process backspace only if there are no text in the input field
        // If user will find this inconvinient, we will need to calculate something like this
        // let isBackspaceAtStartPoint = (this.filterInput.selectionStart == 0 && this.filterInput.selectionEnd == 0);
        if (empty) {
          onBackspace();
        }
      } // ---------------------------------------------------------------------------------
      // NOTE: no preventDefault called in case of empty for 9-tab
    else if (keyCode == 9
      /*tab*/
      ) {
          // NOTE: no keydown for this (without preventDefaul after TAB keyup event will be targeted another element)  
          if (empty) {
            onTabForEmpty(); // hideChoices inside (and no filter reset since it is empty) 
          }
        } else if (keyCode == 27
      /*esc*/
      ) {
          // NOTE: forbid the ESC to close the modal (in case the nonempty or dropdown is open)
          if (!empty || stopEscKeyDownPropogation()) event.stopPropagation();
        } else if (keyCode == 38) {
        onKeyDownArrowUp();
      } else if (keyCode == 40) {
        onKeyDownArrowDown();
      }
  };

  var onFilterInputKeyUp = function onFilterInputKeyUp(event) {
    var keyCode = event.which; //var handler = keyUp[event.which/* key code */];
    //handler();

    if (keyCode == 9) {
      onTabToCompleate();
    } else if (keyCode == 13) {
      onEnterToCompleate();
    } else if (keyCode == 27) {
      // escape
      onKeyUpEsc(); // is it always empty (bs x can still it) 
    }
  };

  filterDom.onKeyDown(onfilterInputKeyDown);
  filterDom.onKeyUp(onFilterInputKeyUp);
}

function DisabledComponentAspect(componentPropertiesAspect, picks, picksDom, disableComponent) {
  var isComponentDisabled;
  return {
    updateDisabledComponent: function updateDisabledComponent() {
      var newIsComponentDisabled = componentPropertiesAspect.getDisabled();

      if (isComponentDisabled !== newIsComponentDisabled) {
        isComponentDisabled = newIsComponentDisabled;
        picks.disableRemoveAll(newIsComponentDisabled);
        disableComponent(newIsComponentDisabled);
        picksDom.disable(newIsComponentDisabled);
      }
    }
  };
}
function AppearanceAspect(disabledComponentAspect) {
  return {
    updateAppearance: function updateAppearance() {
      disabledComponentAspect.updateDisabledComponent();
    }
  };
}
function LoadAspect(fillChoicesAspect, appearanceAspect) {
  return {
    load: function load() {
      fillChoicesAspect.fillChoices();
      appearanceAspect.updateAppearance();
    }
  };
}

function CountableChoicesListInsertAspect(countableChoicesList) {
  return {
    countableChoicesListInsert: function countableChoicesListInsert(choice, key) {
      var choiceNext = choicesCollection.getNext(key);
      countableChoicesList.add(choice, choiceNext);
    }
  };
}

function BsMultiSelect(element, environment, configuration, onInit) {
  var Popper = environment.Popper,
      window = environment.window,
      plugins = environment.plugins;

  if (typeof Popper === 'undefined') {
    throw new Error("BsMultiSelect: Popper.js (https://popper.js.org) is required");
  }

  var containerClass = configuration.containerClass,
      css = configuration.css,
      getDisabled = configuration.getDisabled,
      options = configuration.options,
      getText = configuration.getText,
      getSelected = configuration.getSelected,
      setSelected = configuration.setSelected,
      getIsOptionDisabled = configuration.getIsOptionDisabled;
  var disposeAspect = {};
  var triggerAspect = TriggerAspect(element, environment.trigger);
  var onChangeAspect = OnChangeAspect(triggerAspect, 'dashboardcode.multiselect:change');
  var componentPropertiesAspect = ComponentPropertiesAspect(getDisabled != null ? getDisabled : function () {
    return false;
  });
  var optionsAspect = OptionsAspect(options);
  var optionPropertiesAspect = OptionPropertiesAspect(getText, getSelected, setSelected, getIsOptionDisabled);
  var isChoiceSelectableAspect = IsChoiceSelectableAspect();
  var createChoiceAspect = CreateChoiceAspect(optionPropertiesAspect);
  var setOptionSelectedAspect = SetOptionSelectedAspect(optionPropertiesAspect);
  var optionToggleAspect = OptionToggleAspect(setOptionSelectedAspect);
  var createElementAspect = CreateElementAspect(function (name) {
    return window.document.createElement(name);
  });
  var choicesDomFactory = ChoicesDomFactory(createElementAspect);
  var staticDomFactory = StaticDomFactory(choicesDomFactory, createElementAspect);
  var choicesCollection = ArrayFacade();
  var countableChoicesList = DoublyLinkedList(function (choice) {
    return choice.itemPrev;
  }, function (choice, v) {
    return choice.itemPrev = v;
  }, function (choice) {
    return choice.itemNext;
  }, function (choice, v) {
    return choice.itemNext = v;
  });
  var countableChoicesListInsertAspect = CountableChoicesListInsertAspect(countableChoicesList);
  var choicesEnumerableAspect = ChoicesEnumerableAspect(countableChoicesList, function (choice) {
    return choice.itemNext;
  });
  var filteredChoicesList = DoublyLinkedList(function (choice) {
    return choice.filteredPrev;
  }, function (choice, v) {
    return choice.filteredPrev = v;
  }, function (choice) {
    return choice.filteredNext;
  }, function (choice, v) {
    return choice.filteredNext = v;
  });
  var emptyNavigateManager = NavigateManager(countableChoicesList, function (choice) {
    return choice.itemPrev;
  }, function (choice) {
    return choice.itemNext;
  });
  var filteredNavigateManager = NavigateManager(filteredChoicesList, function (choice) {
    return choice.filteredPrev;
  }, function (choice) {
    return choice.filteredNext;
  });
  var filterManagerAspect = FilterManagerAspect(emptyNavigateManager, filteredNavigateManager, filteredChoicesList, choicesEnumerableAspect);
  var hoveredChoiceAspect = HoveredChoiceAspect();
  var navigateAspect = NavigateAspect(hoveredChoiceAspect, function (down, hoveredChoice) {
    return filterManagerAspect.getNavigateManager().navigate(down, hoveredChoice);
  });
  var picks = Picks();
  var choices = Choices(choicesCollection, function () {
    return countableChoicesList.reset();
  }, function (c) {
    return countableChoicesList.remove(c);
  }, function (c, key) {
    return countableChoicesListInsertAspect.countableChoicesListInsert(c, key);
  });
  var aspects = {
    environment: environment,
    configuration: configuration,
    triggerAspect: triggerAspect,
    onChangeAspect: onChangeAspect,
    componentPropertiesAspect: componentPropertiesAspect,
    disposeAspect: disposeAspect,
    countableChoicesList: countableChoicesList,
    countableChoicesListInsertAspect: countableChoicesListInsertAspect,
    optionsAspect: optionsAspect,
    optionPropertiesAspect: optionPropertiesAspect,
    createChoiceAspect: createChoiceAspect,
    setOptionSelectedAspect: setOptionSelectedAspect,
    isChoiceSelectableAspect: isChoiceSelectableAspect,
    optionToggleAspect: optionToggleAspect,
    createElementAspect: createElementAspect,
    choicesDomFactory: choicesDomFactory,
    staticDomFactory: staticDomFactory,
    choicesCollection: choicesCollection,
    choicesEnumerableAspect: choicesEnumerableAspect,
    filteredChoicesList: filteredChoicesList,
    filterManagerAspect: filterManagerAspect,
    hoveredChoiceAspect: hoveredChoiceAspect,
    navigateAspect: navigateAspect,
    picks: picks,
    choices: choices
  };
  plugStaticDom(plugins, aspects); // apply cssPatch to css, apply selectElement support;  

  var _staticDomFactory$cre = staticDomFactory.create(css),
      choicesDom = _staticDomFactory$cre.choicesDom,
      createStaticDom = _staticDomFactory$cre.createStaticDom;

  var _createStaticDom = createStaticDom(element, containerClass),
      staticDom = _createStaticDom.staticDom,
      staticManager = _createStaticDom.staticManager; // after this we can use staticDom in construtctor, this simplifies parameter passing a lot   


  var filterDom = FilterDom(staticDom.disposablePicksElement, createElementAspect, css);
  var popupAspect = PopupAspect(choicesDom.choicesElement, filterDom.filterInputElement, Popper);
  var resetFilterListAspect = ResetFilterListAspect(filterDom, filterManagerAspect);
  var manageableResetFilterListAspect = ManageableResetFilterListAspect(filterDom, resetFilterListAspect);
  var inputAspect = InputAspect(filterDom, filterManagerAspect,
  /* setSelectedIfExactMatch */
  function (text) {
    var wasSetEmpty = false;

    if (filterManagerAspect.getNavigateManager().getCount() == 1) {
      var fullMatchChoice = filterManagerAspect.getNavigateManager().getHead();

      if (fullMatchChoice.searchText == text) {
        setOptionSelectedAspect.setOptionSelected(fullMatchChoice, true);
        filterDom.setEmpty();
        wasSetEmpty = true;
      }
    }

    return wasSetEmpty;
  }); // TODO get picksDom  from staticDomFactory

  var picksDom = PicksDom(staticDom.picksElement, staticDom.disposablePicksElement, createElementAspect, css);
  var focusInAspect = FocusInAspect(picksDom); // -----------
  // TODO not real aspect, correct it
  // actually this should be a builder of all events (wrapper or redesign)

  var multiSelectInlineLayoutAspect = MultiSelectInlineLayoutAspect(window, function () {
    return filterDom.setFocus();
  }, picksDom.picksElement, choicesDom.choicesElement, function () {
    return popupAspect.isChoicesVisible();
  }, function (visible) {
    return popupAspect.setChoicesVisible(visible);
  }, function () {
    return hoveredChoiceAspect.resetHoveredChoice();
  }, function (choice) {
    return navigateAspect.hoverIn(choice);
  }, function (down) {
    return navigateAspect.navigate(down);
  }, function () {
    return manageableResetFilterListAspect.resetFilter();
  },
  /*getNavigateManager*/
  function () {
    return filterManagerAspect.getNavigateManager();
  },
  /*onClick*/
  function (event) {
    return filterDom.setFocusIfNotTarget(event.target);
  },
  /*resetFocus*/
  function () {
    return focusInAspect.setFocusIn(false);
  },
  /*setFocus*/
  function () {
    return focusInAspect.setFocusIn(true);
  },
  /*alignToFilterInputItemLocation*/
  function () {
    return popupAspect.updatePopupLocation();
  },
  /*toggleHovered*/
  function () {
    var wasToggled = false;
    var hoveredChoice = hoveredChoiceAspect.getHoveredChoice();

    if (hoveredChoice) {
      wasToggled = optionToggleAspect.toggle(hoveredChoice);
    }

    return wasToggled;
  }, // --------------------------------------------------------
  filterDom,
  /*onInput*/
  function () {
    return inputAspect.processInput();
  }); // TODO: bind it declarative way

  FilterAspect(filterDom, function () {
    return multiSelectInlineLayoutAspect.keyDownArrow(false);
  }, // arrow up
  function () {
    return multiSelectInlineLayoutAspect.keyDownArrow(true);
  }, // arrow down

  /*onTabForEmpty*/
  function () {
    return multiSelectInlineLayoutAspect.hideChoices();
  }, // tab on empty
  function () {
    var p = picks.removePicksTail();
    if (p) popupAspect.updatePopupLocation();
  }, // backspace - "remove last"

  /*onTabToCompleate*/
  function () {
    if (popupAspect.isChoicesVisible()) {
      multiSelectInlineLayoutAspect.hoveredToSelected();
    }
  },
  /*onEnterToCompleate*/
  function () {
    if (popupAspect.isChoicesVisible()) {
      multiSelectInlineLayoutAspect.hoveredToSelected();
    } else {
      if (filterManagerAspect.getNavigateManager().getCount() > 0) {
        multiSelectInlineLayoutAspect.showChoices();
      }
    }
  },
  /*onKeyUpEsc*/
  function () {
    multiSelectInlineLayoutAspect.hideChoices(); // always hide 1st

    manageableResetFilterListAspect.resetFilter();
  }, // esc keyup 
  // tab/enter "compleate hovered"

  /*stopEscKeyDownPropogation*/
  function () {
    return popupAspect.isChoicesVisible();
  });
  var pickDomFactory = PickDomFactory(css, componentPropertiesAspect, optionPropertiesAspect);
  var createPickAspect = BuildPickAspect(setOptionSelectedAspect, picks, picksDom, pickDomFactory);
  var choiceDomFactory = ChoiceDomFactory(css, optionPropertiesAspect);
  var buildChoiceAspect = BuildChoiceAspect(choicesDom, filterDom, choiceDomFactory, onChangeAspect, optionToggleAspect, createPickAspect, function (c, e) {
    return multiSelectInlineLayoutAspect.adoptChoiceElement(c, e);
  }, function (s) {
    return multiSelectInlineLayoutAspect.handleOnRemoveButton(s);
  });
  var buildAndAttachChoiceAspect = BuildAndAttachChoiceAspect(buildChoiceAspect);
  var disabledComponentAspect = DisabledComponentAspect(componentPropertiesAspect, picks, picksDom, function (newIsComponentDisabled) {
    return multiSelectInlineLayoutAspect.disableComponent(newIsComponentDisabled);
  });
  var appearanceAspect = AppearanceAspect(disabledComponentAspect);
  var fillChoicesAspect = FillChoicesAspect(window.document, createChoiceAspect, optionsAspect, choices, function (choice) {
    return buildAndAttachChoiceAspect.buildAndAttachChoice(choice);
  });
  var loadAspect = LoadAspect(fillChoicesAspect, appearanceAspect);
  var updateDataAspect = UpdateDataAspect(choicesDom, choices, picks, fillChoicesAspect,
  /*before*/
  function () {
    multiSelectInlineLayoutAspect.hideChoices(); // always hide 1st

    manageableResetFilterListAspect.resetFilter();
  });
  aspects.pickDomFactory = pickDomFactory;
  aspects.choiceDomFactory = choiceDomFactory;
  aspects.staticDom = staticDom;
  aspects.picksDom = picksDom;
  aspects.choicesDom = choicesDom;
  aspects.popupAspect = popupAspect;
  aspects.staticManager = staticManager;
  aspects.buildChoiceAspect = buildChoiceAspect;
  aspects.buildAndAttachChoiceAspect = buildAndAttachChoiceAspect;
  aspects.fillChoicesAspect = fillChoicesAspect;
  aspects.createPickAspect = createPickAspect;
  aspects.filterDom = filterDom;
  aspects.inputAspect = inputAspect;
  aspects.resetFilterListAspect = resetFilterListAspect;
  aspects.manageableResetFilterListAspect = manageableResetFilterListAspect;
  aspects.multiSelectInlineLayoutAspect = multiSelectInlineLayoutAspect;
  aspects.focusInAspect = focusInAspect;
  aspects.disabledComponentAspect = disabledComponentAspect;
  aspects.appearanceAspect = appearanceAspect;
  aspects.loadAspect = loadAspect;
  aspects.updateDataAspect = updateDataAspect;
  var pluginManager = PluginManager(plugins, aspects);
  var api = {
    component: "BsMultiSelect.api"
  }; // key used in memory leak analyzes

  pluginManager.buildApi(api);
  api.dispose = composeSync(multiSelectInlineLayoutAspect.hideChoices, disposeAspect.dispose, pluginManager.dispose, picks.dispose, multiSelectInlineLayoutAspect.dispose, choices.dispose, staticManager.dispose, popupAspect.dispose, picksDom.dispose, filterDom.dispose);
  api.updateData = updateDataAspect.updateData;

  api.update = function () {
    updateDataAspect.updateData();
    appearanceAspect.updateAppearance();
  };

  api.updateAppearance = appearanceAspect.updateAppearance;
  api.updateDisabled = disabledComponentAspect.updateDisabledComponent;
  onInit == null ? void 0 : onInit(api, aspects);
  picksDom.pickFilterElement.appendChild(filterDom.filterInputElement);
  picksDom.picksElement.appendChild(picksDom.pickFilterElement);
  staticManager.appendToContainer();
  popupAspect.init();
  loadAspect.load();
  return api;
}

var css = {
  choices: 'dropdown-menu',
  // bs4, in bsmultiselect.scss as ul.dropdown-menu
  choice_hover: 'hover',
  //  not bs4, in scss as 'ul.dropdown-menu li.hover'
  choice_selected: '',
  choice_disabled: '',
  picks: 'form-control',
  // bs4, in scss 'ul.form-control'
  picks_focus: 'focus',
  // not bs4, in scss 'ul.form-control.focus'
  picks_disabled: 'disabled',
  //  not bs4, in scss 'ul.form-control.disabled'
  pick_disabled: '',
  pickFilter: '',
  filterInput: '',
  // used in pickContentGenerator
  pick: 'badge',
  // bs4
  pickContent: '',
  pickContent_disabled: 'disabled',
  // not bs4, in scss 'ul.form-control li span.disabled'
  pickButton: 'close',
  // bs4
  // used in choiceContentGenerator
  // choice:  'dropdown-item', // it seems like hover should be managed manually since there should be keyboard support
  choiceCheckBox_disabled: 'disabled',
  //  not bs4, in scss as 'ul.form-control li .custom-control-input.disabled ~ .custom-control-label'
  choiceContent: 'custom-control custom-checkbox d-flex',
  // bs4 d-flex required for rtl to align items
  choiceCheckBox: 'custom-control-input',
  // bs4
  choiceLabel: 'custom-control-label justify-content-start',
  choiceLabel_disabled: ''
};
var cssPatch = {
  choices: {
    listStyleType: 'none'
  },
  picks: {
    listStyleType: 'none',
    display: 'flex',
    flexWrap: 'wrap',
    height: 'auto',
    marginBottom: '0'
  },
  choice: 'px-md-2 px-1',
  choice_hover: 'text-primary bg-light',
  filterInput: {
    border: '0px',
    height: 'auto',
    boxShadow: 'none',
    padding: '0',
    margin: '0',
    outline: 'none',
    backgroundColor: 'transparent',
    backgroundImage: 'none' // otherwise BS .was-validated set its image

  },
  filterInput_empty: 'form-control',
  // need for placeholder, TODO test form-control-plaintext
  // used in PicksDom
  picks_disabled: {
    backgroundColor: '#e9ecef'
  },
  picks_focus: {
    borderColor: '#80bdff',
    boxShadow: '0 0 0 0.2rem rgba(0, 123, 255, 0.25)'
  },
  picks_focus_valid: {
    borderColor: '',
    boxShadow: '0 0 0 0.2rem rgba(40, 167, 69, 0.25)'
  },
  picks_focus_invalid: {
    borderColor: '',
    boxShadow: '0 0 0 0.2rem rgba(220, 53, 69, 0.25)'
  },
  // used in BsAppearancePlugin
  picks_def: {
    minHeight: 'calc(2.25rem + 2px)'
  },
  picks_lg: {
    minHeight: 'calc(2.875rem + 2px)'
  },
  picks_sm: {
    minHeight: 'calc(1.8125rem + 2px)'
  },
  // used in pickContentGenerator
  pick: {
    paddingLeft: '0px',
    lineHeight: '1.5em'
  },
  pickButton: {
    fontSize: '1.5em',
    lineHeight: '.9em',
    float: "none"
  },
  pickContent_disabled: {
    opacity: '.65'
  },
  // used in choiceContentGenerator
  choiceContent: {
    justifyContent: 'flex-start'
  },
  // BS problem: without this on inline form menu items justified center
  choiceLabel: {
    color: 'inherit'
  },
  // otherwise BS .was-validated set its color
  choiceCheckBox: {
    color: 'inherit'
  },
  choiceLabel_disabled: {
    opacity: '.65'
  } // more flexible than {color: '#6c757d'}; note: avoid opacity on pickElement's border; TODO write to BS4 

};

function LabelPlugin(pluginData) {
  var configuration = pluginData.configuration,
      staticDom = pluginData.staticDom,
      filterDom = pluginData.filterDom;
  var containerClass = configuration.containerClass,
      label = configuration.label;

  var getLabelElementAspect = function getLabelElementAspect() {
    return defCall(label);
  };

  var labelPluginData = {
    getLabelElementAspect: getLabelElementAspect
  }; // overrided by BS Appearance Plugin

  pluginData.labelPluginData = labelPluginData;
  var createInputId = null;
  var selectElement = staticDom.selectElement,
      containerElement = staticDom.containerElement;
  var filterInputElement = filterDom.filterInputElement;
  if (selectElement) createInputId = function createInputId() {
    return containerClass + "-generated-input-" + (selectElement.id ? selectElement.id : selectElement.name).toLowerCase() + "-id";
  };else createInputId = function createInputId() {
    return containerClass + "-generated-filter-" + containerElement.id;
  };
  return {
    buildApi: function buildApi() {
      var labelElement = labelPluginData.getLabelElementAspect();
      var backupedForAttribute = null; // state saved between init and dispose

      if (labelElement) {
        backupedForAttribute = labelElement.getAttribute('for');
        var newId = createInputId();
        filterInputElement.setAttribute('id', newId);
        labelElement.setAttribute('for', newId);
      }

      if (backupedForAttribute) return function () {
        return labelElement.setAttribute('for', backupedForAttribute);
      };
    }
  };
}

function RtlPlugin(pluginData) {
  var configuration = pluginData.configuration,
      popupAspect = pluginData.popupAspect,
      staticDom = pluginData.staticDom;
  var isRtl = configuration.isRtl;
  var forceRtlOnContainer = false;
  if (isBoolean(isRtl)) forceRtlOnContainer = true;else isRtl = getIsRtl(staticDom.initialElement);
  var attributeBackup = AttributeBackup();

  if (forceRtlOnContainer) {
    attributeBackup.set(staticDom.containerElement, "dir", "rtl");
  } else if (staticDom.selectElement) {
    var dirAttributeValue = staticDom.selectElement.getAttribute("dir");

    if (dirAttributeValue) {
      attributeBackup.set(staticDom.containerElement, "dir", dirAttributeValue);
    }
  }

  if (isRtl) popupAspect.popperConfiguration.placement = 'bottom-end';
  return {
    dispose: function dispose() {
    }
  };
}

function FormResetPlugin(pluginData) {
  var staticDom = pluginData.staticDom,
      environment = pluginData.environment;
  return {
    buildApi: function buildApi(api) {
      var eventBuilder = EventBinder();

      if (staticDom.selectElement) {
        var form = closestByTagName(staticDom.selectElement, 'FORM');

        if (form) {
          eventBuilder.bind(form, 'reset', function () {
            return environment.window.setTimeout(function () {
              return api.updateData();
            });
          });
        }
      }

      return eventBuilder.unbind;
    }
  };
}

function createValidity(valueMissing, customError) {
  return Object.freeze({
    valueMissing: valueMissing,
    customError: customError,
    valid: !(valueMissing || customError)
  });
}

function ValidityApi(visibleElement, isValueMissingObservable, valueMissingMessage, onValid, trigger) {
  var customValidationMessage = "";
  var validationMessage = "";
  var validity = null;
  var willValidate = true;

  function setMessage(valueMissing, customError) {
    validity = createValidity(valueMissing, customError);
    validationMessage = customError ? customValidationMessage : valueMissing ? valueMissingMessage : "";
    visibleElement.setCustomValidity(validationMessage);
    onValid(validity.valid);
  }

  setMessage(isValueMissingObservable.getValue(), false);
  isValueMissingObservable.attach(function (value) {
    setMessage(value, validity.customError);
  });

  var checkValidity = function checkValidity() {
    if (!validity.valid) trigger('dashboardcode.multiselect:invalid');
    return validity.valid;
  };

  return {
    validationMessage: validationMessage,
    willValidate: willValidate,
    validity: validity,
    setCustomValidity: function setCustomValidity(message) {
      customValidationMessage = message;
      setMessage(validity.valueMissing, customValidationMessage ? true : false);
    },
    checkValidity: checkValidity,
    reportValidity: function reportValidity() {
      visibleElement.reportValidity();
      return checkValidity();
    }
  };
}

var defValueMissingMessage = 'Please select an item in the list';
function ValidationApiPlugin(pluginData) {
  var configuration = pluginData.configuration,
      triggerAspect = pluginData.triggerAspect,
      onChangeAspect = pluginData.onChangeAspect,
      optionsAspect = pluginData.optionsAspect,
      selectElementPluginData = pluginData.selectElementPluginData,
      staticDom = pluginData.staticDom,
      filterDom = pluginData.filterDom,
      updateDataAspect = pluginData.updateDataAspect; // TODO: required could be a function

  var getIsValueMissing = configuration.getIsValueMissing,
      valueMissingMessage = configuration.valueMissingMessage,
      required = configuration.required;
  if (!isBoolean(required)) required = selectElementPluginData == null ? void 0 : selectElementPluginData.required;else if (!isBoolean(required)) required = false;
  valueMissingMessage = defCall(valueMissingMessage, function () {
    return getDataGuardedWithPrefix(staticDom.initialElement, "bsmultiselect", "value-missing-message");
  }, defValueMissingMessage);

  if (!getIsValueMissing) {
    getIsValueMissing = function getIsValueMissing() {
      var count = 0;
      var optionsArray = optionsAspect.getOptions();

      for (var i = 0; i < optionsArray.length; i++) {
        if (optionsArray[i].selected) count++;
      }

      return count === 0;
    };
  }

  var isValueMissingObservable = ObservableLambda(function () {
    return required && getIsValueMissing();
  });
  var validationApiObservable = ObservableValue(!isValueMissingObservable.getValue());
  onChangeAspect.onChange = composeSync(isValueMissingObservable.call, onChangeAspect.onChange);
  updateDataAspect.updateData = composeSync(isValueMissingObservable.call, updateDataAspect.updateData);
  pluginData.validationApiPluginData = {
    validationApiObservable: validationApiObservable
  };
  var validationApi = ValidityApi(filterDom.filterInputElement, isValueMissingObservable, valueMissingMessage, function (isValid) {
    return validationApiObservable.setValue(isValid);
  }, triggerAspect.trigger);
  return {
    buildApi: function buildApi(api) {
      api.validationApi = validationApi;
    },
    dispose: function dispose() {
      isValueMissingObservable.detachAll();
      validationApiObservable.detachAll();
    }
  };
}

ValidationApiPlugin.plugDefaultConfig = function (defaults) {
  defaults.valueMissingMessage = '';
};

function BsAppearancePlugin(pluginData) {
  var configuration = pluginData.configuration,
      validationApiPluginData = pluginData.validationApiPluginData,
      picksDom = pluginData.picksDom,
      staticDom = pluginData.staticDom,
      labelPluginData = pluginData.labelPluginData,
      appearanceAspect = pluginData.appearanceAspect,
      componentPropertiesAspect = pluginData.componentPropertiesAspect;
  var getValidity = configuration.getValidity,
      getSize = configuration.getSize,
      useCssPatch = configuration.useCssPatch,
      css = configuration.css;
  var selectElement = staticDom.selectElement;

  if (labelPluginData) {
    var origGetLabelElementAspect = labelPluginData.getLabelElementAspect;

    labelPluginData.getLabelElementAspect = function () {
      var e = origGetLabelElementAspect();
      if (e) return e;else {
        var value = null;
        var formGroup = closestByClassName(selectElement, 'form-group');
        if (formGroup) value = formGroup.querySelector("label[for=\"" + selectElement.id + "\"]");
        return value;
      }
    };
  }

  if (staticDom.selectElement) {
    if (!getValidity) getValidity = composeGetValidity(selectElement);
    if (!getSize) getSize = composeGetSize(selectElement);
  } else {
    if (!getValidity) getValidity = function getValidity() {
      return null;
    };
    if (!getSize) getSize = function getSize() {
      return null;
    };
  }

  componentPropertiesAspect.getSize = getSize;
  componentPropertiesAspect.getValidity = getValidity;
  var updateSize;

  if (!useCssPatch) {
    updateSize = function updateSize() {
      return updateSizeForAdapter(picksDom.picksElement, getSize);
    };
  } else {
    var picks_lg = css.picks_lg,
        picks_sm = css.picks_sm,
        picks_def = css.picks_def;

    updateSize = function updateSize() {
      return updateSizeJsForAdapter(picksDom.picksElement, picks_lg, picks_sm, picks_def, getSize);
    };
  }

  if (useCssPatch) {
    var origToggleFocusStyling = picksDom.toggleFocusStyling;

    picksDom.toggleFocusStyling = function () {
      var validity = validationObservable.getValue();
      var isFocusIn = picksDom.getIsFocusIn();
      origToggleFocusStyling(isFocusIn);

      if (isFocusIn) {
        if (validity === false) {
          // but not toggle events (I know it will be done in future)
          picksDom.setIsFocusIn(isFocusIn);
          addStyling(picksDom.picksElement, css.picks_focus_invalid);
        } else if (validity === true) {
          // but not toggle events (I know it will be done in future)
          picksDom.setIsFocusIn(isFocusIn);
          addStyling(picksDom.picksElement, css.picks_focus_valid);
        }
      }
    };
  }

  var getWasValidated = function getWasValidated() {
    var wasValidatedElement = closestByClassName(staticDom.initialElement, 'was-validated');
    return wasValidatedElement ? true : false;
  };

  var wasUpdatedObservable = ObservableLambda(function () {
    return getWasValidated();
  });
  var getManualValidationObservable = ObservableLambda(function () {
    return getValidity();
  });
  var validationApiObservable = validationApiPluginData == null ? void 0 : validationApiPluginData.validationApiObservable;
  var validationObservable = ObservableLambda(function () {
    return wasUpdatedObservable.getValue() ? validationApiObservable.getValue() : getManualValidationObservable.getValue();
  });
  validationObservable.attach(function (value) {
    var _getMessagesElements = getMessagesElements(staticDom.containerElement),
        validMessages = _getMessagesElements.validMessages,
        invalidMessages = _getMessagesElements.invalidMessages;

    updateValidity(picksDom.picksElement, validMessages, invalidMessages, value);
    picksDom.toggleFocusStyling();
  });
  wasUpdatedObservable.attach(function () {
    return validationObservable.call();
  });
  validationApiObservable.attach(function () {
    return validationObservable.call();
  });
  getManualValidationObservable.attach(function () {
    return validationObservable.call();
  });
  appearanceAspect.updateAppearance = composeSync(appearanceAspect.updateAppearance, updateSize, validationObservable.call, getManualValidationObservable.call);
  return {
    buildApi: function buildApi(api) {
      api.updateSize = updateSize;

      api.updateValidity = function () {
        return getManualValidationObservable.call();
      };

      api.updateWasValidated = function () {
        return wasUpdatedObservable.call();
      };
    },
    dispose: function dispose() {
      wasUpdatedObservable.detachAll();
      validationObservable.detachAll();
      getManualValidationObservable.detachAll();
    }
  };
}

function updateValidity(picksElement, validMessages, invalidMessages, validity) {
  if (validity === false) {
    picksElement.classList.add('is-invalid');
    picksElement.classList.remove('is-valid');
    invalidMessages.map(function (e) {
      return e.style.display = 'block';
    });
    validMessages.map(function (e) {
      return e.style.display = 'none';
    });
  } else if (validity === true) {
    picksElement.classList.remove('is-invalid');
    picksElement.classList.add('is-valid');
    invalidMessages.map(function (e) {
      return e.style.display = 'none';
    });
    validMessages.map(function (e) {
      return e.style.display = 'block';
    });
  } else {
    picksElement.classList.remove('is-invalid');
    picksElement.classList.remove('is-valid');
    invalidMessages.map(function (e) {
      return e.style.display = '';
    });
    validMessages.map(function (e) {
      return e.style.display = '';
    });
  }
}

function updateSize(picksElement, size) {
  if (size == "lg") {
    picksElement.classList.add('form-control-lg');
    picksElement.classList.remove('form-control-sm');
  } else if (size == "sm") {
    picksElement.classList.remove('form-control-lg');
    picksElement.classList.add('form-control-sm');
  } else {
    picksElement.classList.remove('form-control-lg');
    picksElement.classList.remove('form-control-sm');
  }
}

function updateSizeJs(picksElement, picksLgStyling, picksSmStyling, picksDefStyling, size) {
  updateSize(picksElement, size);

  if (size == "lg") {
    addStyling(picksElement, picksLgStyling);
  } else if (size == "sm") {
    addStyling(picksElement, picksSmStyling);
  } else {
    addStyling(picksElement, picksDefStyling);
  }
}

function updateSizeForAdapter(picksElement, getSize) {
  updateSize(picksElement, getSize());
}

function updateSizeJsForAdapter(picksElement, picksLgStyling, picksSmStyling, picksDefStyling, getSize) {
  updateSizeJs(picksElement, picksLgStyling, picksSmStyling, picksDefStyling, getSize());
}

function getMessagesElements(containerElement) {
  var siblings = siblingsAsArray(containerElement);
  var invalidMessages = siblings.filter(function (e) {
    return e.classList.contains('invalid-feedback') || e.classList.contains('invalid-tooltip');
  });
  var validMessages = siblings.filter(function (e) {
    return e.classList.contains('valid-feedback') || e.classList.contains('valid-tooltip');
  });
  return {
    validMessages: validMessages,
    invalidMessages: invalidMessages
  };
}

function composeGetValidity(selectElement) {
  var getValidity = function getValidity() {
    return selectElement.classList.contains('is-invalid') ? false : selectElement.classList.contains('is-valid') ? true : null;
  };

  return getValidity;
}

function composeGetSize(selectElement) {
  var inputGroupElement = closestByClassName(selectElement, 'input-group');
  var getSize = null;

  if (inputGroupElement) {
    getSize = function getSize() {
      var value = null;
      if (inputGroupElement.classList.contains('input-group-lg')) value = 'lg';else if (inputGroupElement.classList.contains('input-group-sm')) value = 'sm';
      return value;
    };
  } else {
    getSize = function getSize() {
      var value = null;
      if (selectElement.classList.contains('custom-select-lg') || selectElement.classList.contains('form-control-lg')) value = 'lg';else if (selectElement.classList.contains('custom-select-sm') || selectElement.classList.contains('form-control-sm')) value = 'sm';
      return value;
    };
  }

  return getSize;
}

function HiddenOptionPlugin(pluginData) {
  var configuration = pluginData.configuration,
      optionsAspect = pluginData.optionsAspect,
      options = pluginData.options,
      createChoiceAspect = pluginData.createChoiceAspect,
      isChoiceSelectableAspect = pluginData.isChoiceSelectableAspect,
      choices = pluginData.choices,
      buildChoiceAspect = pluginData.buildChoiceAspect,
      buildAndAttachChoiceAspect = pluginData.buildAndAttachChoiceAspect,
      countableChoicesListInsertAspect = pluginData.countableChoicesListInsertAspect,
      countableChoicesList = pluginData.countableChoicesList;

  countableChoicesListInsertAspect.countableChoicesListInsert = function (choice, key) {
    if (!choice.isOptionHidden) {
      var choiceNext = choices.getNext(key, function (c) {
        return !c.isOptionHidden;
      });
      countableChoicesList.add(choice, choiceNext);
    }
  };

  var origBuildAndAttachChoice = buildAndAttachChoiceAspect.buildAndAttachChoice;

  buildAndAttachChoiceAspect.buildAndAttachChoice = function (choice, getNextElement) {
    if (choice.isOptionHidden) {
      buildHiddenChoice(choice);
    } else {
      origBuildAndAttachChoice(choice, getNextElement);
    }
  };

  var origIsSelectable = isChoiceSelectableAspect.isSelectable;

  isChoiceSelectableAspect.isSelectable = function (choice) {
    return origIsSelectable(choice) && !choice.isOptionHidden;
  };

  var getIsOptionHidden = configuration.getIsOptionHidden;

  if (options) {
    if (!getIsOptionHidden) getIsOptionHidden = function getIsOptionHidden(option) {
      return option.hidden === undefined ? false : option.hidden;
    };
  } else {
    if (!getIsOptionHidden) getIsOptionHidden = function getIsOptionHidden(option) {
      return option.hidden;
    };
  }

  var origСreateChoice = createChoiceAspect.createChoice;

  createChoiceAspect.createChoice = function (option) {
    var choice = origСreateChoice(option);
    choice.isOptionHidden = getIsOptionHidden(option);
    return choice;
  };

  return {
    buildApi: function buildApi(api) {
      api.updateOptionsHidden = function () {
        return updateOptionsHidden(optionsAspect, choices, countableChoicesList, getIsOptionHidden, buildChoiceAspect);
      };

      api.updateOptionHidden = function (key) {
        return updateOptionHidden(key, choices, countableChoicesList, getIsOptionHidden, buildChoiceAspect);
      };
    }
  };
}

function updateHidden(choice, getNextNonHidden, countableChoicesList, buildChoiceAspect) {
  if (choice.isOptionHidden) {
    countableChoicesList.remove(choice);
    choice.remove();
    buildHiddenChoice(choice);
  } else {
    var nextChoice = getNextNonHidden();
    countableChoicesList.add(choice, nextChoice);
    buildChoiceAspect.buildChoice(choice);
    choice.choiceElementAttach(nextChoice == null ? void 0 : nextChoice.choiceElement);
  }
}

function buildHiddenChoice(choice) {
  choice.updateSelected = function () {
    return void 0;
  };

  choice.updateDisabled = function () {
    return void 0;
  };

  choice.isChoiceElementAttached = false;
  choice.choiceElement = null;
  choice.choiceElementAttach = null;
  choice.setVisible = null;
  choice.setHoverIn = null;
  choice.remove = null;

  choice.dispose = function () {
    choice.dispose = null;
  };
}

function updateOptionsHidden(optionsAspect, choices, countableChoicesList, getIsOptionHidden, buildChoiceAspect) {
  var options = optionsAspect.getOptions();

  for (var i = 0; i < options.length; i++) {
    updateOptionHidden(i, choices, countableChoicesList, getIsOptionHidden, buildChoiceAspect);
  }
}

function updateOptionHidden(key, choices, countableChoicesList, getIsOptionHidden, buildChoiceAspect) {
  var choice = choices.get(key);

  var getNextNonHidden = function getNextNonHidden() {
    return choices.getNext(key, function (c) {
      return !c.isOptionHidden;
    });
  };

  updateHiddenChoice(choice, getNextNonHidden, countableChoicesList, getIsOptionHidden, buildChoiceAspect);
}

function updateHiddenChoice(choice, getNextNonHidden, countableChoicesList, getIsOptionHidden, buildChoiceAspect) {
  var newIsOptionHidden = getIsOptionHidden(choice.option);

  if (newIsOptionHidden != choice.isOptionHidden) {
    choice.isOptionHidden = newIsOptionHidden;
    updateHidden(choice, getNextNonHidden, countableChoicesList, buildChoiceAspect);
  }
}

function CssPatchPlugin() {}

CssPatchPlugin.plugDefaultConfig = function (defaults) {
  defaults.useCssPatch = true;
  defaults.cssPatch = cssPatch;
};

CssPatchPlugin.plugMergeSettings = function (configuration, defaults, settings) {
  var cssPatch = settings == null ? void 0 : settings.cssPatch;
  if (isBoolean(cssPatch)) throw new Error("BsMultiSelect: 'cssPatch' was used instead of 'useCssPatch'"); // often type of error

  configuration.cssPatch = createCss(defaults.cssPatch, cssPatch); // replace classes, merge styles
};

CssPatchPlugin.plugStaticDom = function (configurationPluginData) {
  var configuration = configurationPluginData.configuration;
  if (configuration.useCssPatch) extendCss(configuration.css, configuration.cssPatch);
};

function PlaceholderPlugin(pluginData) {
  var configuration = pluginData.configuration,
      staticManager = pluginData.staticManager,
      picks = pluginData.picks,
      picksDom = pluginData.picksDom,
      filterDom = pluginData.filterDom,
      staticDom = pluginData.staticDom,
      updateDataAspect = pluginData.updateDataAspect,
      createPickAspect = pluginData.createPickAspect,
      resetFilterListAspect = pluginData.resetFilterListAspect,
      filterManagerAspect = pluginData.filterManagerAspect;
  var placeholder = configuration.placeholder,
      css = configuration.css;
  var picksElement = picksDom.picksElement;
  var filterInputElement = filterDom.filterInputElement;

  if (!placeholder) {
    placeholder = getDataGuardedWithPrefix(staticDom.initialElement, "bsmultiselect", "placeholder");
  }

  function setEmptyInputWidth(isVisible) {
    if (isVisible) filterInputElement.style.width = '100%';else filterInputElement.style.width = '2ch';
  }

  var emptyToggleStyling = toggleStyling(filterInputElement, css.filterInput_empty);

  function showPlacehodler(isVisible) {
    if (isVisible) {
      filterInputElement.placeholder = placeholder ? placeholder : '';
      picksElement.style.display = 'block';
    } else {
      filterInputElement.placeholder = '';
      picksElement.style.display = 'flex';
    }

    emptyToggleStyling(isVisible);
    setEmptyInputWidth(isVisible);
  }

  showPlacehodler(true);

  function setDisabled(isComponentDisabled) {
    filterInputElement.disabled = isComponentDisabled;
  }

  var isEmpty = function isEmpty() {
    return picks.isEmpty() && filterDom.isEmpty();
  };

  function updatePlacehodlerVisibility() {
    showPlacehodler(isEmpty());
  }

  function updateEmptyInputWidth() {
    setEmptyInputWidth(isEmpty());
  }
  var origDisable = picksDom.disable;

  picksDom.disable = function (isComponentDisabled) {
    setDisabled(isComponentDisabled);
    origDisable(isComponentDisabled);
  };

  staticManager.appendToContainer = composeSync(staticManager.appendToContainer, updateEmptyInputWidth);
  filterManagerAspect.processEmptyInput = composeSync(updateEmptyInputWidth, filterManagerAspect.processEmptyInput);
  resetFilterListAspect.forceResetFilter = composeSync(resetFilterListAspect.forceResetFilter, updatePlacehodlerVisibility);
  var origBuildPick = createPickAspect.buildPick;

  createPickAspect.buildPick = function (choice, handleOnRemoveButton) {
    var removePick = origBuildPick(choice, handleOnRemoveButton);
    if (picks.getCount() == 1) updatePlacehodlerVisibility();
    return function () {
      removePick();
      if (picks.getCount() == 0) updatePlacehodlerVisibility();
    };
  };

  updateDataAspect.updateData = composeSync(updateDataAspect.updateData, updatePlacehodlerVisibility);
}

function JQueryMethodsPlugin(pluginData) {
  var staticDom = pluginData.staticDom,
      choicesDom = pluginData.choicesDom,
      filterDom = pluginData.filterDom,
      picks = pluginData.picks;
  return {
    buildApi: function buildApi(api) {
      api.getContainer = function () {
        return staticDom.containerElement;
      };

      api.getChoices = function () {
        return choicesDom.choicesElement;
      };

      api.getFilterInput = function () {
        return filterDom.filterInputElement;
      };

      api.getPicks = function () {
        return picksDom.picksElement;
      };

      api.picksCount = function () {
        return picks.getCount();
      }; //api.staticContent = popupAspect; // depricated, alternative accept to popupAspect.setChoicesVisible


      pluginData.jQueryMethodsPluginData = {
        EventBinder: EventBinder,
        addStyling: addStyling,
        toggleStyling: toggleStyling
      };
    }
  };
}

function OptionsApiPlugin(pluginData) {
  var buildAndAttachChoiceAspect = pluginData.buildAndAttachChoiceAspect,
      manageableResetFilterListAspect = pluginData.manageableResetFilterListAspect,
      choices = pluginData.choices,
      createChoiceAspect = pluginData.createChoiceAspect,
      setOptionSelectedAspect = pluginData.setOptionSelectedAspect,
      optionPropertiesAspect = pluginData.optionPropertiesAspect,
      optionsAspect = pluginData.optionsAspect,
      multiSelectInlineLayoutAspect = pluginData.multiSelectInlineLayoutAspect;
  return {
    buildApi: function buildApi(api) {
      api.setOptionSelected = function (key, value) {
        var choice = choices.get(key);
        setOptionSelectedAspect.setOptionSelected(choice, value);
      };

      api.updateOptionSelected = function (key) {
        var choice = choices.get(key); // TODO: generalize index as key

        var newIsSelected = optionPropertiesAspect.getSelected(choice.option);

        if (newIsSelected != choice.isOptionSelected) {
          choice.isOptionSelected = newIsSelected;
          choice.updateSelected();
        }
      };

      api.updateOptionDisabled = function (key) {
        var choice = choices.get(key); // TODO: generalize index as key 

        var newIsDisabled = optionPropertiesAspect.getDisabled(choice.option);

        if (newIsDisabled != choice.isOptionDisabled) {
          choice.isOptionDisabled = newIsDisabled;
          choice.updateDisabled();
        }
      };

      api.updateOptionAdded = function (key) {
        // TODO: generalize index as key 
        var options = optionsAspect.getOptions();
        var option = options[key];
        var choice = createChoiceAspect.createChoice(option);
        choices.insert(key, choice);

        var nextChoice = function nextChoice() {
          return choices.getNext(key, function (c) {
            return c.choiceElement;
          });
        };

        buildAndAttachChoiceAspect.buildAndAttachChoice(choice, function () {
          var _nextChoice;

          return (_nextChoice = nextChoice()) == null ? void 0 : _nextChoice.choiceElement;
        });
      };

      api.updateOptionRemoved = function (key) {
        // TODO: generalize index as key 
        multiSelectInlineLayoutAspect.hideChoices(); // always hide 1st, then reset filter

        manageableResetFilterListAspect.resetFilter();
        var choice = choices.remove(key);
        choice.remove == null ? void 0 : choice.remove();
        choice.dispose == null ? void 0 : choice.dispose();
      };
    }
  };
}

function SelectElementPlugin() {}

SelectElementPlugin.plugStaticDom = function (aspects) {
  var configuration = aspects.configuration,
      staticDomFactory = aspects.staticDomFactory,
      createElementAspect = aspects.createElementAspect,
      optionPropertiesAspect = aspects.optionPropertiesAspect,
      componentPropertiesAspect = aspects.componentPropertiesAspect,
      onChangeAspect = aspects.onChangeAspect,
      triggerAspect = aspects.triggerAspect,
      optionsAspect = aspects.optionsAspect,
      disposeAspect = aspects.disposeAspect;
  var origCreate = staticDomFactory.create;

  staticDomFactory.create = function (css) {
    var _origCreate = origCreate(css),
        choicesDom = _origCreate.choicesDom,
        origCreateStaticDom = _origCreate.createStaticDom;

    var choicesElement = choicesDom.choicesElement;
    return {
      choicesDom: choicesDom,
      createStaticDom: function createStaticDom(element, containerClass) {
        var selectElement = null;
        var containerElement = null;
        var picksElement = null;

        if (element.tagName == 'SELECT') {
          selectElement = element;

          if (containerClass) {
            containerElement = closestByClassName(selectElement, containerClass);
            if (containerElement) picksElement = findDirectChildByTagName(containerElement, 'UL');
          }
        } else if (element.tagName == 'DIV') {
          selectElement = findDirectChildByTagName(element, 'SELECT');

          if (selectElement) {
            if (containerClass) {
              containerElement = closestByClassName(element, containerClass);
              if (containerElement) picksElement = findDirectChildByTagName(containerElement, 'UL');
            }
          } else {
            return origCreateStaticDom(element, containerClass);
          }
        }

        var disposableContainerElement = false;

        if (!containerElement) {
          containerElement = createElementAspect.createElement('DIV');
          containerElement.classList.add(containerClass);
          disposableContainerElement = true;
        }

        var disposablePicksElement = false;

        if (!picksElement) {
          picksElement = createElementAspect.createElement('UL');
          disposablePicksElement = true;
        }

        if (selectElement) {
          var backupDisplay = selectElement.style.display;
          selectElement.style.display = 'none';
          var backupedRequired = selectElement.required;
          aspects.selectElementPluginData = {
            required: backupedRequired
          };
          if (selectElement.required === true) selectElement.required = false;
          var getDisabled = configuration.getDisabled,
              getIsOptionDisabled = configuration.getIsOptionDisabled;

          if (!getDisabled) {
            var fieldsetElement = closestByTagName(selectElement, 'FIELDSET');

            if (fieldsetElement) {
              componentPropertiesAspect.getDisabled = function () {
                return selectElement.disabled || fieldsetElement.disabled;
              };
            } else {
              componentPropertiesAspect.getDisabled = function () {
                return selectElement.disabled;
              };
            }
          }

          onChangeAspect.onChange = composeSync(function () {
            return triggerAspect.trigger('change');
          }, onChangeAspect.onChange);

          optionsAspect.getOptions = function () {
            return selectElement.options;
          };

          if (!getIsOptionDisabled) optionPropertiesAspect.getDisabled = function (option) {
            return option.disabled;
          }; // if (!setSelected){
          //     setSelected = (option, value) => {option.selected = value};
          //     // NOTE: adding this (setAttribute) break Chrome's html form reset functionality:
          //     // if (value) option.setAttribute('selected','');
          //     // else option.removeAttribute('selected');
          // }

          disposeAspect.dispose = composeSync(disposeAspect.dispose, function () {
            selectElement.required = backupedRequired;
            selectElement.style.display = backupDisplay;
          });
        }

        return {
          staticDom: {
            initialElement: element,
            containerElement: containerElement,
            picksElement: picksElement,
            disposablePicksElement: disposablePicksElement,
            selectElement: selectElement
          },
          staticManager: {
            appendToContainer: function appendToContainer() {
              if (disposableContainerElement) {
                selectElement.parentNode.insertBefore(containerElement, selectElement.nextSibling);
                containerElement.appendChild(choicesElement);
              } else {
                selectElement.parentNode.insertBefore(choicesElement, selectElement.nextSibling);
              }

              if (disposablePicksElement) containerElement.appendChild(picksElement);
            },
            dispose: function dispose() {
              choicesElement.parentNode.removeChild(choicesElement);
              if (disposableContainerElement) selectElement.parentNode.removeChild(containerElement);
              if (disposablePicksElement) containerElement.removeChild(picksElement);
            }
          }
        };
      }
    };
  };
};

function SelectAllApiPlugin(pluginData) {
  var multiSelectInlineLayoutAspect = pluginData.multiSelectInlineLayoutAspect,
      choices = pluginData.choices,
      picks = pluginData.picks,
      isChoiceSelectableAspect = pluginData.isChoiceSelectableAspect,
      setOptionSelectedAspect = pluginData.setOptionSelectedAspect,
      manageableResetFilterListAspect = pluginData.manageableResetFilterListAspect;
  return {
    buildApi: function buildApi(api) {
      api.selectAll = function () {
        multiSelectInlineLayoutAspect.hideChoices(); // always hide 1st

        choices.forLoop(function (choice) {
          if (isChoiceSelectableAspect.isSelectable(choice)) setOptionSelectedAspect.setOptionSelected(choice, true);
        });
        manageableResetFilterListAspect.resetFilter();
      };

      api.deselectAll = function () {
        multiSelectInlineLayoutAspect.hideChoices(); // always hide 1st

        picks.removeAll();
        manageableResetFilterListAspect.resetFilter();
      };
    }
  };
}

function UpdateOptionsSelectedApiPlugin(pluginData) {
  var choices = pluginData.choices,
      optionPropertiesAspect = pluginData.optionPropertiesAspect;
  return {
    buildApi: function buildApi(api) {
      // used in FormRestoreOnBackwardPlugin
      api.updateOptionsSelected = function () {
        choices.forLoop(function (choice) {
          var newIsSelected = optionPropertiesAspect.getSelected(choice.option);

          if (newIsSelected != choice.isOptionSelected) {
            choice.isOptionSelected = newIsSelected;
            choice.updateSelected();
          }
        });
      };
    }
  };
}

function DisabledOptionApiPlugin(pluginData) {
  var choices = pluginData.choices,
      optionPropertiesAspect = pluginData.optionPropertiesAspect;
  return {
    buildApi: function buildApi(api) {
      api.updateOptionsDisabled = function () {
        return updateOptionsDisabled(choices, optionPropertiesAspect);
      };
    }
  };
}

function updateOptionsDisabled(choices, optionPropertiesAspect) {
  choices.forLoop(function (choice) {
    var newIsDisabled = optionPropertiesAspect.getDisabled(choice.option);

    if (newIsDisabled != choice.isOptionDisabled) {
      choice.isOptionDisabled = newIsDisabled;
      choice.updateDisabled();
    }
  });
}

function FormRestoreOnBackwardPlugin(pluginData) {
  var staticDom = pluginData.staticDom,
      environment = pluginData.environment,
      loadAspect = pluginData.loadAspect;
  var window = environment.window;
  return {
    buildApi: function buildApi(api) {
      if (!api.updateOptionsSelected) throw new Error("BsMultisilect: FormRestoreOnBackwardPlugin requires UpdateOptionsSelectedApiPlugin defined first");
      var origLoad = loadAspect.load;

      loadAspect.load = function () {
        origLoad(); // support browser's "step backward" and form's values restore

        if (staticDom.selectElement && window.document.readyState != "complete") {
          window.setTimeout(function () {
            api.updateOptionsSelected();
          });
        }
      };
    }
  };
}

var defaults = {
  containerClass: "dashboardcode-bsmultiselect",
  css: css
};
var defaultPlugins = [CssPatchPlugin, SelectElementPlugin, LabelPlugin, HiddenOptionPlugin, ValidationApiPlugin, BsAppearancePlugin, FormResetPlugin, RtlPlugin, PlaceholderPlugin, OptionsApiPlugin, SelectAllApiPlugin, JQueryMethodsPlugin, UpdateOptionsSelectedApiPlugin, FormRestoreOnBackwardPlugin, DisabledOptionApiPlugin];
function BsMultiSelect$1(element, environment, settings) {
  if (!environment.trigger) environment.trigger = function (e, name) {
    return e.dispatchEvent(new environment.window.Event(name));
  };
  if (!environment.plugins) environment.plugins = defaultPlugins;
  var configuration = {};
  configuration.css = createCss(defaults.css, settings == null ? void 0 : settings.css);
  plugMergeSettings(defaultPlugins, configuration, defaults, settings);
  extendIfUndefined(configuration, settings);
  extendIfUndefined(configuration, defaults);
  return BsMultiSelect(element, environment, configuration, settings == null ? void 0 : settings.onInit);
}
plugDefaultConfig(defaultPlugins, defaults);
BsMultiSelect$1.defaults = defaults;
BsMultiSelect$1.tools = {
  EventBinder: EventBinder,
  addStyling: addStyling,
  toggleStyling: toggleStyling,
  composeSync: composeSync
};
BsMultiSelect$1.plugins = {
  CssPatchPlugin: CssPatchPlugin,
  SelectElementPlugin: SelectElementPlugin,
  LabelPlugin: LabelPlugin,
  HiddenOptionPlugin: HiddenOptionPlugin,
  ValidationApiPlugin: ValidationApiPlugin,
  BsAppearancePlugin: BsAppearancePlugin,
  FormResetPlugin: FormResetPlugin,
  RtlPlugin: RtlPlugin,
  PlaceholderPlugin: PlaceholderPlugin,
  OptionsApiPlugin: OptionsApiPlugin,
  SelectAllApiPlugin: SelectAllApiPlugin,
  JQueryMethodsPlugin: JQueryMethodsPlugin,
  UpdateOptionsSelectedApiPlugin: UpdateOptionsSelectedApiPlugin,
  FormRestoreOnBackwardPlugin: FormRestoreOnBackwardPlugin,
  DisabledOptionApiPlugin: DisabledOptionApiPlugin
};

export { BsMultiSelect$1 as BsMultiSelect };
//# sourceMappingURL=BsMultiSelect.esm.js.map
