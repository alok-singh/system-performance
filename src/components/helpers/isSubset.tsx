//@description: Is 'subset' subset of 'json'
//NOTE: Empty Array - not a subset
export const isSubset = (json: any, subset: any): boolean => {
    let valid = true;
    
    //Case json is Array
    if (Array.isArray(json)) {

        let parentSet = new Set(Object.keys(json[0]));
        let keysOfAllElements: Array<string> = [];
        for (let i = 0; i < subset.length; i++) {
            keysOfAllElements = keysOfAllElements.concat(Object.keys(subset[i]));
        }
        let childrenSet = new Set(keysOfAllElements);

        //Case both Arrays and subset Array is non empty
        if (Array.isArray(subset) && (subset.length) && (subset.length <= json.length) && (childrenSet.size <= parentSet.size)) {
            // console.log("Both Arrays")
            json = json[0];
            for (let i = 0; i < subset.length; i++) {
                valid = valid && isSubset(json, subset[i]);
                if (!valid) return valid;
            }
            return valid;
        }
        else {
            return false;
        }
    }

    //Case Both Objects
    else if (typeof (json) == 'object' && typeof (subset) == 'object' && !Array.isArray(subset) && !Array.isArray(json)) {

        let key = new Set(Object.keys(json));
        let keySubset = new Set(Object.keys(subset));

        keySubset.forEach(element => {
            valid = valid && (key.has(element)) &&
                (typeof (json[element]) == typeof (subset[element])) &&
                (isSubset(json[element], subset[element]));
        });

        return !!valid;
    }
    else {
        return (typeof (json) == typeof (subset) && !Array.isArray(subset) && !Array.isArray(json));
    }
}