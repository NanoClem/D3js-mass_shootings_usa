// maj +f5


/* ===========================
        MAP UTILS
============================*/

/**
 * Determine a value number for the total killed
 * in order to color the map
 * @param {*} value number of killed
 */
function reducevalue(value) {

    if (value <= 50) {
        value = 0;
    } else if (value <= 100) {
        value = 1;
    } else if (value <= 150) {
        value = 2;
    } else {
        value = 3;
    }
    return value
}

