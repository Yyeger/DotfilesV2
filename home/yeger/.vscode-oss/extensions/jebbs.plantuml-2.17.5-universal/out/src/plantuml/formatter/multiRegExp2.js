"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiRegExp2 = void 0;
class MultiRegExp2 {
    constructor(baseRegExp) {
        const { regexp, groupIndexMapper, previousGroupsForGroup } = fillGroups(baseRegExp);
        this.regexp = regexp;
        this.groupIndexMapper = groupIndexMapper;
        this.previousGroupsForGroup = previousGroupsForGroup;
    }
    get regExp() {
        return this.regexp;
    }
    exec(para) {
        let text = "", offset = 0, original = "";
        if (para.offset !== undefined && para.text !== undefined) {
            text = para.text;
            offset = para.offset;
            original = para.original;
        }
        else {
            text = para;
            original = text;
        }
        // for those substr matching, if the REG claims "^", it must both match the substr and the fullstr
        if (offset > 0 && this.regExp.source.startsWith("^") && !this.regExp.test(original))
            return undefined;
        let matches = RegExp.prototype.exec.call(this.regexp, text);
        if (!matches)
            return undefined;
        let firstIndex = matches.index;
        let indexMapper = Object.assign({ 0: 0 }, this.groupIndexMapper);
        let previousGroups = Object.assign({ 0: [] }, this.previousGroupsForGroup);
        return Object.keys(indexMapper).map((group) => {
            let mapped = indexMapper[group];
            let r = {
                capture: matches[mapped],
                start: firstIndex + previousGroups[group].reduce((sum, i) => sum + (matches[i] ? matches[i].length : 0), 0)
            };
            r.end = r.start + (matches[mapped] ? matches[mapped].length - 1 : 0);
            return r;
        });
    }
    execForGroup(string, group) {
        const matches = RegExp.prototype.exec.call(this.regexp, string);
        if (!matches)
            return matches;
        const firstIndex = matches.index;
        const mapped = group == 0 ? 0 : this.groupIndexMapper[group];
        const previousGroups = group == 0 ? [] : this.previousGroupsForGroup[group];
        let r = {
            capture: matches[mapped],
            start: firstIndex + previousGroups.reduce((sum, i) => sum + (matches[i] ? matches[i].length : 0), 0)
        };
        r.end = r.start + (matches[mapped] ? matches[mapped].length - 1 : 0);
        return r;
    }
}
exports.MultiRegExp2 = MultiRegExp2;
/**
 * converts the given regex to a regex where all not captured string are going to be captured
 * it along sides generates a mapper which maps the original group index to the shifted group offset and
 * generates a list of groups indexes (including new generated capturing groups)
 * which have been closed before a given group index (unshifted)
 *
 * Example:
 * regexp: /a(?: )bc(def(ghi)xyz)/g => /(a(?: )bc)((def)(ghi)(xyz))/g
 * groupIndexMapper: {'1': 2, '2', 4}
 * previousGroupsForGroup: {'1': [1], '2': [1, 3]}
 *
 * @param regex RegExp
 * @return {{regexp: RegExp, groupIndexMapper: {}, previousGroupsForGroup: {}}}
 */
