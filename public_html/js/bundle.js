/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2022 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2022 Josha Munnik
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
// region types
/**
 * {@link UFObject} implements various support methods for objects.
 */
class UFObject {
    // region constructor
    /**
     * Utility class with only static methods, do not allow instances.
     *
     * @private
     */
    constructor() {
    }
    // endregion
    // region public methods
    /**
     * Gets a property or throws an error if the property is missing.
     *
     * @param objectValue
     *   Object to get property from
     * @param propertyName
     *   Property to get
     *
     * @return value of property
     *
     * @throws an error if the object does not contain the property
     */
    static getOrFail(objectValue, propertyName) {
        if (propertyName in objectValue) {
            return objectValue[propertyName];
        }
        throw new Error(`Missing ${propertyName} in object`);
    }
    /**
     * Gets a property as a certain type or throws an error if the property is missing.
     *
     * @param objectValue
     *   Object to get property from
     * @param propertyName
     *   Property to get
     *
     * @return value of property
     *
     * @throws an error if the object does not contain the property
     */
    static getOrFailAs(objectValue, propertyName) {
        return UFObject.getOrFail(objectValue, propertyName);
    }
    /**
     * Gets a property from an object.
     *
     * @param objectValue
     *   Object to get property from
     * @param propertyName
     *   Property to get
     * @param defaultValue
     *   Default value to use
     *
     * @return value from property or aDefault if it does not exist
     */
    static get(objectValue, propertyName, defaultValue) {
        return propertyName in objectValue ? objectValue[propertyName] : defaultValue;
    }
    /**
     * Gets a property from an object and typecast it to a type.
     *
     * @param objectValue
     *   Object to get property from
     * @param propertyName
     *   Property to get
     * @param defaultValue
     *   Default value to use
     *
     * @return value from property or aDefault if it does not exist
     */
    static getAs(objectValue, propertyName, defaultValue) {
        return propertyName in objectValue ? objectValue[propertyName] : defaultValue;
    }
    /**
     * Sets a property in an object to a value. If the property can not be found, the method does
     * nothing.
     *
     * @param objectValue
     *   Object to get property from
     * @param propertyName
     *   Property to set
     * @param value
     *   Value to set property with
     */
    static set(objectValue, propertyName, value) {
        if (propertyName in objectValue) {
            objectValue[propertyName] = value;
        }
    }
    /**
     * Sets a property in an object to a value. If the property can not be found, the method throws
     * an error.
     *
     * @param objectValue
     *   Object to get property from
     * @param propertyName
     *   Property to set
     * @param value
     *   Value to set property with
     */
    static setOrFail(objectValue, propertyName, value) {
        if (propertyName in objectValue) {
            objectValue[propertyName] = value;
        }
        else {
            throw new Error(`Missing ${propertyName} in object`);
        }
    }
    /**
     * Gets a property from an object. If there is no property, create a new value and attach it
     * to the object.
     *
     * @param objectValue
     *   Object to get property from
     * @param propertyName
     *   Name of property to get
     * @param factory
     *   Factory function to create a new value
     *
     * @return value from property
     */
    static getAttachedAs(objectValue, propertyName, factory) {
        if (!(propertyName in objectValue)) {
            objectValue[propertyName] = factory();
        }
        return objectValue[propertyName];
    }
    /**
     * See if all properties in aMatch can be found in aSource and are equal. If a property is
     * an object, the method will call itself recursively.
     *
     * Only properties defined in aMatch are checked.
     *
     * @param source
     *   Source object to test
     * @param match
     *   Contains properties to match
     * @param ignoreCase
     *   True: ignore case of string properties, false: casing must match for properties to be equal
     *
     * @return True: all properties found and matching in value
     */
    static equalProperties(source, match, ignoreCase = false) {
        // go through all properties in aMatch
        for (let propertyName in match) {
            // only test properties that are defined by aMatch
            if (match.hasOwnProperty(propertyName)) {
                // exit if source does not have that property
                if (!source.hasOwnProperty(propertyName)) {
                    return false;
                }
                // handle certain types
                switch (typeof (match[propertyName])) {
                    case 'object':
                        // match properties of both objects
                        if (!UFObject.equalProperties(source[propertyName], match[propertyName], ignoreCase)) {
                            return false;
                        }
                        break;
                    case 'string':
                        // convert both to lower case if ignoring case
                        let sourceText = source[propertyName];
                        let matchText = match[propertyName];
                        if (ignoreCase) {
                            sourceText = sourceText.toLowerCase();
                            matchText = matchText.toLowerCase();
                        }
                        if (sourceText !== matchText) {
                            return false;
                        }
                        break;
                    default:
                        // exit if source is not equal to match
                        if (source[propertyName] !== match[propertyName]) {
                            return false;
                        }
                        break;
                }
            }
        }
        // all properties passed the test, so aSource matched
        // all properties in aMatch
        return true;
    }
    /**
     * Create a copy of the map object, setting properties in it to values of properties in aSource.
     *
     * aMap can contain properties with basic types or properties of type Object. In that case the
     * object properties are scanned.
     *
     * If aSource is an Array instance, a new Array instance is created else a new Object
     * instance is used.
     *
     * @param source
     *   Source object to obtain values from
     * @param map
     *   An object with various properties
     *
     * @return A copy of aMap with values obtained from a Source.
     *
     * @example make copy of some properties in TextInput
     * <listing>
     * var map = Object = {
     *   text: 'some text',
     *   textField: {
     *     borderColor: 0xFF0000,
     *     backgroundColor: 0xFFCCCC
     *   }
     * };
     * var data: Object = UFObject.backupProperties(SomeTextInput, map);
     * // data.text = text of SomeTextInput
     * // data.textField.borderColor = current border color of SomeTextInput
     * // data.textField.backgroundColor = current background color
     * </listing>
     */
    static backupProperties(source, map) {
        const result = Array.isArray(source) ? [] : {};
        for (const propertyName in map) {
            if (map.hasOwnProperty(propertyName) &&
                source.hasOwnProperty(propertyName)) {
                let value = map[propertyName];
                if (typeof value === 'object') {
                    result[propertyName] = UFObject.backupProperties(source[propertyName], map[propertyName]);
                }
                else {
                    result[propertyName] = source[propertyName];
                }
            }
        }
        return result;
    }
    /**
     * Copy the values of properties in aValues to properties of same name in anObject.
     *
     * If a property of aValue is an object, the function will copy all the properties in that object.
     *
     * If the value of a property of aValue is a function, the function will be called with
     * two parameters: anObject, property name. The function is responsible for assigning a value to
     * anObject.
     *
     * @param objectValue
     *   Object to update properties
     * @param values
     *   Object to get parse and obtain values from
     *
     * @return Value of anObject
     *
     * @example <caption>show error in TextInput</caption>
     * var errorProperties: Object = {
     *   textField: {
     *     borderColor: 0xFF0000,
     *     backgroundColor: 0xFFCCCC
     *   }
     * };
     * // backup current properties
     * var originalProperties: Object = UFObjectTools.backupProperties(SomeTextInput, errorProperties);
     * // show error state
     * UFObjectTools.applyProperties(SomeTextInput, errorProperties);
     * // restore original settings
     * UFObjectTools.applyProperties(SomeTextInput, originalProperties);
     */
    static applyProperties(objectValue, values) {
        for (const propertyName in values) {
            if (values.hasOwnProperty(propertyName) && objectValue.hasOwnProperty(propertyName)) {
                const value = values[propertyName];
                if (typeof value === 'function') {
                    value(objectValue, propertyName);
                }
                else if (typeof value === 'object') {
                    UFObject.applyProperties(objectValue[propertyName], values[propertyName]);
                }
                else {
                    objectValue[propertyName] = values[propertyName];
                }
            }
        }
        return objectValue;
    }
    /**
     * Copies the properties of an object. Recursively call this method for properties that are
     * object values.
     *
     * @param objectValue
     *   Object to copy
     *
     * @return copy of an object
     */
    static deepCopy(objectValue) {
        const result = {};
        Object.keys(objectValue).forEach(key => {
            const value = objectValue[key];
            result[key] = typeof value === 'object' ? this.deepCopy(value) : value;
        });
        return result;
    }
    /**
     * Checks if an object contains a certain key. It is possible to specify multiple values.
     *
     * @param objectValue
     *   An object (keys are checked)
     * @param keys
     *   One or more key names to check
     *
     * @returns True if the object has a key that matches one of the aKeys values.
     */
    static contains(objectValue, ...keys) {
        return keys.findIndex(key => objectValue.hasOwnProperty(key)) >= 0;
    }
    /**
     * Combines multiple object instances.
     *
     * The method will create a new object and copies all properties (including getters and setters)
     * from each argument to the new object.
     *
     * After processing all arguments, the method checks each argument again if it contains the
     * initialize method specified by anInitMethod.
     *
     * If aCallInit is true, the initialize method gets called using the newly created object as
     * its function scope.
     *
     * If aCallInit is false, a new initialize method is attached to the created object that will call
     * all the other initialize methods with the correct function scope.
     *
     * @param objects
     *   Object instances to combine
     * @param callInitialize
     *   When false do not call the initialize methods but create and attach a new initialize method
     *   that will call the initialize methods (if any of the other objects contains the initialize
     *   method).
     * @param initializeName
     *   The name of the initialize method to call or null to skip.
     *
     * @return An instance being a combination of all arguments
     */
    static combineObjects(objects, callInitialize = true, initializeName = '__init') {
        if (objects.length === 0) {
            return {};
        }
        // start with empty object
        const result = {};
        // get all __init methods from all objects
        const initializeFunctions = [];
        // add each argument to result
        objects.forEach(source => UFObject.copyProperties(source, result, initializeName, initializeFunctions));
        if (initializeFunctions.length) {
            UFObject.callMethods(result, initializeFunctions, callInitialize ? undefined : initializeName);
        }
        return result;
    }
    /**
     * Copies a property/method from one object to another. If the property is a getter or setter,
     * the method will redefine the property in the target object.
     *
     * @param name
     *   Name of property
     * @param source
     *   Source to copy property from
     * @param target
     *   Target to copy property to
     */
    static copyProperty(name, source, target) {
        // if there is a descriptor, and it defines a get and/or set field copy the property by
        // redefining it in the result object.
        const descriptor = Object.getOwnPropertyDescriptor(source, name);
        if (descriptor && (descriptor.get || descriptor.set)) {
            Object.defineProperty(target, name, descriptor);
        }
        else {
            // just copy field
            target[name] = source[name];
        }
    }
    /**
     * Copies all properties from one object to another object using {@link copyProperty}.
     *
     * It is possible to specify a separator name via `aSeparatorName`; in that case the property
     * of that name is not copied but is placed in the `aSeparatorList`.
     *
     * @private
     *
     * @param source
     *   Source to copy from
     * @param target
     *   Target to copy to
     * @param separatorName
     *   Optional name of property to place in aSeparatorList
     * @param separatorList
     *   Must be specified if aSeparatorName is specified.
     */
    static copyProperties(source, target, separatorName, separatorList) {
        if (separatorName && !separatorList) {
            throw new Error('Missing separator list while a separator name was specified');
        }
        // only copy properties defined within the object itself
        const names = Object.getOwnPropertyNames(source);
        names.forEach(name => {
            if (separatorName && (name === separatorName)) {
                separatorList.push(source[name]);
            }
            else {
                UFObject.copyProperty(name, source, target);
            }
        });
    }
    /**
     * Processes init methods.
     *
     * @private
     *
     * @param {object} target
     *   Object that acts as the function scope and might get an initialized function attached to it
     *   if aCallInit is false.
     * @param functions
     *   A list of functions to call using aTarget as function scope.
     * @param methodName
     *   When specified, instead of calling the functions a new method will be attached to aTarget
     *   using this name. The method will call all functions with aTarget as function scope.
     */
    static callMethods(target, functions, methodName) {
        const callFunctions = () => functions.forEach(method => method.call(target));
        if (methodName) {
            target[methodName] = callFunctions;
        }
        else {
            callFunctions();
        }
    }
    /**
     * Checks if an object is an instance of a class. If anObject is not an object, the method will
     * return false.
     *
     * The method will also return false if instanceOf fails with an exception.
     *
     * @param objectValue
     *   Object to check
     * @param classType
     *   Class to check
     *
     * @return True if anObject is an instance of aClass; in all other cases false.
     */
    static instanceOf(objectValue, classType) {
        if (typeof classType !== 'function') {
            return false;
        }
        try {
            return objectValue instanceof classType;
        }
        catch {
            return false;
        }
    }
}
// endregion

/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2022 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2022 Josha Munnik
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
// region class
/**
 * Possible angle units
 */
var UFAngleUnit;
(function (UFAngleUnit) {
    UFAngleUnit[UFAngleUnit["degrees"] = 0] = "degrees";
    UFAngleUnit[UFAngleUnit["radians"] = 1] = "radians";
})(UFAngleUnit || (UFAngleUnit = {}));
/**
 * {@link UFMath} implements methods supporting numbers.
 */
