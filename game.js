let turn = 1, posList = [], mark = new Map();

function config(){
    for(let i = 0; i < 9; i++){
        let cell = document.getElementById(i);
        let coord = cell.getBoundingClientRect();
   
        posList.push([coord.left, coord.top, i]);
    }
    board.addEventListener("click", play);
}

function play(event){
    let x = event.clientX;
    let y = event.clientY;
    let cell = 0;

    for(let i = 0; i < posList.length; i++){
        let cx = posList[i][0];
        let cy = posList[i][1];
        let id = posList[i][2];
        
        if(cx <= x && x <= cx + 200 && cy <= y && y <= cy + 200 && mark[id] == undefined){
            cell = document.getElementById(id);
            
            mark[id] = !turn + 1;
            posList.splice(i, 1);
            break;
        }
    }
    
    if(!cell){
        return;
    }
    
    board.removeEventListener("click", play);
    flag = 1;
    
    if(turn){
        drawX(cell);
    }
    else{
        drawZero(cell);
    }
    
    let iswnr = is_winner();
    
    if(iswnr[0] != undefined){
        drawWinLine(iswnr[0], iswnr[1]);
    }
    else if(is_tie()){
        final();
    }
}

function to_id(i, j){
    return (i - 1) * 3 + j - 1;
}

function is_tie(){
    for(let i = 0; i < 9; i++){
        if(mark[i] == undefined){
            return 0;
        }
    }
    return 1;
}

function is_winner(){
    for(let i = 1; i <= 3; i++){
        let cnt = 0;
        
        for(let j = 1; j <= 3; j++){
            cnt += mark[to_id(i, j)];    
        }
        
        if(cnt == 3 || cnt == 6){
            return [(i - 1) * 3 + 1, i * 3];
        }
    }
    for(let i = 1; i <= 3; i++){
        let cnt = 0;
        
        for(let j = 1; j <= 3; j++){
            cnt += mark[to_id(j, i)];    
        }
        
        if(cnt == 3 || cnt == 6){
            return [i, i + 6];
        }
    }
    
    let d1 = mark[0] + mark[4] + mark[8];
    let d2 = mark[2] + mark[4] + mark[6];
    
    if(d1 == 3 || d1 == 6){
        return [1, 9];
    }
    if(d2 == 3 || d2 == 6){
        return [3, 7];
    }
    
    return 0;
}

window.addEventListener("load", config);