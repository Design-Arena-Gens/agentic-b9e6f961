(function(){
  const cells = Array.from(document.querySelectorAll('.cell'));
  const statusText = document.getElementById('statusText');
  const newGameBtn = document.getElementById('newGameBtn');
  const resetScoreBtn = document.getElementById('resetScoreBtn');
  const scoreXEl = document.getElementById('scoreX');
  const scoreOEl = document.getElementById('scoreO');
  const scoreTiesEl = document.getElementById('scoreTies');

  const WIN_LINES = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];

  const STORAGE_KEY = 'ttt_score_v1';
  let board = Array(9).fill(null);
  let current = 'X';
  let ended = false;
  let score = loadScore();

  function loadScore(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return { X:0, O:0, T:0 };
      const parsed = JSON.parse(raw);
      return { X:parsed.X|0, O:parsed.O|0, T:parsed.T|0 };
    }catch{ return { X:0, O:0, T:0 }; }
  }
  function saveScore(){
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(score)); }catch{}
  }
  function renderScore(){
    scoreXEl.textContent = String(score.X);
    scoreOEl.textContent = String(score.O);
    scoreTiesEl.textContent = String(score.T);
  }

  function setStatus(text){ statusText.textContent = text; }

  function startNewGame(){
    board = Array(9).fill(null);
    current = 'X';
    ended = false;
    cells.forEach(c => {
      c.textContent = '';
      c.classList.remove('x','o','win');
      c.disabled = false;
      c.setAttribute('aria-label', c.getAttribute('aria-label').replace(/: .*$/, ''));
    });
    setStatus("X's turn");
  }

  function endGame(result){
    ended = true;
    cells.forEach(c => c.disabled = true);
    if(result === 'X' || result === 'O'){
      setStatus(result + ' wins!');
      score[result] += 1;
    } else {
      setStatus('Tie game.');
      score.T += 1;
    }
    renderScore();
    saveScore();
  }

  function checkWinner(){
    for(const [a,b,c] of WIN_LINES){
      const va = board[a], vb = board[b], vc = board[c];
      if(va && va===vb && vb===vc){
        cells[a].classList.add('win');
        cells[b].classList.add('win');
        cells[c].classList.add('win');
        return va; // 'X' or 'O'
      }
    }
    if(board.every(v => v)) return 'T'; // tie
    return null;
  }

  function handleClick(e){
    if(ended) return;
    const idx = Number(e.currentTarget.dataset.index);
    if(board[idx]) return;

    board[idx] = current;
    e.currentTarget.textContent = current;
    e.currentTarget.classList.add(current.toLowerCase());
    e.currentTarget.setAttribute('aria-label', `Cell ${idx+1}: ${current}`);

    const res = checkWinner();
    if(res){ return endGame(res); }

    current = current === 'X' ? 'O' : 'X';
    setStatus(`${current}'s turn`);
  }

  function resetScore(){
    score = { X:0, O:0, T:0 };
    saveScore();
    renderScore();
  }

  // Init
  renderScore();
  setStatus("X's turn");
  cells.forEach(c => c.addEventListener('click', handleClick));
  newGameBtn.addEventListener('click', startNewGame);
  resetScoreBtn.addEventListener('click', resetScore);
})();