class UFMath {
    // region constructor
    /**
     * Utility class with only static methods, do not allow instances.
     *
     * @private
     */
    constructor() {
    }
    // endregion
    // region static properties
    /**
     * Determines how to treat angle parameters or which unit to use when returning angles.
     */
    static get angleUnit() {
        return UFMath.s_angleUnit;
    }
    static set angleUnit(value) {
        UFMath.s_angleUnit = value;
    }
    // endregion
    // region static methods
    /**
     * Convert angle to radians, use angleUnit to determine unit of input parameter.
     *
     * @param angle
     *   Angle to convert
     *
     * @returns Converted angle.
     */
    static toRadians(angle) {
        return (UFMath.angleUnit === UFAngleUnit.degrees) ? angle * Math.PI / 180 : angle;
    }
    /**
     * Convert angle from radians to unit as specified by m_angleUnit
     *
     * @param angle
     *   Angle to convert
     *
     * @returns Converted angle.
     */
    static fromRadians(angle) {
        return (UFMath.angleUnit === UFAngleUnit.degrees) ? angle * 180 / Math.PI : angle;
    }
    // endregion
    // region public methods
    /**
     * Rotates a 2D coordinate around a certain point.
     *
     * @param angle
     *   Angle
     * @param x
     *   X coordinate of point to rotate
     * @param y
     *   Y coordinate of point to rotate
     * @param originX
     *   X coordinate of point to rotate around
     * @param originY
     *   Y coordinate of point to rotate around
     *
     * @returns {{x,y}} An object with x and y property.
     */
    static rotate(angle, x, y, originX = 0, originY = 0) {
        angle = UFMath.toRadians(angle);
        const transX = x - originX;
        const transY = y - originY;
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        return {
            x: transX * cos - transY * sin + originX,
            y: transX * sin + transY * cos + originY
        };
    }
    /**
     * Calculates the angle between two points
     *
     * @param x1
     *  First X coordinate of point
     * @param y1
     *  First Y coordinate of point
     * @param x2
     *  Second X coordinate of point
     * @param y2
     *  Second Y coordinate of point
     *
     * @returns Angle in degrees (0..360)
     */
    static angle(x1, y1, x2, y2) {
        return UFMath.fromRadians(Math.atan2(y2 - y1, x2 - x1));
    }
    /**
     * Calculates distance between two points.
     *
     * @param x1
     *  First X coordinate of point
     * @param y1
     *  First Y coordinate of point
     * @param x2
     *  Second X coordinate of point
     * @param y2
     *  Second Y coordinate of point
     *
     * @returns Distance between two points
     */
    static distance(x1, y1, x2, y2) {
        const dX = x1 - x2;
        const dY = y1 - y2;
        return Math.sqrt(dX * dX + dY * dY);
    }
    /**
     * Returns a random integer.
     *
     * @param minOrMaxValue
     *   Minimal or maximum value (if aMax is not specified)
     * @param maxValue
     *   Maximal value
     *
     * @return {number} random integer between aMin and aMax (inclusive)
     */
    static randomInteger(minOrMaxValue, maxValue) {
        if (maxValue === undefined) {
            maxValue = minOrMaxValue;
            minOrMaxValue = 0;
        }
        return Math.floor(minOrMaxValue + Math.random() * (maxValue - minOrMaxValue + 1));
    }
    /**
     * Increases or decreases value, so it gets nearer to a target value.
     *
     * @param target
     *   Value to reach
     * @param current
     *   Current value
     * @param stepSize
     *   Value to move with
     *
     * @returns aCurrent +/- aStep or aTarget if aCurrent was closer to aTarget then aStep distance
     */
    static moveTo(target, current, stepSize) {
        return (target > current)
            ? Math.min(target, current + stepSize)
            : Math.max(target, current - stepSize);
    }
    /**
     * Calculates a position based on movement over time. The method makes sure the returned value is between the
     * specified target and starting values.
     *
     * @param target
     *   Target to move to
     * @param start
     *   Starting position moving from
     * @param currentTime
     *   Current time
     * @param totalTime
     *   Total time movement should take place
     * @returns value between aStart and aTarget (both inclusive)
     */
    static moveOverTime(target, start, currentTime, totalTime) {
        return start + (target - start) *
            Math.max(0, Math.min(currentTime, totalTime)) / totalTime;
    }
    /**
     * Makes sure a value is within a range.
     *
     * @param minValue
     *   Minimum value
     * @param maxValue
     *   Maximum value
     * @param value
     *   Value to test
     *
     * @returns aValue if it is within range or aMin or aMax
     */
    static minmax(minValue, maxValue, value) {
        return Math.max(minValue, Math.min(maxValue, value));
    }
    /**
     * Checks if two rectangles overlap.
     *
     * @param x0
     *   Left of first rectangle
     * @param y0
     *   Left of first rectangle
     * @param width0
     *   Left of first rectangle
     * @param height0
     *   Left of first rectangle
     * @param x1
     *   Left of second rectangle
     * @param y1
     *   Left of second rectangle
     * @param width1
     *   Left of second rectangle
     * @param height1
     *   Left of second rectangle
     *
     * @returns {boolean} True if two rectangles overlap
     */
    static isOverlapping(x0, y0, width0, height0, x1, y1, width1, height1) {
        // just check if minimum value in one direction is equal or larger than the maximum value in that direction
        return !((x0 >= x1 + width1) ||
            (x1 >= x0 + width0) ||
            (y0 >= y1 + height1) ||
            (y1 >= y0 + height0));
    }
    /**
     * Checks if a value is a number.
     *
     * Copy from:
     * https://github.com/ReactiveX/rxjs/blob/master/src/internal/util/isNumeric.ts
     *
     * @param value
     *   Value to check
     *
     * @returns true if value is a valid, otherwise false
     */
    static isNumeric(value) {
        // parseFloat NaNs numeric-cast false positives (null|true|false|"")
        // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
        // subtraction forces infinities to NaN
        // adding 1 corrects loss of precision from parseFloat (#15100)
        return !Array.isArray(value) && (value - parseFloat(value) + 1) >= 0;
    }
    /**
     * Checks if a value is a valid number, if not return a default value instead.
     *
     * @param value
     *   Value to check
     * @param defaultNumber
     *   Default value to use if aValue is not a valid number
     *
     * @returns either aValue as a number or aDefault
     */
    static getNumber(value, defaultNumber) {
        return this.isNumeric(value) ? value : defaultNumber;
    }
    /**
     * Performs a logical xor on two values.
     *
     * Reference: {@link http://www.howtocreate.co.uk/xor.html}
     *
     * @param value0
     *   First value
     * @param value1
     *   Second value
     * @returns `True` if either aValue0 or aValue1 evaluates to a truthy but not both;
     *   otherwise `false` if both values evaluate to a truthy or falsy.
     */
    static xor(value0, value1) {
        // use !! to make sure with two falsy values, the result is still a boolean
        return !!((value0 || value1) && !(value0 && value1));
    }
}
// endregion
// region static private variables
/**
 * See property definitions
 *
 * @private
 */
UFMath.s_angleUnit = UFAngleUnit.degrees;
// endregion

/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2022 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2022 Josha Munnik
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
// region imports
// endregion
// region class
/**
 * {@link UFText} implements methods for supporting strings and characters.
 */
