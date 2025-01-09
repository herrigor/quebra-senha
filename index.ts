enum Color {
  RED,
  BLUE,
  GREEN,
  PINK,
  ORANGE,
}
type Combination = [Color, Color, Color, Color];

const Palette = {
  [Color.RED]: "#e8112e",
  [Color.BLUE]: "#1140b6",
  [Color.GREEN]: "#30c043",
  [Color.PINK]: "#e91695",
  [Color.ORANGE]: "#ef8c1a",
};

enum DecodeHint {
  NONE,
  WHITE,
  BLACK,
}
type Result = [DecodeHint, DecodeHint, DecodeHint, DecodeHint];

interface Attempt {
  guess: Combination;
  result: Result;
}

type EndGame = "WIN" | "LOSE" | null;

interface Board {
  SECRET: Combination;
  attempts: Attempt[];
  limit: number;
  endgame?: EndGame;
}

const SECRET: Combination = [Color.RED, Color.GREEN, Color.GREEN, Color.PINK];
const board: Board = {
  SECRET,
  attempts: [],
  limit: 2,
};

const checkLimit = (): boolean => board.attempts.length >= board.limit;
const checkEndGame = (result: Result, maxAttempts?: boolean): EndGame => {
  const secretIsBroken = result?.every((value) => value === DecodeHint.BLACK);
  return maxAttempts ? "LOSE" : secretIsBroken ? "WIN" : null;
};
const loseGame = (lastResult: Result) => checkEndGame(lastResult, true);

const hintMapper = (position: Color, hint: Color): DecodeHint => {
  switch (true) {
    case position === hint:
      return DecodeHint.BLACK;
    case board.SECRET.includes(hint):
      return DecodeHint.WHITE;
    default:
      return DecodeHint.NONE;
  }
};
const scrambleResults = (result: Result): Result => {
  return [...result].sort(() => Math.random() - 0.5) as Result;
};

const makeAttempt = (guess: Combination): Attempt | void => {
  const maxAttempts = checkLimit();
  if (maxAttempts) {
    const lastResult = board.attempts[board.attempts.length - 1].result;
    board.endgame = loseGame(lastResult);
    return;
  }

  const result: Result = guess.map((hint, i) =>
    hintMapper(board.SECRET[i], hint)
  ) as Result;

  board.attempts.push({
    guess,
    result: scrambleResults(result),
  });

  board.endgame = checkEndGame(result);
};

const guess: Combination = [Color.RED, Color.GREEN, Color.PINK, Color.ORANGE];
const correctGuess: Combination = [
  Color.RED,
  Color.GREEN,
  Color.GREEN,
  Color.PINK,
];

makeAttempt(guess);
makeAttempt(guess);
makeAttempt(correctGuess);
console.log(board);
