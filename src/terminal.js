import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import 'xterm/css/xterm.css';

// CSS to remove the underline from links and add background glow
const style = document.createElement('style');
style.innerHTML = `
  .xterm a {
    text-decoration: none;
    border-bottom: none;
  }
  .xterm {
    box-shadow: 0 0 10px #f0f0f0;
  }
`;
document.head.appendChild(style);

const term = new Terminal({
  cursorBlink: true,
  fontSize: 16,
  fontFamily: 'Menlo, Monaco, "Courier New", monospace',
  theme: {
    background: '#000000',
    foreground: '#f0f0f0',
  }
});

function levenshteinDistance(a, b) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
          if (b.charAt(i - 1) == a.charAt(j - 1)) {
              matrix[i][j] = matrix[i - 1][j - 1];
          } else {
              matrix[i][j] = Math.min(
                  matrix[i - 1][j - 1] + 1,
                  matrix[i][j - 1] + 1,
                  matrix[i - 1][j] + 1
              );
          }
      }
  }

  return matrix[b.length][a.length];
}

function findClosestCommand(input) {
  const availableCommands = Object.keys(commands).concat(['clear', 'ls']);
  let closestMatch = '';
  let minDistance = Infinity;

  for (const cmd of availableCommands) {
      const distance = levenshteinDistance(input, cmd);
      if (distance < minDistance) {
          minDistance = distance;
          closestMatch = cmd;
      }
  }

  return minDistance <= input.length / 2 ? closestMatch : null;
}

const fitAddon = new FitAddon();

const linkMatcherOptions = {
  willLinkActivate: (e, uri) => {
    window.open(uri, '_blank');
    return false; // Prevent the default alert
  }
};
const webLinksAddon = new WebLinksAddon(undefined, undefined, linkMatcherOptions);

term.loadAddon(fitAddon);
term.loadAddon(webLinksAddon);

const terminalContainer = document.getElementById('terminal-container');
term.open(terminalContainer);
fitAddon.fit();

window.addEventListener('resize', () => fitAddon.fit());

const commands = {
  help: 'Type ls to see a list of available commands.',
  about: 'I am a passionate developer with experience in web technologies.',
  skills: 'JavaScript, React, Node.js, Python, SQL',
  projects: [
    { name: 'Portfolio Website', url: 'https://example.com/portfolio' },
    { name: 'E-commerce Platform', url: 'https://example.com/ecommerce' },
    { name: 'Task Management App', url: 'https://example.com/taskapp' }
  ],
};

const prompt = '> Visitor@Sablinova.com~$ ';

term.writeln('Welcome to my interactive portfolio terminal!');
term.writeln('Type "help" for available commands.');
term.write(prompt);

term.onKey(({ key, domEvent }) => {
  const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

  if (domEvent.keyCode === 13) { // Enter key
    const command = term.buffer.active.getLine(term.buffer.active.cursorY).translateToString().trim().replace(prompt, '');
    term.write('\r\n');
    executeCommand(command);
    term.write('\r\n' + prompt);
  } else if (domEvent.keyCode === 8) { // Backspace key
    if (term.buffer.active.cursorX > prompt.length) {
      term.write('\b \b');
    }
  } else if (printable) {
    term.write(key);
  }
});

function executeCommand(command) {
  const cmd = command.toLowerCase();

  switch(cmd) {
      case 'clear':
          term.clear();
          break;
      case 'ls':
          term.writeln('about.txt skills.txt projects.txt');
          break;
      case 'projects':
          commands.projects.forEach(project => {
              const url = project.url;
              const name = project.name;
              term.writeln(`\x1B]8;;${url}\x1B\\${name}\x1B]8;;\x1B\\`);
          });
          break;
      default:
          if (commands.hasOwnProperty(cmd)) {
              term.writeln(commands[cmd]);
          } else {
              const closestMatch = findClosestCommand(cmd);
              if (closestMatch) {
                  term.writeln(`Command not found: ${cmd}. Did you mean "${closestMatch}"?`);
              } else {
                  term.writeln(`Command not found: ${cmd}`);
              }
          }
  }
}

// Change header text every 10 seconds
const headerTexts = ["Terminal", "How are you?", "Welcome", "Hello there!"];
let headerIndex = 0;

setInterval(() => {
  headerIndex = (headerIndex + 1) % headerTexts.length;
  document.getElementById('terminal-title').textContent = headerTexts[headerIndex];
}, 5000);