class UFText {
    // region constructor
    /**
     * Utility class with only static methods, do not allow instances.
     *
     * @private
     */
    constructor() {
    }
    // endregion
    // region public methods
    /**
     * Appends a text to another text using a separator. If either texts are empty, the method
     * just returns the other text without the separator.
     *
     * @param source
     *   Source to add to
     * @param value
     *   Value to append
     * @param separator
     *   Separator to use
     *
     * @return aValue added to aSource with aSeparator if both aValue and aSource are not empty.
     */
    static append(source, value, separator) {
        if (source.length <= 0) {
            return value;
        }
        if (value.length <= 0) {
            return source;
        }
        return source + separator + value;
    }
    /**
     * Converts plain text to html by replacing certain characters with their entity equivalent and
     * replacing \n with <br/> tags.
     *
     * Based on code from answer: https://stackoverflow.com/a/4835406/968451
     *
     * @param text
     *   Text to convert
     *
     * @return Html formatted plain text
     */
    static escapeHtml(text) {
        return text.replace(/[&<>"'\n\t\r]/g, character => this.s_escapeHtmlMap.get(character));
    }
    /**
     * Escapes special characters in a string to be used in a regular expression.
     *
     * @param text
     *   Text to convert
     *
     * @return Escaped string with special characters prefixed with a backslash.
     */
    static escapeRegExp(text) {
        return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    /**
     * Generate a code existing of a random sequence of upper and lowercase and numbers.
     *
     * @param length
     *   Number of characters the code exists of
     *
     * @return The generated code.
     */
    static generateCode(length) {
        let result = '';
        let numberCount = 1;
        for (let cnt = 0; cnt < length; cnt++) {
            // 00..09: '0'..'9'
            // 10..35: 'A'..'Z'
            // 36..61: 'a'..'z'
            let charCode;
            while (true) {
                // make sure every 3rd char is a number (also to prevent offensive words)
                charCode = (numberCount > 2) ? UFMath.randomInteger(0, 9) : UFMath.randomInteger(0, 61);
                // break loop if char code is not zero or uppercase O or one and lowercase l (too similar)
                if ((charCode !== 0) && (charCode !== 24) && (charCode !== 1) && (charCode !== 47)) {
                    break;
                }
            }
            if (charCode < 10) {
                // reset number counter
                result += String.fromCharCode(charCode + 48);
                numberCount = 0;
            }
            else if (charCode < 36) {
                result += String.fromCharCode(charCode + 65 - 10);
                numberCount++;
            }
            else {
                result += String.fromCharCode(charCode + 97 - 10 - 26);
                numberCount++;
            }
        }
        return result;
    }
    /**
     * Converts a number to a string of 2 digits
     *
     * @param numberValue
     *   A number between 0 and 99
     *
     * @return aNumber as string, prefixed with a 0 if number exists of 1 digit
     *
     * @private
     */
    static twoDigits(numberValue) {
        return numberValue < 10 ? '0' + numberValue : numberValue.toString();
    }
    /**
     * Converts a number to a string of 3 digits
     *
     * @param numberValue
     *   A number between 0 and 999
     *
     * @return aNumber as string, prefixed with a 0 if number exists of 1 digit
     *
     * @private
     */
    static threeDigits(numberValue) {
        return ('000' + numberValue.toString()).substring(-3);
    }
    /**
     * Replace all keys by their value in a string.
     *
     * @param text
     *   Text to update
     * @param map
     *   Replace keys with their values
     *
     * @return Updated aText
     */
    static replace(text, map) {
        for (const [key, value] of Object.entries(map)) {
            text = text.replace(key, value);
        }
        return text;
    }
    /**
     * Returns a number converted to a hex number of two digits.
     *
     * @param numberValue
     *   Number to convert (will be clamped between 0 and 255)
     *
     * @return hexadecimal string of 2 digits
     */
    static hexTwoDigits(numberValue) {
        return ('0' + Math.min(255, Math.max(0, numberValue)).toString(16)).substring(-2);
    }
    /**
     * Returns a number converted to a hex number of four digits.
     *
     * @param numberValue
     *   Number to convert (will be clamped between 0 and 65535)
     *
     * @return hexadecimal string of 4 digits
     */
    static hexFourDigits(numberValue) {
        return ('000' + Math.min(65535, Math.max(0, numberValue)).toString(16)).substring(-4);
    }
    /**
     * Joins strings making sure there is one delimiter string between them.
     *
     * @param delimiter
     *   Delimiter to use
     * @param texts
     *   Texts to join
     *
     * @return aTexts joined together
     */
    static join(delimiter, ...texts) {
        return texts.reduce((previous, current) => {
            if (current.startsWith(delimiter)) {
                current = current.substring(delimiter.length);
            }
            if (!previous.endsWith(delimiter) && previous.length) {
                previous += delimiter;
            }
            return previous + current;
        });
    }
    /**
     * Joins strings together using '/' as a delimiter.
     *
     * @param texts
     *   Texts to join
     *
     * @return aTexts joined together
     */
    static joinPath(...texts) {
        return this.join('/', ...texts);
    }
    /**
     * Gets the text to convert a number to an English ordinal number.
     *
     * @param numberValue
     *   Number to convert.
     *
     * @return Text to add to the number.
     */
    static getOrdinalPost(numberValue) {
        switch (numberValue % 10) {
            case 1:
                return 'st';
            case 2:
                return 'nd';
            case 3:
                return 'rd';
            default:
                return 'th';
        }
    }
    /**
     * Converts a number to an English ordinal number.
     *
     * @param numberValue
     *   Number to convert.
     *
     * @return number with shortened ordinal text added to it.
     */
    static getOrdinalNumber(numberValue) {
        return numberValue.toString() + this.getOrdinalPost(numberValue);
    }
    /**
     * Gets a value as string.
     *
     * @param value
     *   Value to get
     * @param defaultText
     *   Default is used if aValue can not be converted to a string (in case of null, undefined, NaN)
     *
     * @return aValue as string (via toString() call) or aDefault.
     */
    static asString(value, defaultText = '') {
        switch (value) {
            case null:
            case undefined:
            case NaN:
                return defaultText;
            default:
                return value.toString();
        }
    }
    /**
     * Formats a file size adding unit (bytes, KB, MB or GB).
     *
     * @param size
     *   Size to format
     *
     * @returns formatted size
     */
    static formatFileSize(size) {
        let result;
        if (size < 1024) {
            result = size + ' bytes';
        }
        else if (size < 1024 * 1024) {
            result = (size / 1024).toFixed(1) + ' KB';
        }
        else if (size < 1024 * 1024 * 1024) {
            result = (size / 1024 / 1024).toFixed(1) + ' MB';
        }
        else {
            result = (size / 1024 / 1024 / 1024).toFixed(1) + ' GB';
        }
        return result;
    }
    /**
     * Gets the extension of file by returning the part after the last '.' in the name.
     *
     * @param fileName
     *   Filename to get extension of (may include path parts)
     *
     * @returns extension (without '.' and in lowercase) or false if no '.' could be
     *   located in the name.
     */
    static getFileExtension(fileName) {
        const fileStart = fileName.lastIndexOf('/');
        if (fileStart > 0) {
            fileName = fileName.substring(fileStart + 1);
        }
        const start = fileName.lastIndexOf('.');
        return start < 0 ? false : fileName.substring(start + 1).toLowerCase();
    }
    /**
     * Add a number of padding chars on the left (in front) until a string reaches a certain
     * minimal size.
     *
     * @param text
     *   Text to pad
     * @param minSize
     *   Minimal size
     * @param padChar
     *   Char to add
     *
     * @return {string} aText padded with aPadChar, if aTexts length >= aMinSize then aText
     *   is just returned
     *
     * @obsolete Use string.padStart() instead
     */
    static lpad(text, minSize, padChar = ' ') {
        while (text.length < minSize) {
            text = padChar + text;
        }
        return text;
    }
    /**
     * Add a number of padding chars on the right until a string reaches a certain minimal size.
     *
     * @param text
     *   Text to pad
     * @param minSize
     *   Minimal size
     * @param padChar
     *   Char to add
     *
     * @return {string} aText padded with aPadChar, if aTexts length >= aMinSize then aText is
     * just returned
     *
     * @obsolete Use string.padEnd() instead
     */
    static rpad(text, minSize, padChar = ' ') {
        while (text.length < minSize) {
            text = text + padChar;
        }
        return text;
    }
    /**
     * Adds a parameter to an url. The method checks if the url already contains parameters
     * (by containing a ? character). If it does the parameter is added to the end with a '&'
     * character. Else the parameter is added to the end with a '?' character.
     *
     * @param url
     *   Filename to add parameter to
     * @param parameter
     *   Parameter to add
     * @param value
     *   When specified the value to add to the parameter using '='
     *
     * @return anUrl with '?aParameter[=aValue]' or '&aParameter[=aValue]' added to it.
     */
    static addParameter(url, parameter, value) {
        if (value) {
            parameter = parameter + '=' + value;
        }
        parameter = (url.indexOf('?') >= 0 ? '&' : '?') + parameter;
        return url + parameter;
    }
    /**
     * Format a string using format specifiers and additional parameters. Next to formatting primitive
     * values the method can also format a property within an object.
     *
     * Format:
     * `%[number$][{name}][+][0|'char][-][number]\[.number]%|(name)|b|c|d|e|f|F|o|u|s|x|X`
     * - [] = optional
     * - | = choices for a single location
     *
     * Format specifiers:
     * - `number$` = use argument at index number (first argument has index 1); if the value is too
     *   high and points to a non-existing argument the method will skip this format string and leave
     *   it as is.
     * - `{name}` = show the value of a property of the specified name, the property is formatted
     *              according to the type specifier.
     * - `+` = when formatting a decimal or float prefix with a '+' if the number is positive
     *        (sign of number is always shown)
     * - `0` = use 0 as padding character (default is a space)
     * - `'char` = use char as padding character (char is a single character)
     * - `-` = instead of right justification, left justify the result when padding
     * - `number` = minimal size, add padding characters if needed
     * - `.number` = with floats this number specifies the number of decimal digits to display;
     *               else it specifies the maximum size (in characters)
     *
     * The format specification should end with a type specifier that indicates the type of the argument:
     * - `%` = no argument is used and all the formatting is ignored, a single % character is
     *         inserted (with other words, use %% inside the format string to get a single %)
     * - `(name)` = show the value of a property, treating the value as a string. Other
     *              formatting specifiers can still be used. See also comments below.
     * - `b` = the argument is treated as an unsigned integer and presented as a binary number.
     * - `c` = the argument is treated as an unsigned integer and presented as the character with
     *         that ASCII value.
     * - `d` = the argument is treated as an integer and presented as a (signed) decimal number.
     * - `e` = the argument is treated as a float and presented using scientific notation
     *         (e.g. 1.2e+2). The precision specifier stands for the number of digits after
     *         the decimal point.
     * - `u` = the argument is treated as an unsigned integer and presented as an unsigned
     *         decimal number. The plus modifier is not used.
     * - `f` = the argument is treated as a float and presented as a floating-point number.
     * - `F` = same as f (to be compatible with PHP's formatting)
     * - `o` = the argument is treated as an unsigned integer and presented as an octal number.
     * - `s` = the argument is treated as and presented as a string.
     * - `x` = the argument is treated as an unsigned integer and presented as a hexadecimal
     *         number (with lowercase letters).
     * - `X` = the argument is treated as an unsigned integer and presented as a hexadecimal
     *         number (with uppercase letters).
     *
     * The method uses a regular expression with named groups to identify the various parts. The
     * order of the format specifiers must follow the order as specified above.
     *
     * The first time a property value specification is encountered, the method will store the
     * matching argument assuming it is an object. Any property value specification after will use
     * the same object.
     *
     * To show property values of multiple objects, one can use the `number$` specifier to select
     * a certain argument. When using `number$` to select a certain object that object
     * is not stored as default object.
     *
     * To format a property value using a certain type specifier use the `{}` specifier; to show
     * the property as string one can use the `()` specifier.
     *
     * If no argument index is used and there are no more arguments to map to, the method will
     * not process the string and just keep it.
     *
     * @param format
     *   A string including format specifiers.
     * @param argumentList
     *   Various arguments to format within the string
     *
     * @return formatted string
     *
     * @example <caption>A few formatting statements</caption>
     * var pear = {color: 'brown', shape: 'pear', weight: 100 };
     * var apple = {color: 'green', shape: 'round', weight: 150 };
     *
     * console.log(UFText.sprintf('The color of an apple is %(color) and the shape is %(shape)', apple));
     * // The color of an apple is green and the shape is round
     *
     * console.log(UFText.sprintf('The color of a pear is %0$(color) and the color of an apple is %1$(color)', pear, apple));
     * // The color of a pear is brown and the color of an apple is green
     *
     * console.log(UFText.sprintf('The weight of a pear is %0${weight}.2f and the weight of an apple is %1${weight}.2f', pear, apple));
     * // The weight of a pear is 100.00 and the weight of an apple is 150.00
     *
     * console.log(UFText.sprintf('The number 12 as binary = %b', 12));
     * // The number 12 as binary = 1100
     *
     * console.log(UFText.sprintf('The number 12 as octal = %o', 12));
     * // The number 12 as octal = 14
     *
     * console.log(UFText.sprintf('The number 12 as decimal = %d', 12));
     * // The number 12 as decimal = 12
     *
     * console.log(UFText.sprintf('The number 12 as decimal with + = %+d', 12));
     * // The number 12 as decimal with + = +12
     *
     * console.log(UFText.sprintf('The number 12 as hexadecimal = %x', 12));
     * // The number 12 as hexadecimal = c
     *
     * console.log(UFText.sprintf('The number 12 as hexadecimal = %X', 12));
     * // The number 12 as hexadecimal = C
     *
     * console.log(UFText.sprintf('The number 12 as hexadecimal with padding = %04X', 12));
     * // The number 12 as hexadecimal = 000C
     *
     * console.log(UFText.sprintf('The number 12.5 as exponential = %.3e', 12.5));
     * // The number 12.5 as exponential = 1.250e+1
     *
     * console.log(UFText.sprintf('The number 12.5 as float = %.3f', 12.5));
     * // The number 12.5 as float = 12.500
     *
     * console.log(UFText.sprintf('[%8s] = default justification', 'abcd'));
     * // [    abcd] = default justification
     *
     * console.log(UFText.sprintf('[%-8s] = left justification', 'abcd'));
     * // [abcd    ] = left justification
     *
     * console.log(UFText.sprintf('[%08s] = default justification with zero padding', 'abcd'));
     * // [0000abcd] = default justification with zero padding
     *
     * // the next example uses \' to insert the - into the string
     * console.log(UFText.sprintf('[%\'-8s] = default justification with - padding', 'abcd'));
     * // [----abcd] = default justification with - padding
     *
     * console.log(UFText.sprintf('[%10s] = default justification with space padding', 'abcd'));
     * // [      abcd] = default justification with space padding
     *
     * console.log(UFText.sprintf('%%%.2f percentage', 33.5));
     * // %33.50 percentage
     */
    static sprintf(format, ...argumentList) {
        // build regular expression to find specifications, the format specifier starts with a %
        const regExpr = "%"
            // skip if there is another % (%% are handled at the end of the method)
            + "(?!%)"
            // argument index
            + "((?<param_index>\\d+)\\$)?"
            // property name (which will be followed by a type specifier)
            + "(\\{(?<prop_typed>\\w+)\\})?"
            // add plus to numbers
            + "(?<add_plus>\\+)?"
            // determine padding character (either 0 or a custom char)
            + "(?<pad_zero>0|\'(?<pad_char>.))?"
            // left justification instead of right
            + "(?<left_justify>\\-)?"
            // minimal size
            + "(?<min_size>\\d+)?"
            // maximal size or number of decimal digits
            + "(\\.(?<max_size>\\d+))?"
            // type specifier and property name to be shown as text
            + "(?<format_type>\\((?<prop_text>\\w+)\\)|[bcdefFousxX])";
        // create RegExp instance and use global search
        const testExp = new RegExp(regExpr, 'g');
        // result contains resulting string
        let result = '';
        // end of last formatting part (points to character after)
        let formatEnd = 0;
        // current index into argument
        let argumentIndex = 0;
        // object to use for properties
        let defaultObject = null;
        // replace all matches
        for (let execResult = testExp.exec(format); execResult != null; execResult = testExp.exec(format)) {
            if (!execResult.groups) {
                continue;
            }
            // add string from previous position up to current
            result = result + format.substring(formatEnd, execResult.index);
            // set to point after the found expression ([0] contains the whole regular expression string)
            formatEnd = execResult.index + execResult[0].length;
            // argument contains the value to format
            let argument = null;
            // get property name, use (name) if present ({name} will be ignored), else get {name}
            const propName = execResult.groups.prop_text
                ? execResult.groups.prop_text
                : execResult.groups.prop_typed ? execResult.groups.prop_typed : '';
            // object to get property from
            let object = null;
            // a parameter index is set?
            if (execResult.groups.param_index) {
                // get index to argument/object
                const index = Number(execResult.groups.param_index);
                if (index >= argumentList.length) {
                    // add % to result
                    result = result + '%';
                    // continue parsing with character after %
                    formatEnd = execResult.index + 1;
                    continue;
                }
                // set argument
                argument = argumentList[index];
                // also use as object to get property value from
                object = argument;
            }
            else if ((propName.length === 0) || (defaultObject == null)) {
                // no property name is specified, or there is no default object yet.
                // skip if there are no more arguments
                if (argumentIndex >= argumentList.length) {
                    // add % to result
                    result = result + '%';
                    // continue parsing with character after %
                    formatEnd = execResult.index + 1;
                    continue;
                }
                // Get argument and advance index
                argument = argumentList[argumentIndex++];
            }
            // there is a property name? Y: replace argument with value of property
            if (propName.length > 0) {
                // no parameter index was used?
                if (object == null) {
                    // yes, use defaultObject; initialize it if it is still null
                    if (defaultObject == null) {
                        defaultObject = argument;
                    }
                    object = defaultObject;
                }
                argument = object[propName];
            }
            // if there is a text property, change format_type to s to simulate a text format
            if (execResult.groups.prop_text) {
                execResult.groups.format_type = 's';
            }
            // textValue will be set to a textual representation of the value
            let textValue;
            // get min and max size (used with multiple format types)
            let min = execResult.groups.min_size ? Number(execResult.groups.min_size) : -1;
            let max = execResult.groups.max_size ? Number(execResult.groups.max_size) : -1;
            // format argument depending on type
            switch (execResult.groups.format_type) {
                case 's':
                    // get text value for special argument cases
                    switch (argument) {
                        case null:
                            textValue = 'null';
                            break;
                        case undefined:
                            textValue = 'undefined';
                            break;
                        default:
                            textValue = argument.toString();
                            break;
                    }
                    break;
                case 'c':
                    textValue = String.fromCharCode(Number(argument));
                    break;
                case 'b':
                    textValue = Number(argument).toString(2);
                    break;
                case 'x':
                    textValue = Number(argument).toString(16).toLowerCase();
                    break;
                case 'X':
                    textValue = Number(argument).toString(16).toUpperCase();
                    break;
                case 'u':
                    textValue = Number(argument).toString();
                    break;
                case 'd':
                    // int value
                    const intValue = Math.floor(Number(argument));
                    // add +?
                    textValue = ((intValue >= 0) && execResult.groups.add_plus ? execResult.groups.add_plus : '') + intValue.toString();
                    break;
                case 'o':
                    textValue = Number(argument).toString(8);
                    break;
                case 'e':
                case 'f':
                case 'F':
                    // get float value
                    const floatValue = Number(argument);
                    // add +?
                    textValue = (floatValue >= 0) && execResult.groups.add_plus
                        ? execResult.groups.add_plus : '';
                    // default to 6 if no max is specified
                    if (max < 0) {
                        max = 6;
                    }
                    // add formatted
                    textValue = textValue + ((execResult.groups.format_type === 'e') ?
                        floatValue.toExponential(max) : floatValue.toFixed(max));
                    // no cut off
                    max = -1;
                    break;
                default:
                    throw new Error('Unknown format specifier "' + execResult.groups.format_type + '"');
            }
            // pad to reach min size
            if (min >= 0) {
                // select correct pad char
                const padChar = execResult.groups.pad_char ?
                    execResult.groups.pad_char : (execResult.groups.pad_zero ? '0' : ' ');
                // add padding
                textValue = execResult.groups.left_justify ?
                    UFText.rpad(textValue, min, padChar) : UFText.lpad(textValue, min, padChar);
            }
            // keep within certain size?
            if (max >= 0) {
                textValue = textValue.substring(0, max);
            }
            // add formatted value to result
            result = result + textValue;
        }
        // add last part
        result = result + format.substring(formatEnd);
        // replace all %% with a single %
        result = result.replace(/%%/g, '%');
        // return formatted string
        return result;
    }
    /**
     * This method performs: `console.log(UFStringTools.sprintf(aFormat, ...));`.
     *
     * @param format
     *   String to format
     * @param argumentList
     *   Various parameters to format within the string
     */
    static printf(format, ...argumentList) {
        console.log(UFText.sprintf.apply(null, arguments));
    }
    /**
     * Parses a CSV string into an array of rows, where each row is an array of cell values.
     * The method handles quoted values, escaped quotes, and different line endings. The delimiter can
     * be specified, default is a comma.
     *
     * @param csvText
     *   String to parse as CSV
     * @param delimiter
     *   Delimiter to use (default is a comma)
     *
     * @return an array of rows, where each row is an array of cell values.
     */
    static parseCSV(csvText, delimiter = ',') {
        const rows = [];
        let row = [];
        let current = '';
        let inQuotes = false;
        for (let index = 0; index < csvText.length; index++) {
            const currentCharacter = csvText[index];
            const nextCharacter = index < csvText.length - 2 ? csvText[index + 1] : '';
            if (currentCharacter === '"') {
                if (inQuotes && (nextCharacter === '"')) { // escaped quote
                    current += '"';
                    index++;
                }
                else {
                    // enter/exit quotes
                    inQuotes = !inQuotes;
                }
            }
            else if ((currentCharacter === delimiter) && !inQuotes) {
                row.push(current);
                current = '';
            }
            else if (((currentCharacter === '\n') || (currentCharacter === '\r')) && !inQuotes) {
                // skip the next character if it's a part of Windows-style line ending
                if ((currentCharacter === '\r') && (nextCharacter === '\n')) {
                    index++;
                }
                row.push(current);
                rows.push(row);
                row = [];
                current = '';
            }
            else {
                current += currentCharacter;
            }
        }
        return rows;
    }
}
// endregion
// region private vars
/**
 * Maps certain characters to their entity or special html tag or empty string if it has no
 * use in html
 *
 * @private
 */
UFText.s_escapeHtmlMap = new Map([
    ['&', '&amp;'],
    ['<', '&lt;'],
    ['>', '&gt;'],
    ['"', '&quot;'],
    ["'", '&#039;'],
    ['\n', '<br/>'],
    ['\t', ''],
    ['\r', '']
]);
// endregion

/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2024 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2024 Josha Munnik
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
// region private functions
// endregion
// region types
/**
 * The different service provider types.
 */
var ServiceProviderType;
(function (ServiceProviderType) {
    ServiceProviderType[ServiceProviderType["Factory"] = 0] = "Factory";
    ServiceProviderType[ServiceProviderType["Constructor"] = 1] = "Constructor";
    ServiceProviderType[ServiceProviderType["Static"] = 2] = "Static";
    ServiceProviderType[ServiceProviderType["SingletonFactory"] = 3] = "SingletonFactory";
    ServiceProviderType[ServiceProviderType["SingletonConstructor"] = 4] = "SingletonConstructor";
})(ServiceProviderType || (ServiceProviderType = {}));
// endregion

// region imports
// endregion
// region local constants
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
// endregion
// region export
/**
 * IO support methods
 */
class Tools {
    /**
     * Loads a CSV file from the specified URL and parses it into an array of rows, where each row is
     * an array of cell values.
     *
     * @param url
     *
     * @returns A promise that resolves to a 2D array of strings representing the CSV data.
     */
    static async loadCSV(url) {
        const response = await fetch(url);
        if (!response.ok)
            throw new Error(`Failed to load CSV: ${response.status}`);
        const text = await response.text();
        return UFText.parseCSV(text);
    }
    /**
     * Calculates the number of full days between two dates, ignoring time components.
     * The result is always non-negative, regardless of the order of the input dates.
     *
     * @param first
     * @param second
     *
     * @return The number of full days between the two dates.
     */
    static daysBetween(first, second) {
        const utcFirst = Date.UTC(first.getFullYear(), first.getMonth(), first.getDate());
        const utcSecond = Date.UTC(second.getFullYear(), second.getMonth(), second.getDate());
        return Math.abs(Math.floor((utcSecond - utcFirst) / MILLISECONDS_PER_DAY));
    }
    /**
     * Checks if the browser supports the Web Speech API for speech recognition.
     *
     * @returns `true` if speech recognition is supported, otherwise `false`.
     */
    static hasSpeechRecognitionSupport() {
        return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    }
}
// endregion

class Text {
    static normalizeName(input) {
        return input.trim().toLowerCase();
    }
    static normalizeForComparison(input) {
        return input.trim().toLowerCase().replaceAll(' ', '');
    }
    static suffixWithOrdinal(number) {
        const suffixes = ['th', 'st', 'nd', 'rd'];
        const remainder100 = number % 100;
        return number + (suffixes[(remainder100 - 20) % 10] || suffixes[remainder100] || suffixes[0]);
    }
    static formatDate(date) {
        const day = Text.suffixWithOrdinal(date.getDate());
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `${month} ${day}, ${year}`;
    }
    static formatDateWithTime(date) {
        const day = Text.suffixWithOrdinal(date.getDate());
        const month = date.toLocaleString('default', { month: 'long' });
        //const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${month} ${day}, ${hours}:${minutes}`;
    }
}

class FoodEntry {
    // region private variables
    m_name;
    m_category;
    m_synonyms;
    // endregion
    // region public methods
    constructor(row) {
        this.m_name = Text.normalizeName(row[0]);
        this.m_category = Text.normalizeName(row[1]);
        this.m_synonyms = (row.length > 2 ? row[2] : '')
            // split on one or more non-letter non-space chars
            .split(/[^\p{L} ]+/u)
            .map(synonym => Text.normalizeName(synonym))
            // filter out empty strings
            .filter(Boolean);
    }
    // endregion
    // region public properties
    get name() {
        return this.m_name;
    }
    get category() {
        return this.m_category;
    }
    get synonyms() {
        return this.m_synonyms;
    }
}

// region imports
// endregion
// region exports
/**
 * Represents a compare entry that contains the original value, the normalized value for comparison,
 * and the associated food entry.
 *
 * The original value can be the name of the food or one of its synonyms.
 */
class CompareEntry {
    // region private variables
    m_normalized;
    m_original;
    m_food;
    // endregion
    // region public methods
    constructor(original, food) {
        this.m_original = Text.normalizeName(original);
        this.m_normalized = Text.normalizeForComparison(original);
        this.m_food = food;
    }
    // endregion
    // region public properties
    get normalized() {
        return this.m_normalized;
    }
    get original() {
        return this.m_original;
    }
    get food() {
        return this.m_food;
    }
}
// endregion

// region imports
// endregion
// region local types
class FoodData {
    // region private variables
    /**
     * The list of food entries loaded from the input data.
     */
    m_foodEntries = [];
    /**
     * Compare items sorted by normalized name length in descending order
     */
    m_compareItemsByLength = [];
    /**
     * Compare items sorted by original name in ascending order.
     */
    m_compareItemsByOriginal = [];
    // endregion
    // region public methods
    constructor() {
    }
    import(rows) {
        this.processRows(rows);
        this.buildCompareItems();
        this.sortCompareItems();
    }
    /**
     * Finds a food entry by its original name.
     *
     * @param name
     *
     * @return The food entry with the given name, or null if no such food entry exists.
     */
    findForName(name) {
        return this.m_foodEntries.find(entry => entry.name === name) || null;
    }
    /**
     * Returns the list of compare items sorted by original value.
     */
    getList() {
        return this.m_compareItemsByOriginal;
    }
    /**
     * Processes the input text and return all compare items that match any of the
     * compare original values found in the input text.
     *
     * @param text
     *
     * @return A list of compare items that match any of the original values found in the input text.
     */
    processText(text) {
        const result = [];
        let normalizedText = Text.normalizeForComparison(text);
        this.m_compareItemsByLength.forEach(compareItem => {
            if (normalizedText.includes(compareItem.normalized)) {
                result.push(compareItem);
                normalizedText = normalizedText.replaceAll(compareItem.normalized, '');
            }
        });
        return result;
    }
    // endregion
    // region private methods
    processRows(rows) {
        this.m_foodEntries = [];
        rows.forEach((row) => {
            if (row.length > 1) {
                const name = Text.normalizeName(row[0]);
                if (this.hasFood(name)) {
                    console.warn(`Duplicate food name "${name}" found, skipping row: ${row}`);
                }
                this.m_foodEntries.push(new FoodEntry(row));
            }
            else {
                console.warn(`Skipping row with insufficient columns: ${row}`);
            }
        });
        console.debug(`Processed ${this.m_foodEntries.length} foods from ${rows.length} rows`);
    }
    buildCompareItems() {
        this.m_compareItemsByLength = [];
        this.m_foodEntries.forEach(food => this.addFoodToCompareItems(food));
        this.m_compareItemsByOriginal = [...this.m_compareItemsByLength];
    }
    addFoodToCompareItems(food) {
        this.m_compareItemsByLength.push(new CompareEntry(food.name, food));
        food.synonyms.forEach(synonym => this.m_compareItemsByLength.push(new CompareEntry(synonym, food)));
    }
    hasFood(name) {
        return this.m_foodEntries.some(food => food.name === name);
    }
    sortCompareItems() {
        // sort by normalized name length in descending order to ensure that longer names are
        // matched first
        this.m_compareItemsByLength.sort((first, second) => second.normalized.length - first.normalized.length);
        // sort by original name in ascending order
        this.m_compareItemsByOriginal.sort((first, second) => first.original.localeCompare(second.original));
    }
}
// endregion
// region exports
const foodData = new FoodData();
// endregion

// region imports
// endregion
// region exports
class HistoryEntry {
    // region private variables
    m_food;
    m_consumedName;
    m_date;
    // endregion
    // region public methods
    /**
     * Creates a new history entry from the given compare entry. The date of the history entry is set
     * to the current date and time.
     *
     * @param compareEntry
     *
     * @return A new history entry with the food and original name from the compare entry,
     *   and the current date.
     */
    static createFromInput(compareEntry) {
        return new HistoryEntry(compareEntry.food, compareEntry.original, new Date());
    }
    /**
     * Creates a new history entry from the given storage data string. The storage data string should
     * be a JSON string that contains the food name, the consumed name, and the date in ISO format.
     * The food entry is looked up from the food data using the food name. If the food entry is
     * not found, an error is thrown. The date is parsed from the ISO string.
     *
     * @param data
     *
     * @return A new history entry with the food, consumed name, and date from the storage data.
     */
    static createFromStorage(data) {
        const storageData = JSON.parse(data);
        const food = foodData.findForName(storageData.foodName);
        if (food == null) {
            throw new Error(`Food with name "${storageData.foodName}" not found in food data.`);
        }
        return new HistoryEntry(food, storageData.consumedName, new Date(storageData.date));
    }
    /**
     * Converts this history entry to a JSON string that can be stored in local storage.
     * The JSON string contains the food name, the consumed name, and the date in ISO format.
     *
     * Use {@link createFromStorage} to convert the JSON string back to a history entry.
     *
     * @return A JSON string representation of this history entry that can be stored in local storage.
     */
    toJson() {
        const data = {
            foodName: this.m_food.name,
            consumedName: this.m_consumedName,
            date: this.m_date.toISOString()
        };
        return JSON.stringify(data);
    }
    // endregion
    // region public properties
    get food() {
        return this.m_food;
    }
    get consumedName() {
        return this.m_consumedName;
    }
    get date() {
        return this.m_date;
    }
    // endregion
    // region private methods
    /**
     * Creates a new history entry with the given food consumed name, and date. This constructor
     * is private because history entries should only be created using the static factory methods
     * {@link createFromInput} and {@link createFromStorage}.
     *
     * @param food
     * @param consumedName
     * @param date
     *
     * @private
     */
    constructor(food, consumedName, date) {
        this.m_consumedName = consumedName;
        this.m_date = date;
        this.m_food = food;
    }
}
// endregion

// region imports
// endregion
// region exports
class WeekEntry {
    // region private variables
    m_startDate;
    m_endDate;
    m_foods;
    // endregion
    // region public methods
    constructor(startDate, endDate, foods) {
        this.m_startDate = startDate;
        this.m_endDate = endDate;
        this.m_foods = [...foods];
        this.m_foods.sort((first, second) => first.name.localeCompare(second.name));
    }
    // endregion
    // region public properties
    get startDate() {
        return this.m_startDate;
    }
    get endDate() {
        return this.m_endDate;
    }
    /**
     * All foods consumed in the week, sorted by name.
     */
    get foods() {
        return this.m_foods;
    }
}
// endregion

// region local constants
const START_DAY_OF_WEEK_STORAGE_KEY = 'startDayOfWeek';
// region local types
class Settings {
    // region private variables
    m_startDayOfWeek;
    // endregion
    // region public methods
    constructor() {
        this.m_startDayOfWeek = parseInt(localStorage.getItem(START_DAY_OF_WEEK_STORAGE_KEY) || '0');
    }
    // endregion
    // region public properties
    get startDayOfWeek() {
        return this.m_startDayOfWeek;
    }
    set startDayOfWeek(value) {
        this.m_startDayOfWeek = value;
        localStorage.setItem(START_DAY_OF_WEEK_STORAGE_KEY, value.toString());
    }
}
// region exports
const settings = new Settings();
// endregion

// region local constants
const STORAGE_KEY = 'historyData';
// endregion
// region local type
class HistoryData {
    // region private variables
    m_historyEntries = [];
    // endregion
    // region public methods
    /**
     * Initializes the history data by loading the history entries from local storage and
     * sorting them.
     * Make sure the {@link foodData} is initialized before calling this method.
     */
    initialize() {
        this.m_historyEntries = this.loadFromStorage();
        this.sortEntries();
    }
    /**
     * Adds the given compare entries to the history. This method will also save the updated history
     * and resort the history entries.
     *
     * @param entries
     */
    add(entries) {
        entries.forEach(entry => this.m_historyEntries.push(HistoryEntry.createFromInput(entry)));
        this.sortEntries();
        this.saveToStorage(this.m_historyEntries);
    }
    /**
     * Gets the week entry for the current week.
     *
     * @return The week entry for the current week.
     */
    getCountForToday() {
        return this.getWeekEntryForDate(new Date());
    }
    /**
     * Gets all week entries for the stored history entries.
     *
     * @return The week entries sorted in descending order.
     */
    getCountsPerWeek() {
        if (this.m_historyEntries.length === 0) {
            return [];
        }
        // get the oldest date
        const lastDate = this.m_historyEntries.at(-1).date;
        const result = [];
        // go back week by week until the oldest date is reached, and get the count for each week
        for (let endDate = this.endOfWeek(new Date()); endDate >= lastDate; endDate.setDate(endDate.getDate() - 7)) {
            result.push(this.getWeekEntryForDate(endDate));
        }
        return result;
    }
    /**
     * Gets the history entries for the given week entry.
     *
     * @param weekEntry
     */
    getListForWeek(weekEntry) {
        return this.m_historyEntries.filter(entry => entry.date >= weekEntry.startDate && entry.date <= weekEntry.endDate);
    }
    /**
     * Clears the history by removing all history entries and saving the empty history to local
     * storage.
     */
    clear() {
        this.m_historyEntries = [];
        this.saveToStorage(this.m_historyEntries);
    }
    // endregion
    // region private methods
    /**
     * Loads the history entries from local storage.
     *
     * @return The history entries loaded from local storage.
     */
    loadFromStorage() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return [];
        }
        const texts = JSON.parse(raw);
        return texts.map(text => HistoryEntry.createFromStorage(text));
    }
    /**
     * Saves the given history entries to local storage.
     *
     * @param entries
     */
    saveToStorage(entries) {
        const texts = entries.map(entry => entry.toJson());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(texts));
    }
    /**
     * Sorts the history entries in descending order by date (most recent first).
     */
    sortEntries() {
        this.m_historyEntries.sort((first, second) => second.date.getTime() - first.date.getTime());
    }
    /**
     * Returns the start date of the week for the given input date and the first day of the week.
     *
     * @param inputDate
     *
     * @return The start date of the week, the time is set to 00:00:00.
     */
    startOfWeek(inputDate) {
        const date = new Date(inputDate);
        const firstDay = settings.startDayOfWeek;
        const dayDifference = (date.getDay() - firstDay + 7) % 7;
        const result = new Date(date);
        result.setDate(date.getDate() - dayDifference);
        result.setHours(0, 0, 0, 0);
        return result;
    }
    /**
     * Returns the end date of the week.
     *
     * @param inputDate
     *
     * @return The end date of the week, the time is set to 23:59:59.
     */
    endOfWeek(inputDate) {
        const result = this.startOfWeek(inputDate);
        result.setDate(result.getDate() + 6);
        result.setHours(23, 59, 59, 999);
        return result;
    }
    /**
     * Gets the week entry for a certain date.
     *
     * @param date
     *
     * @return The week entry for the given date.
     */
    getWeekEntryForDate(date) {
        const startDate = this.startOfWeek(date);
        const endDate = this.endOfWeek(startDate);
        const foods = new Set();
        this.m_historyEntries
            .filter(entry => (entry.date >= startDate) && (entry.date <= endDate))
            .forEach(entry => foods.add(entry.food));
        return new WeekEntry(startDate, endDate, foods);
    }
}
// endregion
// region exports
const historyData = new HistoryData();
// endregion

