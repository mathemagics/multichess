
class Piece {
    constructor(color){
      this.possible_moves=[];
      this.color=color;
      this.initial = true;
    }
    isOnBoard(move){
       return move[0]>=0 && move[0]<8 && move[1]>=0 && move[1]<8;
    }
    isNotTeammate(move ,piece) {
          return !this.isTeammate(move,piece)
      }
    isTeammate(move ,piece) {
        var r1=move[0];
        var c1=move[1];
        return (board[r1][c1] && board[r1][c1].color==this.color);
    }
    isEnemy(move, piece) {
      var r1=move[0];
      var c1=move[1];
      return (board[r1][c1] && board[r1][c1].color!=this.color);
    }
    // checks if given square is ccoupied by enemy, friend, or empty and
    //  adds to array as necessary. return true if path blocked.
    checkSquare(row,col,possible_moves) {
      var blocked=true;
      if (this.isTeammate([row,col])) {

      } else if (this.isEnemy([row,col])) {
        this.possible_moves.push([row,col]);

      } else {
        this.possible_moves.push([row,col]);
        blocked=false
      }
      return blocked

    }

}
class Pawn extends Piece  {
  constructor(color){
    super(color);
    this.code = color=="white" ? "&#9817" : "&#9823"
  }

  movement(row1,col1) {

    this.possible_moves=[];

    if (this.color=="white") {
      // checking space in front
      if(row1+1<8 && !board[row1+1][col1]) {
        this.possible_moves.push([row1+1,col1]);
        // checking 2 spaces in front
        if(row1===1 && !board[row1+2][col1]) {
          this.possible_moves.push([row1+2,col1]);
        }
      }
      //  checking attacking squares
      if (row1+1<8 && col1-1>=0){
        if((board[row1+1][col1-1] && board[row1+1][col1-1].color!=this.color) || (this.checkEnpassant()==col1-1 && row1+1==5)){
          this.possible_moves.push([row1+1,col1-1]);
        }
      }
      if (row1+1<8 && col1+1<8){
        if((board[row1+1][col1+1] && board[row1+1][col1+1].color!=this.color) || (this.checkEnpassant()==col1+1 && row1+1==5)){
          this.possible_moves.push([row1+1,col1+1]);
        }
      }
    } else if (this.color=="black") {
      // checking space in front
      if(row1-1>=0 && !board[row1-1][col1]) {
        this.possible_moves.push([row1-1,col1]);
        // checking 2 spaces in front
        if(row1===6 && !board[row1-2][col1]) {
          this.possible_moves.push([row1-2,col1]);
        }
      }
      //  checking attacking squares
      if (row1-1>=0 && col1-1>=0){
        if((board[row1-1][col1-1] && board[row1-1][col1-1].color!=this.color) || (this.checkEnpassant()==col1-1 && row1-1==2)) {
          this.possible_moves.push([row1-1,col1-1]);
        }
      }
      if (row1-1>=0 && col1+1<8){
        if((board[row1-1][col1+1] && board[row1-1][col1+1].color!=this.color) || (this.checkEnpassant()==col1+1 && row1-1==2)){
          this.possible_moves.push([row1-1,col1+1]);
        }
      }
    }
    return this.possible_moves;
  }
  // if last move was enpassant, returns the column. else returns "no""
  checkEnpassant() {
    if(lastMove){
      if(lastMove.piece=="Pawn"){
        if(turn=="white") {
          if (lastMove.pRow==6 && lastMove.sRow==4) {
            return lastMove.pCol;
          }
        }
        else if (turn=="black") {
          if (lastMove.pRow==1 && lastMove.sRow==3) {
            return lastMove.pCol;
          }
        }
      }
    }
    return "no"
  }

}

class Knight extends Piece{

  constructor(color){
    super(color);
    this.code = color=="white" ? "&#9816" : "&#9822"
  }

  movement(row1, col1) {

  this.possible_moves = [[row1+1,col1+2],[row1-1,col1+2],
  [row1+2,col1+1],[row1-2,col1+1],
  [row1+1,col1-2],[row1-1,col1-2],
  [row1+2,col1-1],[row1-2,col1-1]];

  // removing moves that go off board
  this.possible_moves = this.possible_moves.filter(this.isOnBoard);
  // removing moves with teammates, 2nd arg: sets 'this' in callback
  this.possible_moves = this.possible_moves.filter(this.isNotTeammate,this);

  return this.possible_moves;
  }
}
class Bishop extends Piece {

  constructor(color){
  super(color);
  this.code = color=="white" ? "&#9815" : "&#9821"
  }

