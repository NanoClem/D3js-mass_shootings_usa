// create a csv 
// state  / number total of killed
// in order to color the map

// maj +f5


function reducevalue(value){
    
    if (value < 50){
        value = 0;
    }else if(value < 100){
        value = 1;
    }else if(value < 150){
        value = 2;
    }else{
        value = 3;
    }
    return value
}

 