// region local constants
const PAGE_HIDE_CLASS = 'tp-page--is-hidden';
// endregion
// region exports
class PageBase {
    // region private variables
    m_id;
    m_title;
    m_pageElement;
    // endregion
    // region public methods
    constructor(id, title) {
        this.m_id = id;
        this.m_title = title;
        this.m_pageElement = document.getElementById(id);
    }
    getPreviousPage() {
        return null;
    }
    show() {
        this.onShowStart();
        this.m_pageElement.classList.remove(PAGE_HIDE_CLASS);
        document.title = `20 foods | ${this.m_title}`;
        this.onShowDone();
    }
    hide() {
        this.onHideStart();
        this.m_pageElement.classList.add(PAGE_HIDE_CLASS);
        this.onHideDone();
    }
    // region public methods
    /**
     * Scrolls the page to the top.
     */
    scrollToTop() {
        window.scrollTo(0, 0);
    }
    // endregion
    // region protected methods
    /**
     * Called when the page starts to show. The page is not yet visible at this point.
     *
     * The default implementation does nothing. Override this method to add custom behavior.
     *
     * @protected
     */
    onShowStart() {
    }
    /**
     * Called when the page has finished showing. The page is visible at this point.
     *
     * The default implementation does nothing. Override this method to add custom behavior.
     *
     * @protected
     */
    onShowDone() {
    }
    /**
     * Called when the page starts to hide. The page is still visible at this point.
     *
     * The default implementation does nothing. Override this method to add custom behavior.
     *
     * @protected
     */
    onHideStart() {
    }
    /**
     * Called when the page has finished hiding. The page is not visible at this point.
     *
     * The default implementation does nothing. Override this method to add custom behavior.
     *
     * @protected
     */
    onHideDone() {
    }
}
// endregion

