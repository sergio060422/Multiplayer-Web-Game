const client = io();
let clientId, flag = 0;

client.on('startGame', (players) => {
    let joining = document.getElementById("joining");
    let h1 = document.getElementById("h1"); 
    
    gameContainer.style.opacity = board.style.opacity = "1";
    joining.style.display = "none";
    
    clientId = client.id;
    
    if(players[clientId].number == 2){
        board.removeEventListener("click", play);
        h1.textContent = "Player 2";
        turn = 0;
    }
    h1.style.display = "block";
})

client.on('playTurn', (game) => {
    for(let i = 0; i < 9; i++){
        let cell = document.getElementById(i); 
            
        if(game[i] == 1){
            drawX(cell);
            mark[i] = 1;
        }
        if(game[i] == 2){
            drawZero(cell);
            mark[i] = 2;
        }
    }
    
    let iswner = is_winner();
    
    if(iswner[0] != undefined){
        turn = !turn;
        drawWinLine(iswner[0], iswner[1]);
    }
    else{
        board.addEventListener("click", play);
    }
})

let gameContainer, board;

function assign(){
    gameContainer = document.getElementById("gameContainer");
    board = document.getElementById("board");
    
    createBoard();
}

function drawX(element){
    let canvas = element.getContext("2d");
    
    canvas.lineWidth = 10;
    canvas.lineCap = "round";
    canvas.strokeStyle = "red";
    
    canvas.beginPath();
    canvas.moveTo(30, 30);
    canvas.lineTo(170, 170);
    canvas.moveTo(170, 30);
    canvas.lineTo(30, 170);
    canvas.stroke();
    
    if(flag){
        flag = 0;
        client.emit('sendTurn', mark);    
    }
}

function drawZero(element){
    let canvas = element.getContext("2d");
    
    canvas.lineWidth = 10;
    canvas.lineCap = "round";
    canvas.strokeStyle = "blue";
    
    canvas.beginPath();
    canvas.arc(100, 100, 80, 0, Math.PI * 2, false);
    canvas.stroke();
    
    if(flag){
        flag = 0;
        client.emit('sendTurn', mark);   
    }
}

function drawBoardLine(){
    let canvas = board.getContext("2d");
    
    canvas.lineWidth = 10;
    canvas.lineCap = "round";
    
    canvas.beginPath();
    canvas.moveTo(10, 205);
    canvas.lineTo(610, 205);
    canvas.moveTo(10, 415);
    canvas.lineTo(610, 415);
    canvas.moveTo(205, 10);
    canvas.lineTo(205, 610);
    canvas.moveTo(415, 10);
    canvas.lineTo(415, 610);
    canvas.stroke();
}

function drawWinLine(start, end){
    let canvas = board.getContext("2d");
    
    canvas.lineWidth = 10;
    canvas.lineCap = "round";

    canvas.beginPath();
    
    if(start == 1 && end == 3){
        canvas.moveTo(10, 100);
        canvas.lineTo(610, 100);
    }
    if(start == 4 && end == 6){
        canvas.moveTo(10, 310);
        canvas.lineTo(610, 310);
    }
    if(start == 7 && end == 9){
        canvas.moveTo(10, 520);
        canvas.lineTo(610, 520);
    }
    
    if(start == 1 && end == 7){
        canvas.moveTo(100, 10);
        canvas.lineTo(100, 610);
    }
    if(start == 2 && end == 8){
        canvas.moveTo(310, 10);
        canvas.lineTo(310, 610);
    }
    if(start == 3 && end == 9){
        canvas.moveTo(520, 10);
        canvas.lineTo(520, 610);
    }
    
    if(start == 1 && end == 9){
        canvas.moveTo(10, 10);
        canvas.lineTo(610, 610);
    }
    if(start == 3 && end == 7){
        canvas.moveTo(610, 10);
        canvas.lineTo(10, 610);
    }
    
    canvas.stroke();
    
    let endgame = document.getElementById("endgame");
    
    if(!turn){
        endgame.textContent = "Player 2 Wins!";
    }
    
    gameContainer.style.opacity = "0.2";
    board.style.opacity = "0.2";
    endgame.style.display = "block";
    
    setTimeout(() => {
        window.location.reload();
    }, 1800);
}

function createBoard(){
    for(let i = 0; i < 9; i++){
        let cell = document.createElement("canvas");
        
        cell.className = "cell";
        cell.id = i;
        cell.width = 200;
        cell.height = 200;
        gameContainer.appendChild(cell);
    }
    
    for(let i = 0; i < 3; i++){
        let cell = document.getElementById(i);
        
        cell.style.gridColumnStart = i;
        cell.style.gridColumnEnd = i + 1;
    }
    
    drawBoardLine();
}

window.addEventListener("load", assign);

