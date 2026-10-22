/**
 * Windows 10 Standard Calculator Application
 */

class CalculatorApp {
  static open() {
    const winId = 'calc_' + Math.random().toString(36).substring(2, 7);
    const win = window.WinWindowManager.openWindow({
      id: winId,
      title: 'Calculator',
      icon: 'calculator',
      width: 320,
      height: 490,
      minWidth: 300,
      minHeight: 440,
      content: ''
    });

    const instance = new CalculatorApp(win);
    instance.render();
    return instance;
  }

  constructor(winData) {
    this.winData = winData;
    this.displayVal = '0';
    this.prevVal = null;
    this.operation = null;
    this.clearOnNext = false;
    this.historyText = '';
  }

  render() {
    const body = this.winData.element.querySelector('.win-body');
    body.innerHTML = `
      <div class="calc-container">
        <!-- Header -->
        <div class="calc-header">
          <span class="calc-mode-title">STANDARD</span>
        </div>

        <!-- Display -->
        <div class="calc-display-area">
          <div class="calc-history" id="calc-history-view">${this.historyText}</div>
          <div class="calc-result" id="calc-result-view">${this.formatDisplay(this.displayVal)}</div>
        </div>

        <!-- Memory Row -->
        <div class="calc-memory-row">
          <button class="calc-mem-btn disabled">MC</button>
          <button class="calc-mem-btn disabled">MR</button>
          <button class="calc-mem-btn">M+</button>
          <button class="calc-mem-btn">M-</button>
          <button class="calc-mem-btn">MS</button>
        </div>

        <!-- Buttons Keypad -->
        <div class="calc-keypad">
          <button class="calc-btn op-btn" data-action="percent">%</button>
          <button class="calc-btn op-btn" data-action="ce">CE</button>
          <button class="calc-btn op-btn" data-action="c">C</button>
          <button class="calc-btn op-btn" data-action="backspace">⌫</button>

          <button class="calc-btn op-btn" data-action="reciprocal">1/x</button>
          <button class="calc-btn op-btn" data-action="square">x²</button>
          <button class="calc-btn op-btn" data-action="sqrt">√x</button>
          <button class="calc-btn op-btn" data-action="divide">÷</button>

          <button class="calc-btn num-btn" data-num="7">7</button>
          <button class="calc-btn num-btn" data-num="8">8</button>
          <button class="calc-btn num-btn" data-num="9">9</button>
          <button class="calc-btn op-btn" data-action="multiply">×</button>

          <button class="calc-btn num-btn" data-num="4">4</button>
          <button class="calc-btn num-btn" data-num="5">5</button>
          <button class="calc-btn num-btn" data-num="6">6</button>
          <button class="calc-btn op-btn" data-action="subtract">−</button>

          <button class="calc-btn num-btn" data-num="1">1</button>
          <button class="calc-btn num-btn" data-num="2">2</button>
          <button class="calc-btn num-btn" data-num="3">3</button>
          <button class="calc-btn op-btn" data-action="add">+</button>

          <button class="calc-btn op-btn" data-action="negate">±</button>
          <button class="calc-btn num-btn" data-num="0">0</button>
          <button class="calc-btn num-btn" data-action="decimal">.</button>
          <button class="calc-btn equals-btn" data-action="equals">=</button>
        </div>
      </div>
    `;

    this.attachEvents(body);
  }

  formatDisplay(val) {
    if (val === 'Error') return 'Cannot divide by zero';
    if (val.length > 13) {
      const num = parseFloat(val);
      return isNaN(num) ? val : num.toPrecision(10);
    }
    return val;
  }

  updateDisplay() {
    const resView = this.winData.element.querySelector('#calc-result-view');
    const histView = this.winData.element.querySelector('#calc-history-view');
    if (resView) resView.textContent = this.formatDisplay(this.displayVal);
    if (histView) histView.textContent = this.historyText;
  }