class LoadingPage extends PageBase {
    // region public methods
    constructor() {
        super('loading-page', 'loading');
    }
}
const loadingPage = new LoadingPage();

/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2024 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2024 Josha Munnik
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
// region imports
// endregion
// region constants and types
/**
 * Name of property to store the display value of an element before it was hidden.
 */
const DisplayBackupProperty = 'ufDisplayBackup';
// endregion
// region exports
/**
 * {@link UFHtml} implements methods for supporting html and the dom.
 */
class UFHtml {
    // region constructor
    /**
     * Utility class with only static methods, do not allow instances.
     *
     * @private
     */
    constructor() {
    }
    // endregion
    // region public methods
    /**
     * Converts plain text to html by replacing certain characters with their entity equivalent and
     * replacing \n with <br/> tags.
     *
     * Based on code from answer: https://stackoverflow.com/a/4835406/968451
     *
     * @param text
     *   Text to convert
     *
     * @returns Html formatted plain text
     */
    static escapeHtml(text) {
        return text.replace(/[&<>"'\n\t\r]/g, character => this.s_escapeHtmlMap.get(character));
    }
    /**
     * Converts a html formatted text to a plain text.
     *
     * Based on code from:
     * https://javascript.plainenglish.io/3-ways-to-convert-html-text-to-plain-text-strip-off-the-tags-from-the-string-4c947feb8a8c
     *
     * @param htmlText
     *   Html text to format
     *
     * @returns plain version of the text
     */
    static convertToPlain(htmlText) {
        // Create a new div element
        const tempDivElement = document.createElement("div");
        // Set the HTML content with the given value
        tempDivElement.innerHTML = htmlText;
        // Retrieve the text property of the element
        return tempDivElement.textContent || tempDivElement.innerText || "";
    }
    /**
     * Adds css classes in a single string to an element.
     *
     * @param element
     *   Element to add the classes to; can be null, in that case nothing happens.
     * @param classes
     *   Css classes separated by a space character; can be null, in that case nothing happens.
     */
    static addClasses(element, classes) {
        if (!element || !classes) {
            return;
        }
        classes.split(' ').forEach(aClass => element.classList.add(aClass.trim()));
    }
    /**
     * Removes css classes in a single string from an element.
     *
     * @param element
     *   Element to remove the classes from; can be null, in that case nothing happens.
     * @param classes
     *   Css classes separated by a space character; can be null, in that case nothing happens.
     */
    static removeClasses(element, classes) {
        if (!element || !classes) {
            return;
        }
        classes.split(' ').forEach(aClass => element.classList.remove(aClass.trim()));
    }
    /**
     * Toggle css classes in a single string in an element.
     *
     * @param element
     *   Element to add to or remove from the classes; can be null, in that case nothing happens.
     * @param classes
     *   Css classes separated by a space character; can be null, in that case nothing happens.
     * @param force
     *   If true the classes are added, if false the classes are removed, if not set the classes are
     *   toggled.
     */
    static toggleClasses(element, classes, force) {
        if (!element || !classes) {
            return;
        }
        classes.split(' ').forEach(aClass => element.classList.toggle(aClass.trim(), force));
    }
    /**
     * Combines {@link UFHtml.addClasses} and {@link UFHtml.removeClasses}.
     *
     * @param element
     *   Element to add and remove the classes to and from; can be null, in that case nothing happens.
     * @param addClasses
     *   Css classes separated by a space character; can be null, in that case no classes are added.
     * @param removeClasses
     *   Css classes separated by a space character; can be null, in that case no classes are removed.
     */
    static addAndRemoveClasses(element, addClasses, removeClasses) {
        this.addClasses(element, addClasses);
        this.removeClasses(element, removeClasses);
    }
    /**
     * Adds a listener for one or more events. The function returns a callback, which can be called to
     * remove the listener.
     *
     * @param element
     *   Element to add listener to or selector for the element
     * @param events
     *   One or more events to add listener for (separated by space)
     * @param listener
     *   Listener callback
     *
     * @returns a function that can be called to remove the listener from the element for the events.
     */
    static addListener(element, events, listener) {
        const targetElement = typeof element === 'string' ? document.querySelector(element) : element;
        if (targetElement == null) {
            return () => {
            };
        }
        const eventsList = events.split(' ').filter(event => event.trim().length > 0);
        eventsList.forEach(event => targetElement.addEventListener(event, listener));
        return () => {
            eventsList.forEach(event => targetElement.removeEventListener(event, listener));
        };
    }
    /**
     * Adds a listener to the body element for one or more events. If the target or any of the parents
     * of the target matches the selector, the listener is called.
     * The function returns a callback, which can be called to remove the listener.
     * This method can be used to handle events fired by elements that are dynamically added at a
     * later time.
     *
     * @param selector
     *   Selector the target must match.
     * @param events
     *   One or more events to add listener for (separated by space)
     * @param handlerFactory
     *   A factory function that creates a handler callback for the element. Note that this function
     *   is called everytime an event is fired. The function should take as little time as possible.
     *
     * @returns a function that can be called to remove the listener from the body.
     */
    static addBodyListener(selector, events, handlerFactory) {
        const eventsList = events.split(' ').filter(event => event.trim().length > 0);
        const listener = (event) => {
            // make sure the target is a html element
            if ((event.target == null) || !(event.target instanceof HTMLElement)) {
                return;
            }
            // either use the target or get the first parent that matches the selector
            const target = event.target.closest(selector);
            // exit if no valid target could be found
            if (!target) {
                return;
            }
            // call event handler
            const tempListener = handlerFactory(target);
            if (tempListener instanceof Function) {
                tempListener(event);
            }
            else if ('handleEvent' in tempListener) {
                tempListener.handleEvent(event);
            }
        };
        eventsList.forEach(event => document.body.addEventListener(event, listener, true));
        return () => eventsList.forEach(event => document.body.removeEventListener(event, listener, true));
    }
    /**
     * Adds a listener for one or more events to an element or a list of elements. The function
     * returns a callback, which can be called to remove all the listener.
     *
     * @param selector
     *   Selector for the element(s) or a list of elements.
     * @param events
     *   One or more events to add listener for (separated by space).
     * @param handlerFactory
     *   A factory function that creates a handler callback for the element.
     *
     * @returns a function that can be called to remove all the added listener from the elements for
     *   the events.
     *
     * @example
     * // without event
     * const removeListeners = UFHtml.addListeners(
     *   '.some-button',
     *   'click touchstart',
     *   (element) => () => {
     *     // do something with element
     *   }
     * );
     *
     * @example
     * // with event
     * const removeListeners = UFHtml.addListeners(
     *   '.some-button',
     *   'click touchstart',
     *   (element) => (event) => {
     *     // do something with element and event
     *   }
     * );
     */
    static addListeners(selector, events, handlerFactory) {
        const elements = typeof selector === 'string'
            ? document.querySelectorAll(selector)
            : selector;
        const callbacks = [];
        elements.forEach(element => callbacks.push(UFHtml.addListener(element, events, handlerFactory(element))));
        return () => callbacks.forEach(callback => callback());
    }
    /**
     * Gets the value of an attribute.
     *
     * @param element
     *   Element to get attribute from
     * @param name
     *   Name of attribute
     * @param defaultValue
     *   Default value to return if no value could be determined (default = '')
     *
     * @returns the value of the attribute or `aDefault` if there is no value.
     */
    static getAttribute(element, name, defaultValue = '') {
        return element.attributes.getNamedItem(name)?.value ?? defaultValue;
    }
    /**
     * Checks if an element has an attribute.
     *
     * @param element
     *   Element to check attribute for
     * @param name
     *   Name of attribute
     *
     * @returns `true` if the element has the attribute, `false` if not.
     */
    static hasAttribute(element, name) {
        return element.attributes.getNamedItem(name) != null;
    }
    /**
     * Gets an element for a selector. If the selector is an element, it just returns the element.
     *
     * If the selector is a string, it will try to find the element in the document or container.
     *
     * If no element can be found or the selector is a null value, the method will throw an error.
     *
     * @param selector
     *   Element, selector text or null
     * @param container
     *   Container to search the element in; if not set, the document is used.
     *
     * @returns found element
     *
     * @throws Error if no element can be found
     */
    static get(selector, container) {
        const element = typeof (selector) === 'string'
            ? (container || document).querySelector(selector)
            : selector;
        if (element == null) {
            throw new Error(`Can not find element for ${selector}`);
        }
        return element;
    }
    /**
     * Gets an element for a dom ID and typecast it to a certain type.
     *
     * If no element can be found, the method will throw an error.
     *
     * @param id
     *   The dom id of element
     *
     * @returns found element
     *
     * @throws Error if no element can be found
     */
    static getForId(id) {
        const element = document.getElementById(id);
        if (element == null) {
            throw new Error(`Can not find element for ${id}`);
        }
        return element;
    }
    /**
     * Fades in an element by setting the styles opacity and transition.
     *
     * @param element
     *   Element to fade in
     * @param duration
     *   Duration in millisecond for the fade in transition (default = 400)
     */
    static fadeIn(element, duration = 400) {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms`;
        setTimeout(() => element.style.opacity = '1', 0);
    }
    /**
     * Fades out an element by setting the styles opacity and transition.
     *
     * @param element
     *   Element to fade out
     * @param duration
     *   Duration in millisecond for the fade in transition (default = 400)
     */
    static fadeOut(element, duration = 400) {
        element.style.opacity = '1';
        element.style.transition = `opacity ${duration}ms`;
        setTimeout(() => element.style.opacity = '0', 0);
    }
    /**
     * Creates an element by parsing a piece of html.
     *
     * @param html
     *   Html to parse
     *
     * @returns created element; the element is removed from the document before it is returned.
     */
    static createAs(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const result = doc.body.firstChild;
        result.remove();
        return result;
    }
    /**
     * Removes all child elements from an element.
     *
     * @param element
     *   Element to remove all children of.
     */
    static empty(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }
    /**
     * Gets the first parent element of the element that matches the selector.
     *
     * @param element
     *   Element to get the parent (or grandparent or great-grandparent) of
     * @param selector
     *  Selector to filter the parent with
     *
     * @returns the parent element that matches the selector or null if no parent could be found
     *
     * @deprecated Use built-in `Element.closest()` instead
     */
    static getFirstParent(element, selector) {
        for (let parent = element.parentElement; parent; parent = parent.parentElement) {
            if (parent.matches(selector)) {
                return parent;
            }
        }
        return null;
    }
    /**
     * Gets all parents of an element.
     *
     * @param element
     *   Element to get all parents for
     * @param selector
     *   Optional selector to filter the parents with
     *
     * @returns all parent elements of the element (parent, grandparent, great-grandparent, etc.)
     */
    static getParents(element, selector) {
        const parents = [];
        for (let parent = element.parentElement; parent; parent = parent.parentElement) {
            if (!selector || parent.matches(selector)) {
                parents.push(parent);
            }
        }
        return parents;
    }
    /**
     * Shows a element by updating the `display` style property.
     *
     * @param element
     *   Element to show
     * @param display
     *   When set use this value, else use the initial value which was copied with {@link hide}. If
     *   there is no initial value, use 'block'.
     */
    static show(element, display) {
        element.style.display = display ??
            UFObject.getAttachedAs(element, DisplayBackupProperty, () => 'block');
    }
    /**
     * Hides an element by updating the `display` style property. The current value is stored in the
     * element and is used by {@link show}. Then the value 'none' is assigned to `display` style.
     *
     * @param element
     *   Element to hide
     */
    static hide(element) {
        UFObject.getAttachedAs(element, DisplayBackupProperty, () => element.style.display);
        element.style.display = 'none';
    }
    /**
     * Copies one or more attribute values to elements. Depending on the type of the element the value
     * gets handled as follows:
     * - `input`:  the `checked` or `value` property is set (depending on the `type`).
     * - `textarea`:  the `value` property is set.
     * - `select`: the `value` property is set.
     * - `img`: the `src` property is set.
     * - any other element: the inner text of the element is set.
     *
     * @param element
     *   Element to get the attributes from
     * @param map
     *   The field names are used as attribute names and the values are used as selectors for the
     *   target elements. If the selector points to multiple elements, each element will get the
     *   attribute value.
     * @param container
     *   Container to search the target elements in; if not set, the `document` is used.
     */
    static copyAttributes(element, map, container) {
        const targetContainer = container || document;
        for (const key in map) {
            const data = element.getAttribute(key);
            if (data === null) {
                continue;
            }
            const targets = targetContainer.querySelectorAll(map[key]);
            if (!targets) {
                continue;
            }
            targets.forEach(target => {
                if (this.assignValue(target, data)) {
                    return;
                }
                if (target instanceof HTMLImageElement) {
                    target.src = data;
                }
                else if (target instanceof HTMLElement) {
                    target.innerText = data;
                }
            });
        }
    }
    /**
     * Gets all attribute names of an element.
     *
     * @param element
     *   Element to get the attribute names from
     *
     * @returns all the names of attributes defined at the element
     */
    static getAttributeNames(element) {
        const result = [];
        for (let index = 0; index < element.attributes.length; index++) {
            const attribute = element.attributes[index];
            result.push(attribute.name);
        }
        return result;
    }
    /**
     * Builds a map of data attributes from the element. The method will skip data attributes that
     * start with 'data-uf-'.
     *
     * The result can be used with {@link UFHtml.copyAttributes}.
     *
     * @param element
     *   Element to get data attributes from.
     *
     * @returns an object where the keys are the attribute names and the values are the attribute
     *   enclosed by square brackets.
     *
     * @example
     * // <button id="foobar" data-foo data-bar></button>
     * const element = document.getElementById('foobar');
     * const map = UFHtml.buildDataAttributesMap(element);
     * // map is { 'data-foo': '[data-foo]', 'data-bar': '[data-bar]' }
     */
    static buildDataAttributesMap(element) {
        const map = {};
        for (let index = 0; index < element.attributes.length; index++) {
            const name = element.attributes[index].name;
            if (name.startsWith('data-uf-')) {
                continue;
            }
            if (name.startsWith('data-')) {
                map[name] = `[${name}]`;
            }
        }
        return map;
    }
    /**
     * Reloads the current page. It removes the current page from the history and then reloads the
     * page. Any post data is no longer used and the page with the post data is no longer in the
     * history.
     *
     * Source: https://stackoverflow.com/a/570069/968451
     */
    static reload() {
        if (window.history.replaceState) {
            window.history.replaceState(null, '', window.location.href);
        }
        // noinspection SillyAssignmentJS
        window.location.href = window.location.href;
    }
    /**
     * Assigns a value to a form field element and triggers the `"input"` and `"change"` events.
     *
     * With checkbox/radio elements the following values will set the checked state to true:
     * 'true', '1', 'checked'. Any other value will set the checked state to false.
     *
     * If the element is not a form field element, nothing happens.
     *
     * @param element
     *   Element to assign to
     * @param value
     *   Value to assign
     *
     * @returns `true` if the value could be assigned, `false` if the element is not a form field.
     */
    static assignValue(element, value) {
        if (element instanceof HTMLInputElement) {
            if ((element.type === 'checkbox') || (element.type === 'radio')) {
                element.checked = (value === 'true') || (value === '1') || (value === 'checked');
            }
            else {
                element.value = value;
                element.dispatchEvent(new InputEvent('input'));
            }
        }
        else if (element instanceof HTMLTextAreaElement) {
            element.value = value;
            element.dispatchEvent(new InputEvent('input'));
        }
        else if (element instanceof HTMLSelectElement) {
            element.value = value;
        }
        else {
            return false;
        }
        element.dispatchEvent(new Event('change'));
        return true;
    }
    /**
     * Checks if an element is visible, that it is not hidden by some styling and the element has
     * some size.
     *
     * @param element
     *   Element to check
     * @param checkParent
     *   True to check the parents of the element as well, false to only check the element itself.
     *
     * @returns `true` if the element is visible, `false` if not. Note that if only element itself
     *   is checked, it does not take into account of any parent is not visible.
     */
    static isVisible(element, checkParent = true) {
        const style = window.getComputedStyle(element);
        // hidden via styling
        if ((style.display === 'none') || (style.visibility === 'hidden') || (style.opacity === '0')) {
            return false;
        }
        // element has no dimensions
        if ((element.offsetWidth === 0) && (element.offsetHeight === 0)) {
            return false;
        }
        // check parents
        if (checkParent && element.parentElement) {
            return this.isVisible(element.parentElement);
        }
        return true;
    }
    /**
     * Gets an element for an attribute.
     *
     * If no element can be found the method will throw an error.
     *
     * @param name
     *   Attribute name
     * @param value
     *   Attribute value or use `null` to ignore value
     * @param container
     *   Container to search the element in; if not set, the document is used.
     *
     * @returns found element
     *
     * @throws Error if no element can be found
     */
    static getForAttribute(name, value = null, container) {
        let attribute = name;
        if (value !== null) {
            attribute += `="${value}"`;
        }
        const element = (container || document).querySelector(`[${attribute}]`);
        if (element == null) {
            throw new Error(`Can not find element for attribute ${attribute}`);
        }
        return element;
    }
    /**
     * Tries to find an element for an attribute.
     *
     * @param name
     *   Attribute name
     * @param value
     *   Attribute value or use `null` to ignore value
     * @param container
     *   Container to search the element in; if not set, the document is used.
     *
     * @returns found element or `null` if no element could be found
     */
    static findForAttribute(name, value = null, container) {
        let attribute = name;
        if (value !== null) {
            attribute += `="${value}"`;
        }
        return (container || document).querySelector(`[${attribute}]`);
    }
    /**
     * Gets all elements for an attribute.
     *
     * @param name
     *   Attribute name
     * @param value
     *   Attribute value or use `null` to ignore value
     * @param container
     *   Container to search the element in; if not set, the document is used.
     *
     * @returns found elements
     */
    static findAllForAttribute(name, value = null, container) {
        let attribute = name;
        if (value !== null) {
            attribute += `="${value}"`;
        }
        return (container || document).querySelectorAll(`[${attribute}]`);
    }
    /**
     * Inserts an element after another element.
     *
     * @param parent
     *   Parent to insert the element in
     * @param newElement
     *   Element to insert
     * @param referenceElement
     *   Element to insert the new element after
     */
    static insertAfter(parent, newElement, referenceElement) {
        if (referenceElement.nextElementSibling) {
            parent.insertBefore(newElement, referenceElement.nextElementSibling);
        }
        else {
            // there is no next sibling, so the reference element is the last child; so just append
            // the new element which should place it after the reference element.
            parent.appendChild(newElement);
        }
    }
}
// endregion
// region private vars
/**
 * Maps certain characters to their entity or special html tag or empty string if it has no use in html
 */
UFHtml.s_escapeHtmlMap = new Map([
    ['&', '&amp;'],
    ['<', '&lt;'],
    ['>', '&gt;'],
    ['"', '&quot;'],
    ["'", '&#039;'],
    ['\n', '<br/>'],
    ['\t', ''],
    ['\r', '']
]);
// endregion

/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2022 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2022 Josha Munnik
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
// endregion
// region private types
/**
 * The states a floater can be in.
 */
var FloaterState;
(function (FloaterState) {
    FloaterState["Showing"] = "showing";
    FloaterState["Visible"] = "visible";
    FloaterState["Hiding"] = "hiding";
    FloaterState["Hidden"] = "hidden";
})(FloaterState || (FloaterState = {}));
/**
 * Data attribute names used by this class.
 */
var DataAttribute$h;
(function (DataAttribute) {
    DataAttribute["floater"] = "data-uf-floater";
})(DataAttribute$h || (DataAttribute$h = {}));
/**
 * Position of floater relative to element.
 */
var UFFloaterElementPosition;
(function (UFFloaterElementPosition) {
    /**
     * The floater is positioned adjacent to the element. Either the end of the floater is placed
     * at the start of the element or the start of the floater is placed at the end of the element.
     * The floater position value is not used. The element position is added or subtracted to the
     * floater position (depending on the side) to get the final position.
     * It can be used to partially overlap the floater with the element
     * or create a space between the floater and the element.
     */
    UFFloaterElementPosition["Adjacent"] = "adjacent";
    /**
     * The floater is placed in such a way that it overlaps with the element. Either the start of
     * the floater is set to the start of the element or the end of the floater is set to the end of
     * the element.
     * The floater position value is not used. The element position is added to the floater position
     * to get the final position. It can be used to partially overlap the floater with the element.
     */
    UFFloaterElementPosition["Overlap"] = "overlap";
    /**
     * Both the floater position and element position are interpreted as relative position of an
     * anchor location. Their values should between 0.0 and 1.0. The floater will be positioned in
     * such a manner that the relative anchor position in the floater is at the relative anchor
     * location in the element. For example if both floater and element position are 0.5, the floater
     * will be placed centered at the center of the element.
     */
    UFFloaterElementPosition["Relative"] = "relative";
})(UFFloaterElementPosition || (UFFloaterElementPosition = {}));
/**
 * How to show the floater.
 */
var UFFloaterAutoShow;
(function (UFFloaterAutoShow) {
    /**
     * The floater is not shown automatically.
     */
    UFFloaterAutoShow["None"] = "none";
    /**
     * Show the floater if the user clicks on the element.
     */
    UFFloaterAutoShow["Show"] = "show";
    /**
     * Show or hide the floater if the user clicks on the element.
     */
    UFFloaterAutoShow["Toggle"] = "toggle";
})(UFFloaterAutoShow || (UFFloaterAutoShow = {}));
/**
 * How to hide the floater.
 */
var UFFloaterAutoHide;
(function (UFFloaterAutoHide) {
    /**
     * The floater is not hidden automatically.
     */
    UFFloaterAutoHide["None"] = "none";
    /**
     * Hide the floater if the user clicks somewhere.
     */
    UFFloaterAutoHide["Always"] = "always";
    /**
     * Hide the floater if the user click is outside this floater and any other floater using the
     * same element as this floater.
     */
    UFFloaterAutoHide["Tree"] = "tree";
    /**
     * Hide the floater if the user clicks outside the floater.
     */
    UFFloaterAutoHide["Outside"] = "outside";
})(UFFloaterAutoHide || (UFFloaterAutoHide = {}));
/**
 * Transition animation to use.
 */
var UFFloaterTransition;
(function (UFFloaterTransition) {
    UFFloaterTransition["None"] = "none";
    UFFloaterTransition["Fade"] = "fade";
    UFFloaterTransition["SlideVertical"] = "slide-vertical";
    UFFloaterTransition["SlideHorizontal"] = "slide-horizontal";
    UFFloaterTransition["Custom"] = "custom";
})(UFFloaterTransition || (UFFloaterTransition = {}));
// region private variables
/**
 * Container is used to add the floaters to, to prevent the body showing a scroll bar when the
 * floater goes outside the screen.
 *
 * @private
 */
UFHtml.createAs('<div style="position: fixed; top: 0; left: 0; pointer-events: none;"></div>');
// endregion

/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2022 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2022 Josha Munnik
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
// endregion
// region types
/**
 * Data attribute names used by this class.
 */
var DataAttribute$g;
(function (DataAttribute) {
    DataAttribute["dataOver"] = "data-uf-over";
    DataAttribute["dataDisabled"] = "data-uf-disabled";
})(DataAttribute$g || (DataAttribute$g = {}));
// endregion

/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2022 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2022 Josha Munnik
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
// region imports
// endregion
// region private types
/**
 * States the video can be in.
 */
var VideoState;
(function (VideoState) {
    /**
     * Idle state (nothing is happening)
     */
    VideoState["Idle"] = "Idle";
    /**
     * Busy preloading (video is not ready to be played yet)
     */
    VideoState["Preloading"] = "Preloading";
    /**
     * Video has preloaded and is paused.
     */
    VideoState["Preloaded"] = "Preloaded";
    /**
     * Video is being loaded.
     */
    VideoState["Loading"] = "Loading";
    /**
     * Video is playing (or has been paused while playing).
     */
    VideoState["Playing"] = "Playing";
    /**
     * Video has been stopped.
     */
    VideoState["Stopped"] = "Stopped";
})(VideoState || (VideoState = {}));
// endregion

/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2024 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2024 Josha Munnik
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
// endregion
// region types
// the data attributes used by this helper
var DataAttribute$f;
(function (DataAttribute) {
    DataAttribute["DisplayValue"] = "data-uf-display-value";
    DataAttribute["ShowClasses"] = "data-uf-show-classes";
    DataAttribute["HideClasses"] = "data-uf-hide-classes";
})(DataAttribute$f || (DataAttribute$f = {}));
// the predefined targets
var Target;
(function (Target) {
    Target["Self"] = "_self";
    Target["Parent"] = "_parent";
    Target["Next"] = "_next";
    Target["Previous"] = "_previous";
    Target["Grandparent"] = "_grandparent";
    Target["Dialog"] = "_dialog";
})(Target || (Target = {}));
// endregion

/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2022 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2022 Josha Munnik
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
// region imports
// endregion
// region types
// the data attributes used by this helper
var DataAttribute$e;
(function (DataAttribute) {
    DataAttribute["NoFilter"] = "data-uf-no-filter";
    DataAttribute["FilterTable"] = "data-uf-filter-table";
    DataAttribute["HeaderRow"] = "data-uf-header-row";
    DataAttribute["RowNoMatch"] = "data-uf-row-no-match";
})(DataAttribute$e || (DataAttribute$e = {}));
// endregion

/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2022 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2022 Josha Munnik
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
// region imports
// endregion
// region types
var DataAttribute$d;
(function (DataAttribute) {
    DataAttribute["ClickStylingSelector"] = "data-uf-click-styling-selector";
    DataAttribute["ClickStylingClasses"] = "data-uf-click-styling-classes";
})(DataAttribute$d || (DataAttribute$d = {}));
// endregion

/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2022 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2022 Josha Munnik
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
// region imports
// endregion
// region types
var DataAttribute$c;
(function (DataAttribute) {
    DataAttribute["DetailsCollapse"] = "data-uf-details-collapse";
    DataAttribute["DetailsExpand"] = "data-uf-details-expand";
})(DataAttribute$c || (DataAttribute$c = {}));
// endregion

/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2025 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2025 Josha Munnik
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
// region imports
// endregion
// region types and constants
var DataAttribute$b;
(function (DataAttribute) {
    DataAttribute["ShowDialog"] = "data-uf-show-dialog";
})(DataAttribute$b || (DataAttribute$b = {}));
// endregion

/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2025 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2025 Josha Munnik
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
// region imports
// endregion
// region types
var DataAttribute$a;
(function (DataAttribute) {
    DataAttribute["EventAction"] = "data-uf-event-action";
    DataAttribute["EventEvents"] = "data-uf-event-events";
    DataAttribute["EventTarget"] = "data-uf-event-target";
    DataAttribute["EventData"] = "data-uf-event-data";
    DataAttribute["EventAttribute"] = "data-uf-event-attribute";
    DataAttribute["EventState"] = "data-uf-event-state";
    DataAttribute["EventKey"] = "data-uf-event-key";
    DataAttribute["EventPreventDefault"] = "data-uf-event-prevent-default";
    DataAttribute["ClickAction"] = "data-uf-click-action";
    DataAttribute["ClickTarget"] = "data-uf-click-target";
    DataAttribute["ClickData"] = "data-uf-click-data";
    DataAttribute["ClickAttribute"] = "data-uf-click-attribute";
    DataAttribute["LoadAction"] = "data-uf-load-action";
    DataAttribute["LoadTarget"] = "data-uf-load-target";
    DataAttribute["LoadData"] = "data-uf-load-data";
    DataAttribute["LoadAttribute"] = "data-uf-load-attribute";
})(DataAttribute$a || (DataAttribute$a = {}));
var Action;
(function (Action) {
    Action["RemoveFromDom"] = "remove-from-dom";
    Action["Hide"] = "hide";
    Action["Show"] = "show";
    Action["Toggle"] = "toggle";
    Action["ToggleClass"] = "toggle-class";
    Action["RemoveFromClass"] = "remove-from-class";
    Action["AddToClass"] = "add-to-class";
    Action["ShowModal"] = "show-modal";
    Action["ShowNonModal"] = "show-non-modal";
    Action["Close"] = "close";
    Action["SetAttribute"] = "set-attribute";
    Action["Reload"] = "reload";
    Action["SetValue"] = "set-value";
    Action["SetText"] = "set-text";
    Action["SetHtml"] = "set-html";
})(Action || (Action = {}));

/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2024 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2024 Josha Munnik
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
// region imports
// endregion
// region types
// the data attributes used by this helper
var DataAttribute$9;
(function (DataAttribute) {
    DataAttribute["ImagePreview"] = "data-uf-image-preview";
    DataAttribute["FileName"] = "data-uf-file-name";
    DataAttribute["ImageWidth"] = "data-uf-image-width";
    DataAttribute["ImageHeight"] = "data-uf-image-height";
    DataAttribute["FileSize"] = "data-uf-file-size";
    DataAttribute["FileType"] = "data-uf-file-type";
    DataAttribute["FileNone"] = "data-uf-file-none";
    DataAttribute["FileShow"] = "data-uf-file-show";
})(DataAttribute$9 || (DataAttribute$9 = {}));
// endregion

/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2025 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2025 Josha Munnik
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
// region imports
// endregion
// region types
// the data attributes used by this helper
var DataAttribute$8;
(function (DataAttribute) {
    DataAttribute["NoFilter"] = "data-uf-no-filter";
    DataAttribute["FilterInput"] = "data-uf-filter-input";
    DataAttribute["NoMatch"] = "data-uf-filter-no-match";
    DataAttribute["Group"] = "data-uf-filter-group";
    DataAttribute["Container"] = "data-uf-filter-container";
})(DataAttribute$8 || (DataAttribute$8 = {}));
// endregion

/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2021 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2021 Josha Munnik
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
// region imports
// endregion
// region types
/**
 * Data attribute names used by this helper.
 */
var DataAttribute$7;
(function (DataAttribute) {
    DataAttribute["Type"] = "data-uf-toggle-type";
    DataAttribute["Property"] = "data-uf-toggle-property";
    DataAttribute["Selector"] = "data-uf-toggle-selector";
    DataAttribute["Change"] = "data-uf-toggle-change";
    DataAttribute["Classes"] = "data-uf-toggle-classes";
    DataAttribute["ClassesMatch"] = "data-uf-toggle-classes-match";
    DataAttribute["Condition"] = "data-uf-toggle-condition";
    DataAttribute["Value"] = "data-uf-toggle-value";
    DataAttribute["Values"] = "data-uf-toggle-values";
    DataAttribute["ValuesSeparator"] = "data-uf-toggle-values-separator";
    DataAttribute["Required"] = "data-uf-toggle-required";
    DataAttribute["Target"] = "data-uf-toggle-target";
    DataAttribute["Compare"] = "data-uf-toggle-compare";
})(DataAttribute$7 || (DataAttribute$7 = {}));
var ToggleType;
(function (ToggleType) {
    ToggleType[ToggleType["Auto"] = 0] = "Auto";
    ToggleType[ToggleType["Value"] = 1] = "Value";
    ToggleType[ToggleType["Valid"] = 2] = "Valid";
    ToggleType[ToggleType["Property"] = 3] = "Property";
})(ToggleType || (ToggleType = {}));
var ToggleChange;
(function (ToggleChange) {
    ToggleChange[ToggleChange["Auto"] = 0] = "Auto";
    ToggleChange[ToggleChange["None"] = 1] = "None";
    ToggleChange[ToggleChange["Enable"] = 2] = "Enable";
    ToggleChange[ToggleChange["Visible"] = 3] = "Visible";
    ToggleChange[ToggleChange["Required"] = 4] = "Required";
    ToggleChange[ToggleChange["NotRequired"] = 5] = "NotRequired";
})(ToggleChange || (ToggleChange = {}));
var ToggleCondition;
(function (ToggleCondition) {
    ToggleCondition[ToggleCondition["Any"] = 0] = "Any";
    ToggleCondition[ToggleCondition["All"] = 1] = "All";
    ToggleCondition[ToggleCondition["None"] = 2] = "None";
})(ToggleCondition || (ToggleCondition = {}));
var ToggleRequired;
(function (ToggleRequired) {
    ToggleRequired[ToggleRequired["None"] = 0] = "None";
    ToggleRequired[ToggleRequired["Match"] = 1] = "Match";
    ToggleRequired[ToggleRequired["NoMatch"] = 2] = "NoMatch";
})(ToggleRequired || (ToggleRequired = {}));
var ToggleCompare;
(function (ToggleCompare) {
    ToggleCompare[ToggleCompare["Equal"] = 0] = "Equal";
    ToggleCompare[ToggleCompare["Contain"] = 1] = "Contain";
    ToggleCompare[ToggleCompare["Inside"] = 2] = "Inside";
    ToggleCompare[ToggleCompare["LessThan"] = 3] = "LessThan";
    ToggleCompare[ToggleCompare["LessThanOrEqual"] = 4] = "LessThanOrEqual";
    ToggleCompare[ToggleCompare["GreaterThan"] = 5] = "GreaterThan";
    ToggleCompare[ToggleCompare["GreaterThanOrEqual"] = 6] = "GreaterThanOrEqual";
})(ToggleCompare || (ToggleCompare = {}));
`
  [${DataAttribute$7.Type}], 
  [${DataAttribute$7.Selector}], 
  [${DataAttribute$7.Change}], 
  [${DataAttribute$7.Classes}], 
  [${DataAttribute$7.ClassesMatch}], 
  [${DataAttribute$7.Condition}],
  [${DataAttribute$7.Compare}]
`;
// endregion

/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2025 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2025 Josha Munnik
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
// region imports
// endregion
// region private types
// the data attributes used by this helper
var DataAttribute$6;
(function (DataAttribute) {
    DataAttribute["Sorting"] = "data-uf-grid-sorting";
    DataAttribute["SortControl"] = "data-uf-sort-control";
    DataAttribute["SortButton"] = "data-uf-sort-button";
    DataAttribute["SortKey"] = "data-uf-sort-key";
    DataAttribute["GroupSize"] = "data-uf-group-size";
    DataAttribute["ItemContainer"] = "data-uf-item-container";
    DataAttribute["ItemGroup"] = "data-uf-item-group";
    DataAttribute["SortValue"] = "data-uf-sort-value";
    DataAttribute["SortAscending"] = "data-uf-sort-ascending";
    DataAttribute["SortDescending"] = "data-uf-sort-descending";
    DataAttribute["StorageId"] = "data-uf-storage-id";
    DataAttribute["GridBody"] = "data-uf-grid-body";
})(DataAttribute$6 || (DataAttribute$6 = {}));
// The type of data in a column.
var SortType;
(function (SortType) {
    SortType[SortType["None"] = 0] = "None";
    SortType[SortType["Number"] = 1] = "Number";
    SortType[SortType["Text"] = 2] = "Text";
    SortType[SortType["Date"] = 3] = "Date";
})(SortType || (SortType = {}));
// endregion
// region private constants
/**
 * Selector to get child that is not using any special data attribute.
 */
`:scope > :not([${DataAttribute$6.ItemContainer}],[${DataAttribute$6.ItemGroup}],[${DataAttribute$6.SortControl}])`;

/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2022 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2024 Josha Munnik
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
// region imports
// endregion
// region types
// the data attributes used by this helper
var DataAttribute$5;
(function (DataAttribute) {
    DataAttribute["PopupContent"] = "data-uf-popup-content";
    DataAttribute["PopupPosition"] = "data-uf-popup-position";
    DataAttribute["PopupHide"] = "data-uf-popup-hide";
    DataAttribute["PopupTransition"] = "data-uf-popup-transition";
    DataAttribute["PopupDeltaX"] = "data-uf-popup-delta-x";
    DataAttribute["PopupDeltaY"] = "data-uf-popup-delta-y";
})(DataAttribute$5 || (DataAttribute$5 = {}));
var PopupPosition;
(function (PopupPosition) {
    PopupPosition["Vertical"] = "vertical";
    PopupPosition["Horizontal"] = "horizontal";
    PopupPosition["Overlap"] = "overlap";
})(PopupPosition || (PopupPosition = {}));
var PopupHide;
(function (PopupHide) {
    PopupHide["Tree"] = "tree";
    PopupHide["Always"] = "always";
})(PopupHide || (PopupHide = {}));
// endregion

/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2024 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2024 Josha Munnik
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
// region imports
// endregion
// region types
var DataAttribute$4;
(function (DataAttribute) {
    DataAttribute["SelectUrl"] = "data-uf-select-url";
})(DataAttribute$4 || (DataAttribute$4 = {}));
// endregion

/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2024 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2024 Josha Munnik
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
// region imports
// endregion
// region types
var DataAttribute$3;
(function (DataAttribute) {
    DataAttribute["ShareHover"] = "data-uf-share-hover";
})(DataAttribute$3 || (DataAttribute$3 = {}));
// endregion

/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2024 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2024 Josha Munnik
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
// region imports
// endregion
// region types
var DataAttribute$2;
(function (DataAttribute) {
    DataAttribute["PageRefresh"] = "data-uf-page-refresh";
})(DataAttribute$2 || (DataAttribute$2 = {}));
// endregion

/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2024 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2024 Josha Munnik
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
// region imports
// endregion
// region types and constants
var DataAttribute$1;
(function (DataAttribute) {
    DataAttribute["ManageSubmit"] = "data-uf-manage-submit";
})(DataAttribute$1 || (DataAttribute$1 = {}));
// endregion

/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2024 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2024 Josha Munnik
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
/**
 * The various ways a child area can fit into a parent area.
 */
var UFFitType;
(function (UFFitType) {
    UFFitType[UFFitType["Contain"] = 0] = "Contain";
    UFFitType[UFFitType["Cover"] = 1] = "Cover";
    UFFitType[UFFitType["Stretch"] = 2] = "Stretch";
})(UFFitType || (UFFitType = {}));

/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2024 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2024 Josha Munnik
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
/**
 * The various image types.
 */
var UFImageType;
(function (UFImageType) {
    UFImageType["Png"] = "image/png";
    UFImageType["Jpeg"] = "image/jpeg";
})(UFImageType || (UFImageType = {}));

/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2022 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2022 Josha Munnik
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
/**
 * Possible methods when sending data to a server.
 */
var UFFetchMethod;
(function (UFFetchMethod) {
    UFFetchMethod["Get"] = "GET";
    UFFetchMethod["Post"] = "POST";
    UFFetchMethod["Put"] = "PUT";
    UFFetchMethod["Patch"] = "PATCH";
    UFFetchMethod["Delete"] = "DELETE";
})(UFFetchMethod || (UFFetchMethod = {}));

class ApplicationData {
    // region private variables
    m_selectedWeek = null;
    m_compareEntries = [];
    // endregion
    // region public methods
    removeCompareEntry(entry) {
        const index = this.m_compareEntries.indexOf(entry);
        if (index > -1) {
            this.m_compareEntries.splice(index, 1);
        }
    }
    // endregion
    // region public properties
    get selectedWeek() {
        return this.m_selectedWeek;
    }
    set selectedWeek(value) {
        this.m_selectedWeek = value;
    }
    get compareEntries() {
        return this.m_compareEntries;
    }
    set compareEntries(value) {
        this.m_compareEntries = value;
    }
}
const applicationData = new ApplicationData();

var CssClass;
(function (CssClass) {
    CssClass["Hidden"] = "tp-hidden";
    CssClass["TextSuccess"] = "tp-text--is-success";
})(CssClass || (CssClass = {}));

// region imports
// endregion
class HomePage extends PageBase {
    // region private variables
    m_foodCount = UFHtml.getForId('food-count');
    m_dayCount = UFHtml.getForId('day-count');
    m_weekStart = UFHtml.getForId('week-start');
    m_today = UFHtml.getForId('today');
    m_settingsButton = UFHtml.getForId('settings-button');
    m_historyButton = UFHtml.getForId('history-button');
    m_dictateButton = UFHtml.getForId('dictate-button');
    m_manualButton = UFHtml.getForId('manual-button');
    m_missingSpeechRecognition = UFHtml.getForId('missing-speech-recognition');
    // endregion
    // region public methods
    constructor() {
        super('home-page', 'home');
        this.m_settingsButton.addEventListener('click', () => this.handleSettingsButtonClick());
        this.m_historyButton.addEventListener('click', () => this.handleHistoryButtonClick());
        this.m_manualButton.addEventListener('click', () => this.handleManualButtonClick());
        if (Tools.hasSpeechRecognitionSupport()) {
            this.m_missingSpeechRecognition.classList.add(CssClass.Hidden);
            this.m_dictateButton.addEventListener('click', () => this.handleDictateButtonClick());
        }
        else {
            this.m_dictateButton.disabled = true;
            this.m_dictateButton.classList.add(CssClass.Hidden);
        }
    }
    // endregion
    // region protected methods
    onShowStart() {
        const current = historyData.getCountForToday();
        this.m_weekStart.innerText = Text.formatDate(current.startDate);
        this.m_today.innerText = Text.formatDate(new Date());
        this.m_dayCount.innerText = (7 - Tools.daysBetween(current.startDate, new Date())).toString();
        this.m_foodCount.innerText = current.foods.length.toString();
        this.m_foodCount.classList.toggle(CssClass.TextSuccess, current.foods.length >= 20);
    }
    // endregion
    // region event handlers
    handleSettingsButtonClick() {
        mainController.showSettings();
    }
    handleHistoryButtonClick() {
        mainController.showHistory();
    }
    handleDictateButtonClick() {
        mainController.showDictation();
    }
    handleManualButtonClick() {
        applicationData.compareEntries = [];
        mainController.showConfirm();
    }
}
const homePage = new HomePage();

/**
 * All data attributes used in the project are defined here.
 */
var DataAttribute;
(function (DataAttribute) {
    DataAttribute["BackButton"] = "[data-tp-back-button]";
    DataAttribute["OriginalName"] = "[data-tp-original-name]";
    DataAttribute["FoodName"] = "[data-tp-food-name]";
    DataAttribute["CategoryName"] = "[data-tp-category-name]";
    DataAttribute["AddButton"] = "[data-tp-add-button]";
    DataAttribute["RemoveButton"] = "[data-tp-remove-button]";
    DataAttribute["FoodCount"] = "[data-tp-food-count]";
    DataAttribute["StartDate"] = "[data-tp-start-date]";
    DataAttribute["EndDate"] = "[data-tp-end-date]";
    DataAttribute["ViewButton"] = "[data-tp-view-button]";
    DataAttribute["ExpandButton"] = "[data-tp-expand-button]";
    DataAttribute["CollapseButton"] = "[data-tp-collapse-button]";
    DataAttribute["FoodHistoryEntries"] = "[data-tp-food-history-entries]";
    DataAttribute["FoodHistoryDate"] = "[data-tp-food-history-date]";
    DataAttribute["FoodHistoryName"] = "[data-tp-food-history-name]";
})(DataAttribute || (DataAttribute = {}));

// region imports
// endregion
// region local types
class WeekPage extends PageBase {
    // region private variables
    m_weekStart = UFHtml.getForId("week-start-title");
    m_weekEnd = UFHtml.getForId("week-end-title");
    m_foodEntries = UFHtml.getForId("food-entries");
    m_foodEntryTemplate = UFHtml.getForId("food-entry");
    m_foodHistoryEntryTemplate = UFHtml.getForId("food-history-entry");
    // endregion
    // region public methods
    constructor() {
        super('week-page', 'week overview');
    }
    // endregion
    // region protected methods
    onShowStart() {
        this.m_foodEntries.replaceChildren();
        const week = applicationData.selectedWeek;
        this.m_weekStart.innerText = Text.formatDate(week.startDate);
        this.m_weekEnd.innerText = Text.formatDate(week.endDate);
        const historyEntries = historyData.getListForWeek(week);
        const foods = this.getFoods(historyEntries);
        foods.forEach(food => this.m_foodEntries.appendChild(this.createFoodEntryElement(food, this.getHistoryEntriesForFood(food, historyEntries))));
    }
    onHideDone() {
        this.m_foodEntries.replaceChildren();
    }
    // endregion
    // region private methods
    /**
     * Gets all unique foods consumed by all history entries, sorted by name.
     */
    getFoods(historyEntries) {
        const foods = new Set();
        historyEntries.forEach(entry => foods.add(entry.food));
        const result = [...foods];
        result.sort((first, second) => first.name.localeCompare(second.name));
        return result;
    }
    /**
     * Gets all history entries for the given food.
     *
     * @param food
     * @param historyEntries
     *
     * @return All history entries for the given food, sorted by date ascending.
     */
    getHistoryEntriesForFood(food, historyEntries) {
        const result = historyEntries.filter(entry => entry.food === food);
        result.sort((first, second) => first.date.getTime() - second.date.getTime());
        return result;
    }
    createFoodEntryElement(food, historyEntries) {
        const element = this.m_foodEntryTemplate.content.cloneNode(true);
        const name = element.querySelector(DataAttribute.FoodName);
        const category = element.querySelector(DataAttribute.CategoryName);
        const foodHistoryEntries = element.querySelector(DataAttribute.FoodHistoryEntries);
        const collapseButton = element.querySelector(DataAttribute.CollapseButton);
        const expandButton = element.querySelector(DataAttribute.ExpandButton);
        name.innerText = food.name;
        category.innerText = food.category;
        historyEntries.forEach(entry => foodHistoryEntries.appendChild(this.createFoodHistoryEntryElement(entry)));
        collapseButton.classList.add(CssClass.Hidden);
        foodHistoryEntries.classList.add(CssClass.Hidden);
        collapseButton.addEventListener('click', () => this.handleCollapseClick(foodHistoryEntries, collapseButton, expandButton));
        expandButton.addEventListener('click', () => this.handleExpandClick(foodHistoryEntries, collapseButton, expandButton));
        return element;
    }
    createFoodHistoryEntryElement(entry) {
        const element = this.m_foodHistoryEntryTemplate.content.cloneNode(true);
        const date = element.querySelector(DataAttribute.FoodHistoryDate);
        const name = element.querySelector(DataAttribute.FoodHistoryName);
        date.innerText = Text.formatDateWithTime(entry.date);
        name.innerText = entry.consumedName;
        return element;
    }
    // endregion
    // region event handlers
    handleCollapseClick(foodHistoryEntries, collapseButton, expandButton) {
        foodHistoryEntries.classList.add(CssClass.Hidden);
        collapseButton.classList.add(CssClass.Hidden);
        expandButton.classList.remove(CssClass.Hidden);
    }
    handleExpandClick(foodHistoryEntries, collapseButton, expandButton) {
        foodHistoryEntries.classList.remove(CssClass.Hidden);
        collapseButton.classList.remove(CssClass.Hidden);
        expandButton.classList.add(CssClass.Hidden);
    }
}
// endregion
// region exports
const weekPage = new WeekPage();
// endregion

// region imports
// endregion
// region local types
class SettingsPage extends PageBase {
    // region private variables
    m_weekStartSelect = UFHtml.getForId('week-start-select');
    m_clearHistoryButton = UFHtml.getForId('clear-history-button');
    // endregion
    // region public methods
    constructor() {
        super('settings-page', 'settings');
        this.m_weekStartSelect.addEventListener('change', () => this.handleWeekStartChange());
        this.m_clearHistoryButton.addEventListener('click', () => this.handleClearHistory());
    }
    // endregion
    // region protected methods
    onShowStart() {
        this.m_weekStartSelect.value = String(settings.startDayOfWeek);
    }
    // endregion
    // region event handlers
    handleWeekStartChange() {
        const value = parseInt(this.m_weekStartSelect.value, 10);
        if (!isNaN(value) && value >= 0 && value <= 6) {
            settings.startDayOfWeek = value;
        }
    }
    handleClearHistory() {
        if (confirm('Are you sure you want to clear your history? This action cannot be undone.')) {
            historyData.clear();
        }
    }
}
// endregion
// region exports
const settingsPage = new SettingsPage();
// endregion

// region imports
// endregion
// region local types
class HistoryPage extends PageBase {
    // region private variables
    m_entries = UFHtml.getForId('history-entries');
    m_entryTemplate = UFHtml.getForId('history-entry');
    // endregion
    // region public methods
    constructor() {
        super('history-page', 'history');
    }
    // endregion
    // region protected methods
    onShowStart() {
        this.m_entries.replaceChildren();
        const entries = historyData.getCountsPerWeek();
        entries.forEach(entry => this.m_entries.appendChild(this.createEntryElement(entry)));
    }
    onHideDone() {
        this.m_entries.replaceChildren();
    }
    // endregion
    // region private method
    createEntryElement(entry) {
        const element = this.m_entryTemplate.content.cloneNode(true);
        const startDate = element.querySelector(DataAttribute.StartDate);
        const endDate = element.querySelector(DataAttribute.EndDate);
        const foodCount = element.querySelector(DataAttribute.FoodCount);
        const viewButton = element.querySelector(DataAttribute.ViewButton);
        startDate.innerText = Text.formatDate(entry.startDate);
        endDate.innerText = Text.formatDate(entry.endDate);
        const count = entry.foods.length;
        foodCount.innerText = count.toString();
        if (count >= 20) {
            foodCount.classList.add(CssClass.TextSuccess);
        }
        viewButton.addEventListener('click', () => this.handleViewClick(entry));
        return element;
    }
    // endregion
    // region event handler
    handleViewClick(entry) {
        mainController.showWeek(entry);
    }
}
// endregion
// region exports
const historyPage = new HistoryPage();
// endregion

// region imports
// endregion
// region local constants
const STOP_WORDS = ['stop', 'done', 'finish'];
// endregion
// region local types
class DictationPage extends PageBase {
    // region private variables
    m_status = UFHtml.getForId('dictation-status');
    m_pauseButton = UFHtml.getForId('dictation-pause-button');
    m_recordButton = UFHtml.getForId('dictation-record-button');
    m_stopButton = UFHtml.getForId('dictation-stop-button');
    m_recordedText = UFHtml.getForId('dictation-recorded-text');
    m_recognition = null;
    m_active = false;
    // endregion
    // region public methods
    constructor() {
        super('dictation-page', 'dictate entries');
        if (Tools.hasSpeechRecognitionSupport()) {
            const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.m_recognition = new SpeechRecognitionClass();
            this.m_recognition.lang = 'en-US';
            this.m_recognition.continuous = true;
            this.m_recognition.interimResults = true;
            this.m_recognition.maxAlternatives = 1;
            this.m_recognition.addEventListener('result', (event) => this.handleRecognitionResult(event));
            this.m_recognition.addEventListener('error', (event) => this.handleRecognitionError(event));
            this.m_recognition.addEventListener('end', () => this.handleRecognitionEnd());
        }
        this.m_recordButton.addEventListener('click', () => this.handleRecordClick());
        this.m_pauseButton.addEventListener('click', () => this.handlePauseClick());
        this.m_stopButton.addEventListener('click', () => this.handleStopClick());
    }
    // endregion
    // region protected methods
    onShowStart() {
        this.m_active = true;
        this.m_recordedText.innerText = '';
        this.showPause();
        this.startRecording();
    }
    onHideDone() {
    }
    // endregion
    // region private methods
    showPause() {
        this.m_pauseButton.classList.remove(CssClass.Hidden);
        this.m_recordButton.classList.add(CssClass.Hidden);
        this.m_status.innerText = 'Recording';
    }
    showRecord() {
        this.m_pauseButton.classList.add(CssClass.Hidden);
        this.m_recordButton.classList.remove(CssClass.Hidden);
        this.m_status.innerText = 'Paused';
    }
    startRecording() {
        try {
            this.m_recognition.start();
        }
        catch (err) {
            // start() can throw if called while already running
            console.warn(err);
        }
    }
    stop() {
        if (this.m_active) {
            this.m_active = false;
            this.m_recognition.stop();
            this.processTranscript();
            mainController.showConfirm();
        }
    }
    processTranscript() {
        applicationData.compareEntries = foodData.processText(this.m_recordedText.innerText);
    }
    containsStopCommand(text) {
        const normalizedText = Text.normalizeForComparison(text);
        return STOP_WORDS.some(stopWord => normalizedText.includes(stopWord));
    }
    // endregion
    // region event handlers
    handleRecognitionResult(event) {
        for (let index = event.resultIndex; index < event.results.length; index++) {
            const transcript = event.results[index][0].transcript;
            if (event.results[index].isFinal) {
                this.m_recordedText.innerText += transcript + ' ';
            }
        }
        if (this.containsStopCommand(this.m_recordedText.innerText)) {
            this.stop();
        }
    }
    handleRecognitionError(event) {
        console.error('Recognition Error:', event);
        this.showRecord();
    }
    handleRecognitionEnd() {
        this.showRecord();
    }
    handleRecordClick() {
        this.m_recognition.start();
        this.showPause();
    }
    handlePauseClick() {
        this.m_recognition.stop();
        this.showRecord();
    }
    handleStopClick() {
        this.stop();
    }
}
// endregion
// region exports
const dictationPage = new DictationPage();
// endregion

class ConfirmPage extends PageBase {
    // region private variables
    m_confirmEntries = UFHtml.getForId('confirm-entries');
    m_entryTemplate = UFHtml.getForId('confirm-entry-template');
    m_saveButton = UFHtml.getForId('confirm-save-button');
    m_addButton = UFHtml.getForId('confirm-add-button');
    m_none = UFHtml.getForId('confirm-none');
    // endregion
    // region public methods
    constructor() {
        super('confirm-page', 'confirm entries');
        this.m_saveButton.addEventListener('click', () => this.handleSaveClick());
        this.m_addButton.addEventListener('click', () => this.handleAddClick());
    }
    // endregion
    // region protected methods
    onShowStart() {
        this.buildList();
        this.updateVisibility();
    }
    onHideDone() {
        this.m_confirmEntries.replaceChildren();
    }
    // endregion
    // region private methods
    buildList() {
        const entries = applicationData.compareEntries;
        this.m_confirmEntries.replaceChildren();
        entries.forEach(entry => this.m_confirmEntries.appendChild(this.createEntryElement(entry)));
    }
    updateVisibility() {
        const hasEntries = applicationData.compareEntries.length > 0;
        this.m_none.classList.toggle(CssClass.Hidden, hasEntries);
        this.m_confirmEntries.classList.toggle(CssClass.Hidden, !hasEntries);
        this.m_saveButton.disabled = !hasEntries;
    }
    createEntryElement(entry) {
        const element = this.m_entryTemplate.content.cloneNode(true);
        const originalName = element.querySelector(DataAttribute.OriginalName);
        const foodName = element.querySelector(DataAttribute.FoodName);
        const removeButton = element.querySelector(DataAttribute.RemoveButton);
        originalName.innerText = entry.original;
        foodName.innerText = entry.food.name;
        removeButton.addEventListener('click', () => this.handleRemoveClick(entry));
        return element;
    }
    // endregion
    // region event handlers
    handleRemoveClick(entry) {
        applicationData.removeCompareEntry(entry);
        this.buildList();
        this.updateVisibility();
    }
    handleSaveClick() {
        historyData.add(applicationData.compareEntries);
        applicationData.compareEntries = [];
        mainController.back();
    }
    handleAddClick() {
        mainController.showAdd();
    }
}
const confirmPage = new ConfirmPage();

// region imports
// endregion
// region local constants
const FILTER_ATTRIBUTE = 'data-tp-filter-text';
// endregion
// region local types
class AddPage extends PageBase {
    // region private variables
    m_filterInput = UFHtml.getForId("add-filter-input");
    m_addEntries = UFHtml.getForId("add-entries");
    m_entryTemplate = UFHtml.getForId("add-entry-template");
    /**
     * Contains all children of the entries container while the page is visible.
     */
    m_children = [];
    // endregion
    // region public methods
    constructor() {
        super('add-page', 'add entry');
        this.m_filterInput.addEventListener('input', () => this.handleFilterChange());
    }
    // endregion
    // region protected methods
    onShowStart() {
        const entries = foodData.getList();
        this.m_addEntries.replaceChildren();
        this.m_filterInput.value = '';
        entries.forEach(entry => this.m_addEntries.appendChild(this.createEntryElement(entry)));
        this.m_children = Array.from(this.m_addEntries.children);
    }
    onHideDone() {
        this.m_children = [];
        this.m_addEntries.replaceChildren();
    }
    // endregion
    // region private method
    createEntryElement(entry) {
        const element = this.m_entryTemplate.content.cloneNode(true);
        const filterText = Text.normalizeForComparison(`${entry.original}${entry.food.name}`);
        const originalName = element.querySelector(DataAttribute.OriginalName);
        const foodName = element.querySelector(DataAttribute.FoodName);
        const addButton = element.querySelector(DataAttribute.AddButton);
        originalName.innerText = entry.original;
        foodName.innerText = entry.food.name;
        addButton.addEventListener('click', () => this.handleAddClick(entry));
        originalName.setAttribute(FILTER_ATTRIBUTE, filterText);
        foodName.setAttribute(FILTER_ATTRIBUTE, filterText);
        addButton.setAttribute(FILTER_ATTRIBUTE, filterText);
        return element;
    }
    // endregion
    // region event handler
    handleAddClick(entry) {
        applicationData.compareEntries.push(entry);
        mainController.back();
    }
    handleFilterChange() {
        const filterValue = Text.normalizeForComparison(this.m_filterInput.value);
        this.m_children.forEach(child => {
            const filterText = child.getAttribute(FILTER_ATTRIBUTE) ?? '';
            child.classList.toggle(CssClass.Hidden, !filterText.includes(filterValue));
        });
    }
}
// endregion
// region exports
const addPage = new AddPage();
// endregion

// region imports
// endregion
// region local type
class MainController {
    // region private variables
    m_pageStack = [];
    // endregion
    // region public methods
    start() {
        loadingPage.hide();
        //this.showPage(confirmPage);
        this.showPage(homePage);
    }
    back() {
        const currentPage = this.m_pageStack.pop();
        if (currentPage) {
            currentPage.hide();
        }
        if (this.m_pageStack.length > 0) {
            this.m_pageStack.at(-1).show();
        }
    }
    showAdd() {
        this.showPage(addPage);
    }
    showConfirm() {
        // do not go back to dictation page but go back to page before that
        this.showPage(confirmPage, this.m_pageStack.at(-1) === dictationPage);
    }
    showDictation() {
        this.showPage(dictationPage);
    }
    showHistory() {
        this.showPage(historyPage);
    }
    showSettings() {
        this.showPage(settingsPage);
    }
    showWeek(week) {
        applicationData.selectedWeek = week;
        this.showPage(weekPage);
    }
    // endregion
    // region private methods
    /**
     * Shows the given page.
     *
     * @param page
     * @param replace
     *   When true, the current page at the top of the stack is replaced by the new page. Else the new
     *   page is added on top of the stack.
     *
     * @private
     */
    showPage(page, replace = false) {
        if (this.m_pageStack.length > 0) {
            this.m_pageStack.at(-1).hide();
        }
        if (replace) {
            this.m_pageStack.pop();
        }
        this.m_pageStack.push(page);
        page.show();
    }
}
// endregion
// region exports
const mainController = new MainController();
// endregion

// region imports
// endregion
// region local constants
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQwlU_Al-u5JKhCjje6GZCNxdafpKBsZw2luPFZC8Vl6xd7eaNMjtJ3hxdrO8TGoYSS1In8WqEM3BEY/pub?output=csv';
// endregion
// region types
class Application {
    async run() {
        // first need to get rows
        const rows = await Tools.loadCSV(CSV_URL);
        foodData.import(rows);
        // the initialize data (that references food data)
        historyData.initialize();
        // install non-page specific listeners
        UFHtml.addListeners(DataAttribute.BackButton, 'click', () => () => mainController.back());
        // start the app
        mainController.start();
    }
}
// endregion
// region exports
const application = new Application();
// endregion

// region imports
// endregion
await application.run();
