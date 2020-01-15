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


/* ===========================
        DONUT UTILS
============================*/

let categories = [
    { label: "Home and neighborhood", sub: ["Residential home/Neighborhood, Retail/Wholesale/Services facility", "Residential home/Neighborhood"], count: 0 },
    { label: "School and educationnal", sub: ["Primary school", "Secondary school", "College/University/Adult education"], count: 0 },
    { label: "Public facilities", sub: ["Medical/Care", "Public transportation", "Park/Wilderness", "Place of worship", "Restaurant/Cafe", "Retail/Wholesale/Services facility", "Entertainment Venue", "Street/Highway"], count: 0 },
    { label: "Government and military facilities", sub: ["Government facility", "Military facility"], count: 0 },
    { label: "Work place", sub: ["Company/Factory/Office"], count: 0 }
];


/**
 * Return the labels of the chart
 */
function getLabels() {
    let labels = [];
    categories.forEach(function (c) {
        labels.push(c.label);
    })
    return labels;
}


/**
 * Returns the percentage of
 * @param {*} value
 * @param {Array<JSON>} data 
 */
function getPercentage(value, data) {
    let local = JSON.parse(JSON.stringify(data));   // deep copy of JSON array
    let sum = 0;
    local.forEach(function (d) {
        sum += d.count;
    })
    return Math.floor((value/sum)*100);
}


/**
 * Count occurences in data
 * @param {Array<JSON>} data 
 */
function countOccurences(data) {
    let local = JSON.parse(JSON.stringify(data));   
    local.forEach(function (d) {
        let place = d.Place_Type;
        categories.forEach(function (c) {
            if (c['sub'].includes(place)) {
                c['count'] += 1;

            }
        });
    });
    return JSON.parse(JSON.stringify(categories));
}


/**
 * Generate a color domain for the donut chart
 * @param {Array<String>} scheme color scheme of the chart
 * @param {Array<String>} domain labels of the chart
 */
function generateColors(scheme, domain) {
    let color = d3.scale.ordinal()
        .domain(domain)
        .range(scheme);
    return color;
}