  attachEvents(body) {
    body.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      const num = btn.dataset.num;
      const action = btn.dataset.action;

      if (num !== undefined) {
        this.inputDigit(num);
      } else if (action) {
        this.handleAction(action);
      }
      this.updateDisplay();
    });

    // Keyboard support when window is focused
    const handleKeyDown = (e) => {
      if (this.winData.element.classList.contains('win-active')) {
        if (/^[0-9]$/.test(e.key)) {
          this.inputDigit(e.key);
          this.updateDisplay();
        } else if (e.key === '.') {
          this.handleAction('decimal');
          this.updateDisplay();
        } else if (e.key === '+') {
          this.handleAction('add');
          this.updateDisplay();
        } else if (e.key === '-') {
          this.handleAction('subtract');
          this.updateDisplay();
        } else if (e.key === '*') {
          this.handleAction('multiply');
          this.updateDisplay();
        } else if (e.key === '/') {
          e.preventDefault();
          this.handleAction('divide');
          this.updateDisplay();
        } else if (e.key === 'Enter' || e.key === '=') {
          this.handleAction('equals');
          this.updateDisplay();
        } else if (e.key === 'Backspace') {
          this.handleAction('backspace');
          this.updateDisplay();
        } else if (e.key === 'Escape') {
          this.handleAction('c');
          this.updateDisplay();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    this.winData.options.onClose = () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }

  inputDigit(digit) {
    if (this.clearOnNext || this.displayVal === '0' || this.displayVal === 'Error') {
      this.displayVal = digit;
      this.clearOnNext = false;
    } else {
      if (this.displayVal.length < 14) {
        this.displayVal += digit;
      }
    }
  }

  handleAction(action) {
    switch (action) {
      case 'decimal':
        if (this.clearOnNext) {
          this.displayVal = '0.';
          this.clearOnNext = false;
        } else if (!this.displayVal.includes('.')) {
          this.displayVal += '.';
        }
        break;

      case 'backspace':
        if (this.displayVal !== 'Error' && !this.clearOnNext) {
          this.displayVal = this.displayVal.length > 1 ? this.displayVal.slice(0, -1) : '0';
        }
        break;

      case 'ce':
        this.displayVal = '0';
        break;

      case 'c':
        this.displayVal = '0';
        this.prevVal = null;
        this.operation = null;
        this.historyText = '';
        this.clearOnNext = false;
        break;

      case 'negate':
        if (this.displayVal !== '0' && this.displayVal !== 'Error') {
          this.displayVal = (parseFloat(this.displayVal) * -1).toString();
        }
        break;

      case 'sqrt':
        if (this.displayVal !== 'Error') {
          const v = parseFloat(this.displayVal);
          if (v < 0) {
            this.displayVal = 'Error';
          } else {
            this.historyText = `√(${this.displayVal})`;
            this.displayVal = Math.sqrt(v).toString();
            this.clearOnNext = true;
          }
        }
        break;

      case 'square':
        if (this.displayVal !== 'Error') {
          const v = parseFloat(this.displayVal);
          this.historyText = `sqr(${this.displayVal})`;
          this.displayVal = (v * v).toString();
          this.clearOnNext = true;
        }
        break;

      case 'reciprocal':
        if (this.displayVal !== 'Error') {
          const v = parseFloat(this.displayVal);
          if (v === 0) {
            this.displayVal = 'Error';
          } else {
            this.historyText = `1/(${this.displayVal})`;
            this.displayVal = (1 / v).toString();
            this.clearOnNext = true;
          }
        }
        break;

      case 'percent':
        if (this.displayVal !== 'Error') {
          const v = parseFloat(this.displayVal);
          this.displayVal = (v / 100).toString();
        }
        break;

      case 'add':
      case 'subtract':
      case 'multiply':
      case 'divide':
        this.applyOperator(action);
        break;

      case 'equals':
        if (this.operation && this.prevVal !== null) {
          const cur = parseFloat(this.displayVal);
          const prev = parseFloat(this.prevVal);
          let res = 0;

          if (this.operation === 'add') res = prev + cur;
          else if (this.operation === 'subtract') res = prev - cur;
          else if (this.operation === 'multiply') res = prev * cur;
          else if (this.operation === 'divide') {
            if (cur === 0) {
              this.displayVal = 'Error';
              this.historyText = '';
              this.operation = null;
              this.prevVal = null;
              return;
            }
            res = prev / cur;
          }

          this.historyText = `${this.prevVal} ${this.getOpSymbol(this.operation)} ${this.displayVal} =`;
          this.displayVal = (Math.round(res * 1000000000) / 1000000000).toString();
          this.prevVal = null;
          this.operation = null;
          this.clearOnNext = true;
        }
        break;
    }
  }

  applyOperator(op) {
    if (this.operation && !this.clearOnNext) {
      this.handleAction('equals');
    }
    this.prevVal = this.displayVal;
    this.operation = op;
    this.historyText = `${this.displayVal} ${this.getOpSymbol(op)}`;
    this.clearOnNext = true;
  }

  getOpSymbol(op) {
    switch (op) {
      case 'add': return '+';
      case 'subtract': return '−';
      case 'multiply': return '×';
      case 'divide': return '÷';
      default: return '';
    }
  }
}

window.CalculatorApp = CalculatorApp;
