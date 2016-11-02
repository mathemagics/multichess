
// CASTLING -  need to check under attack sqs
// PAWN PROMOTION
// STALEMATE

//REFACTOR
// chang Castling code to use a function to move rook
// promotion waiting is ugly. chang it!

var board = [];
var table;
var cover;

var checkmate=false;
var turn="white";
var check;
var promoting=false;

var availMoves=[];

var thisPiece;
var pRow;
var pCol;
var sRow;
var sCol;

var lastMove;

function movePiece () {

  // checking if castle
  if(thisPiece.constructor.name==="King" && thisPiece.initial){
      // checking which rook to swap
      if(sRow===0 && sCol===6){
        board[0][5]=board[0][7];
        board[0][7]=null;
        table.rows[0].cells[5].innerHTML = board[0][5].code;
        table.rows[0].cells[7].innerHTML ="";
      } else if(sRow===0 && sCol===2) {
        board[0][3]=board[0][0];
        board[0][0]=null;
        table.rows[0].cells[3].innerHTML = board[0][3].code;
        table.rows[0].cells[0].innerHTML ="";
      } else if(sRow===7 && sCol===6) {
        board[7][5]=board[7][7];
        board[7][7]=null;
        table.rows[7].cells[5].innerHTML = board[7][5].code;
        table.rows[7].cells[7].innerHTML ="";
      } else if(sRow===7 && sCol===2) {
        board[7][3]=board[7][0];
        board[7][0]=null;
        table.rows[7].cells[3].innerHTML = board[7][3].code;
        table.rows[7].cells[0].innerHTML ="";
      }
  }
  else if (thisPiece.constructor.name==="Pawn") {

    // setting promotion:
    if(sRow==7 || sRow==0) {
      setPromotion();
      return;

    } else if(Math.abs(pCol-sCol)==1 && !board[sRow][sCol]) {
      // removing attacked piece through en passant
      table.rows[pRow].cells[sCol].innerHTML ="";
    }

  }
  // setting real board
  board[sRow][sCol]=board[pRow][pCol];
  board[pRow][pCol]=null;
  //setting html board
  table.rows[sRow].cells[sCol].innerHTML = thisPiece.code;
  table.rows[pRow].cells[pCol].innerHTML ="";
  lastMove = {piece: thisPiece.constructor.name, pRow: pRow, pCol: pCol, sRow: sRow, sCol: sCol}
}

function checkCheck() {
   var movesArr = board[sRow][sCol].movement(sRow,sCol);
   for(var i=0,n=movesArr.length;i<n;i++) {
     atkd=board[movesArr[i][0]][movesArr[i][1]];
     if(atkd && atkd instanceof King && atkd.color!=thisPiece.color){
       console.log("CHECK!");
         return true;
     }
   }
}

// returns true if current move removes check
// thisPiece is attacking piece from prow,pcol to srow,scol
function removeCheck() {

  var takenSpot=board[sRow][sCol]
  board[sRow][sCol]=board[pRow][pCol];
  board[pRow][pCol]=null;

  for(var i = 0;i<8;i++){
    for(var j = 0;j<8;j++){
      // getting enemy pieces
      var atkr=board[i][j];
      if(atkr && atkr.color!=thisPiece.color) {
        var movesArr=atkr.movement(i,j);
        // checking if our king is in their movelist
        for(var k=0,n=movesArr.length;k<n;k++) {
          var atkd=board[movesArr[k][0]][movesArr[k][1]];

          if(atkd && atkd instanceof King && atkd.color===thisPiece.color){
            console.log("still in check");
            board[pRow][pCol]=board[sRow][sCol];
            board[sRow][sCol]=takenSpot;
            return false;
          }
        }
      }
    }
  }
  board[pRow][pCol]=board[sRow][sCol];
  board[sRow][sCol]=takenSpot;
  return true;
}

// after making a move that checks the enemy king.
// we look to see if the enemy has an available move to remove checks
// before switching turns
function checkCheckmate() {

  for(var i = 0;i<8;i++){
    for(var j = 0;j<8;j++){
      // getting enemy pieces
      thisPiece=board[i][j];
      if(thisPiece && thisPiece.color!=turn) {

        var movesArr=thisPiece.movement(i,j);
        for(var k=0,n=movesArr.length;k<n;k++) {
          pRow=i;
          pCol=j;
          sRow=movesArr[k][0];
          sCol=movesArr[k][1];
          if(removeCheck()){return false;}
        }
      }
    }
  }
  return true;
}