function fillGroups(regex) {
    let regexString;
    let modifier;
    if (regex.source && regex.flags) {
        regexString = regex.source;
        modifier = regex.flags;
    }
    else {
        regexString = regex.toString();
        modifier = regexString.substring(regexString.lastIndexOf(regexString[0]) + 1); // sometimes order matters ;)
        regexString = regexString.substr(1, regex.toString().lastIndexOf(regexString[0]) - 1);
    }
    // regexp is greedy so it should match (? before ( right?
    // brackets may be not quoted by \
    // closing bracket may look like: ), )+, )+?, ){1,}?, ){1,1111}?, )|
    // )|, |( for situation like (a)|b|(c), shoud not add group to |, like (a)(|b|)(c)
    const tester = /(\|?\(\?(?::|=|!|<=|<!))|(\|?\()|(\)(?:\{\d+,?\d*}|[*+?|])?\??)/g;
    let modifiedRegex = regexString;
    let lastGroupStartPosition = -1;
    let lastGroupEndPosition = -1;
    let groupsAdded = 0;
    let groupCount = 0;
    let matchArr;
    const nonGroupPositions = [];
    const groupPositions = [];
    const groupNumber = [];
    const currentLengthIndexes = [];
    const groupIndexMapper = {};
    const previousGroupsForGroup = {};
    while ((matchArr = tester.exec(regexString)) !== null) {
        if (isEscaped(matchArr.index) || isInCharacterSets(matchArr.index))
            continue;
        if (matchArr[1]) { // non capturing group
            let index = matchArr.index + matchArr[0].length - 1;
            nonGroupPositions.push({ start: matchArr.index, end: index });
        }
        else if (matchArr[2]) { // capturing group
            let index = matchArr.index + matchArr[0].length - 1;
            let lastGroupPosition = Math.max(lastGroupStartPosition, lastGroupEndPosition);
            if (lastGroupPosition < index - matchArr[0].length) {
                let addSlices = calcAddGroupPosition({ start: lastGroupPosition + 1, end: index - matchArr[0].length }, nonGroupPositions);
                for (let s of addSlices) {
                    modifiedRegex = addGroupToRegexString(modifiedRegex, s.start, s.end, groupsAdded);
                    groupsAdded++;
                    lastGroupEndPosition = s.end; // imaginary position as it is not in regex but modifiedRegex
                    currentLengthIndexes.push(groupCount + groupsAdded);
                }
            }
            groupCount++;
            lastGroupStartPosition = index;
            groupPositions.push(index);
            groupNumber.push(groupCount + groupsAdded);
            groupIndexMapper[groupCount] = groupCount + groupsAdded;
            previousGroupsForGroup[groupCount] = currentLengthIndexes.slice();
        }
        else if (matchArr[3]) { // closing bracket
            let index = matchArr.index + matchArr[0].length - 1;
            if (lastGroupStartPosition < lastGroupEndPosition && lastGroupEndPosition < index - matchArr[0].length) {
                let addSlices = calcAddGroupPosition({ start: lastGroupEndPosition + 1, end: index - matchArr[0].length }, nonGroupPositions);
                for (let s of addSlices) {
                    modifiedRegex = addGroupToRegexString(modifiedRegex, s.start, s.end, groupsAdded);
                    groupsAdded++;
                    //lastGroupEndPosition = index - 1; will be set anyway
                    currentLengthIndexes.push(groupCount + groupsAdded);
                }
            }
            lastGroupEndPosition = index;
            if ((groupPositions.length && !nonGroupPositions.length) ||
                groupPositions[groupPositions.length - 1] > nonGroupPositions[nonGroupPositions.length - 1].end) {
                groupPositions.pop();
                currentLengthIndexes.push(groupNumber.pop());
            }
            else if (nonGroupPositions.length) {
                nonGroupPositions.pop();
            }
        }
        function isEscaped(position) {
            let count = 0;
            for (let i = position - 1; i >= 0; i--) {
                if (regexString.substr(i, 1) != "\\")
                    break;
                count++;
            }
            return count != 0 && count % 2 == 1;
        }
        function isInCharacterSets(position) {
            for (let i = position - 1; i >= 0; i--) {
                if (regexString.substr(i, 1) == "]" && !isEscaped(i))
                    return false;
                if (regexString.substr(i, 1) == "[" && !isEscaped(i))
                    return true;
            }
            return false;
        }
    }
    return { regexp: new RegExp(modifiedRegex, modifier), groupIndexMapper, previousGroupsForGroup };
}
/**
 * Adds brackets before and after a part of string
 * @param str string the hole regex string
 * @param start int marks the position where ( should be inserted
 * @param end int marks the position where ) should be inserted
 * @param groupsAdded int defines the offset to the original string because of inserted brackets
 * @return {string}
 */
function addGroupToRegexString(str, start, end, groupsAdded) {
    start += groupsAdded * 2;
    end += groupsAdded * 2;
    return str.substring(0, start) + '(' + str.substring(start, end + 1) + ')' + str.substring(end + 1);
}
function calcAddGroupPosition(AddPos, nonCaptureGroupPositions) {
    // nonCaptureGroupPositions.sort((a, b) => a.start - b.start);
    if (!nonCaptureGroupPositions || !nonCaptureGroupPositions.length)
        return [AddPos];
    let results = [AddPos];
    for (let np of nonCaptureGroupPositions) {
        results = results.reduce((pre, slice) => {
            pre.push(...minusSlice(slice, np));
            return pre;
        }, []);
    }
    return results;
    function minusSlice(a, b) {
        let results = [];
        if (b.start > a.start && b.start <= a.end)
            results.push({ start: a.start, end: b.start - 1 });
        if (b.end < a.end && b.end >= a.start)
            results.push({ start: b.end + 1, end: a.end });
        if (b.start > a.end || b.end < a.start)
            results.push(a);
        return results;
    }
}
//# sourceMappingURL=multiRegExp2.js.map