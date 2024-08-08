import java.util.Scanner;
class Tictactoe {
  public static void main(String[] args) {
    char[][] board = new char[3][3];
    for (int r = 0; r < board.length; r++) {
      for (int c = 0; c < board[r].length; c++) {
        board[r][c] = ' ';
      }
    }

    char player = 'X';
    Scanner sc = new Scanner(System.in);
    int count=0;

    while (count<9) {
      printBoard(board);
      System.out.print("Player " + player + " enter: ");
      int r = sc.nextInt();
      int c = sc.nextInt();
      System.out.println();

      if (board[r][c] == ' ') {
        board[r][c] = player; // place the element
        if (haveWon(board, player)) {
          System.out.println("Player " + player + " has won: ");
          break;
        }
        else if(count==9){
          System.out.println("draw");
        }
        else {
          count++;
          player = (player == 'X') ? 'O' : 'X';
          continue;
        }
      } else {
        System.out.println("Invalid move. Try again!");
      }
    }
    printBoard(board);
  }

  public static boolean haveWon(char[][] board, char player) {
    for (int r = 0; r < board.length; r++) {
      if (board[r][0] == player && board[r][1] == player && board[r][2] == player) {
        return true;
      }
    }

    for (int c = 0; c < board[0].length; c++) {
      if (board[0][c] == player && board[1][c] == player && board[2][c] == player) {
        return true;
      }
    }

    if (board[0][0] == player && board[1][1] == player && board[2][2] == player) {
        return true;
      }
  
      if (board[0][2] == player && board[1][1] == player && board[2][0] == player) {
        return true;
      }
      return false;
    }

  
    public static void printBoard(char[][] board) {
      for (int r = 0; r < board.length; r++) {
        for (int c = 0; c < board[r].length; c++) {
          System.out.print(board[r][c] + " | ");
        }
        System.out.println();
      }
    }
  }