function startBoard() {

  for ( var i = 0; i < 8; i++ ) {
      board[i] = [];
  }

  for (var i=0;i<8;i++) {
      board[1][i]=new Pawn("white");
      board[6][i]= new Pawn("black");
  }
  board[0][0]=new Rook("white");
  board[0][1]=new Knight("white");
  board[0][2]=new Bishop("white");
  board[0][3]=new Queen("white");
  board[0][4]=new King("white");
  board[0][5]=new Bishop("white");
  board[0][6]=new Knight("white");
  board[0][7]=new Rook("white");
  board[7][0]=new Rook("black");
  board[7][1]=new Knight("black");
  board[7][2]=new Bishop("black");
  board[7][3]=new Queen("black");
  board[7][4]=new King("black");
  board[7][5]=new Bishop("black");
  board[7][6]=new Knight("black");
  board[7][7]=new Rook("black");

  return board;

}

function drawBoard() {
  table = document.getElementById("chessboard");
  if (table != null) {
    for (var i = 0; i < table.rows.length; i++) {
        for (var j = 0; j < table.rows[i].cells.length; j++)
        if (board[i][j]) {
          unicode=board[i][j].code;
        table.rows[i].cells[j].innerHTML += unicode;
      }
    }
  }
}

function setPromotion() {
  promoting=true;
  cover=document.getElementById("cover");
  cover.style.display="block";
  var queen = document.getElementById("queen")
  queen.onclick = function () {
    promote(this.id);
  }
  document.getElementById("knight").onclick = function () {
    promote(this.id);
  }
  document.getElementById("bishop").onclick = function () {
    promote(this.id);
  }
  document.getElementById("rook").onclick = function () {
    promote(this.id);
  }
}

function promote(id) {
  var promoted
  switch(id) {
    case "queen":
      promoted=new Queen(turn)
    break;
    case "rook":
      promoted=new Rook(turn);
    break;
    case "bishop":
      promoted=new Bishop(turn);
    break;
    case "knight":
      promoted=new Knight(turn);
    break;
    default:
    break;
  }
  board[sRow][sCol]=promoted
  board[pRow][pCol]=null;
  table.rows[sRow].cells[sCol].innerHTML = promoted.code
  table.rows[pRow].cells[pCol].innerHTML ="";
  cover.style.display="none";
  promoting=false;
  if(checkCheck()){
    check=true;
    if (checkCheckmate()) {
      endGame();
    };
  }
  reset();

}

function setClick() {
    table = document.getElementById("chessboard");

    if (table != null) {
        for (var i = 0; i < table.rows.length; i++) {
            for (var j = 0; j < table.rows[i].cells.length; j++)
            table.rows[i].cells[j].onclick = function () {
                getMoves(this);
            }
        }
    }
}

function getMoves(tableCell) {

  //setting selected piece
  sRow=tableCell.parentNode.rowIndex;
  sCol=tableCell.cellIndex;

  //  if clicked square is not in availMoves, set new availMoves
  if (!isCoordInArr([sRow,sCol],availMoves)) {

    if(pRow || pRow===0){
      resetColors(pRow, pCol);
    }
    // choosing your own piece
    if(( thisPiece=board[sRow][sCol]) && thisPiece.color===turn ) {
      setColors(sRow,sCol);
    }
    //setting previous position
    pRow=sRow;
    pCol=sCol;

  } else {

    resetColors(pRow,pCol);
    if(!check || removeCheck()) {
      movePiece();
      if(!promoting){
        if(checkCheck()){
          check=true;
          if (checkCheckmate()){
            endGame();
          }
        }
        reset();
      }
    }
  }
}

// set the bg color of possible attacks from the piece at row,col
function setColors(row,col) {

  if (board[row][col]){
  table.rows[row].cells[col].style.background="green"
  availMoves=thisPiece.movement(row,col)
    for(var i=0, n=availMoves.length;i<n;i++) {
      table.rows[availMoves[i][0]].cells[availMoves[i][1]].style.background="#00cc99"
    }
  }
}
// resets ths bg color of the previous selection
function resetColors(resetRow,resetCol) {
  var resetCell=table.rows[resetRow].cells[resetCol];
  resetCell.style.background=resetCell.className==="whitesq"? "#F0D9C2": "#C98F55"
  for(var i=0, n=availMoves.length;i<n;i++) {
    resetCell=table.rows[availMoves[i][0]].cells[availMoves[i][1]];
    resetCell.style.background=resetCell.className==="whitesq"? "#F0D9C2": "#C98F55"
  }
}

function isCoordInArr(coord,arr) {
  for (var i = 0, n=arr.length; i < n ; i++) {
    if (arr[i][0] == coord[0] && arr[i][1] == coord[1]) {
      return true;
    }
  }
  return false;

}

function reset() {
  availMoves=[];
  thisPiece.initial=false;
  thisPiece=null;
  turn = turn=="white" ? "black" : "white"
}

function endGame() {
  var endCover = document.getElementById("checkmate");
  endCover.style.display="block";

}

startBoard();
drawBoard();
setClick();