  movement(row1, col1) {
    this.possible_moves = [];
    var row=row1-1;
    var col=col1-1;
    while (row>=0 && col>=0) {
     if(this.checkSquare(row,col)){break;}
     row-=1;
     col-=1;
    }

    row=row1-1;
    col=col1+1;
    while (row>=0 && col<8) {
      if(this.checkSquare(row,col)){break;}
      row-=1;
      col+=1;
    }

    row=row1+1;
    col=col1-1;
    while (row<8 && col>=0) {
      if(this.checkSquare(row,col)){break;}
      row+=1;
      col-=1;
    }
    row=row1+1;
    col=col1+1;
    while (row<8 && col<8) {
      if(this.checkSquare(row,col)){break;}
      row+=1;
      col+=1;
    }

    return this.possible_moves;
  }
}
class Queen extends Piece{
  constructor(color){
  super(color);
  this.code = color=="white" ? "&#9813" : "&#9819"

  }
  movement(row1,col1) {
    this.possible_moves = [];
    var row=row1-1;
    var col=col1-1;
    while (row>=0 && col>=0) {
     if(this.checkSquare(row,col)){break;}
     row-=1;
     col-=1;
    }

    row=row1-1;
    col=col1+1;
    while (row>=0 && col<8) {
      if(this.checkSquare(row,col)){break;}
      row-=1;
      col+=1;
    }

    row=row1+1;
    col=col1-1;
    while (row<8 && col>=0) {
      if(this.checkSquare(row,col)){break;}
      row+=1;
      col-=1;
    }
    row=row1+1;
    col=col1+1;
    while (row<8 && col<8) {
      if(this.checkSquare(row,col)){break;}
      row+=1;
      col+=1;
    }
    var r1=row1+1;
    while(r1<8) {
      if (this.checkSquare(r1,col1)){ break;}
      r1+=1;
    }
    r1=row1-1;
    while(r1>=0) {
      if (this.checkSquare(r1,col1)){ break;}
      r1-=1;
    }
    var c1=col1+1;
    while(c1<8) {
      if (this.checkSquare(row1,c1)){ break;}
      c1+=1;
    }
    c1=col1-1;
    while(c1>=0) {
      if (this.checkSquare(row1,c1)){ break;}
      c1-=1;
    }
    return this.possible_moves;

  }
}
class King extends Piece{
  constructor(color){
  super(color);
  this.code = color=="white" ? "&#9812" : "&#9818"
  }
  movement(row1,col1){
    this.possible_moves =[[row1+1,col1-1],[row1+1,col1],[row1+1,col1+1],
    [row1,col1-1],[row1,col1+1],
    [row1-1,col1-1],[row1-1,col1],[row1-1,col1+1]];

  // removing moves that go off the board
  this.possible_moves = this.possible_moves.filter(this.isOnBoard);
  // removing moves with teammates, 2nd arg: sets 'this' in callback
  this.possible_moves = this.possible_moves.filter(this.isNotTeammate,this);
  // removing moves that are under attack
  this.possible_moves = this.possible_moves.filter(this.isNotUnderAttack, this);

  // adding castling moves
  if (this.initial) {
    if(this.color==="white"){
      // kingside
      if(board[0][7] && board[0][7].initial && !board[0][6] && !board[0][5]) {
        this.possible_moves.push([0,6]);
      }
      // queenside
      if(board[0][0] && board[0][0].initial && !board[0][1] && !board[0][2] && !board[0][3]){
        this.possible_moves.push([0,2]);
      }
    } else if (this.color==="black") {
      // kingside
      if(board[7][7] && board[7][7].initial && !board[7][6] && !board[7][5]) {
        this.possible_moves.push([7,6]);
      }
      // queenside
      if(board[7][0] && board[7][0].initial && !board[7][1] && !board[7][2] && !board[7][3]){
        this.possible_moves.push([7,2]);
      }
    }
  }

  return this.possible_moves;
  }

  //returns true if a given square is under attack
  isNotUnderAttack(move) {
    //for all oponent pieces, check if this sq is in their movelist
    for(var i=0;i<8;i++){
      for(var j=0;j<8;j++) {
        if(board[i][j] && board[i][j].color!=this.color) {

          if(board[i][j] instanceof King) {
            // check to see if in range of enemy king

          } else if(isCoordInArr([move[0],move[1]], board[i][j].movement(i,j))){

              return false;
            }
        }
      }
    }
    return true;
  }

}
class Rook extends Piece{
  constructor(color){
  super(color);
  this.code = color=="white" ? "&#9814" : "&#9820"
  }

  movement (row1, col1) {
    this.possible_moves=[]
    var r1=row1+1;
    while(r1<8) {
      if (this.checkSquare(r1,col1)){ break;}
      r1+=1;
    }
    r1=row1-1;
    while(r1>=0) {
      if (this.checkSquare(r1,col1)){ break;}
      r1-=1;
    }
    var c1=col1+1;
    while(c1<8) {
      if (this.checkSquare(row1,c1)){ break;}
      c1+=1;
    }
    c1=col1-1;
    while(c1>=0) {
      if (this.checkSquare(row1,c1)){ break;}
      c1-=1;
    }
    return this.possible_moves;
  }


}
