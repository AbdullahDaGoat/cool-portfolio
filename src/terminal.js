import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import 'xterm/css/xterm.css';
import axios from 'axios';

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

const fetchUserData = async () => {
  try {
    const response = await axios.get('https://ipapi.co/json/');
    const data = response.data;
    term.writeln(`IP Address: ${data.ip}`);
    term.writeln(`City: ${data.city}`);
    term.writeln(`Region: ${data.region}`);
    term.writeln(`Country: ${data.country_name}`);
    term.writeln(`Postal Code: ${data.postal}`);
    term.writeln(`Latitude: ${data.latitude}`);
    term.writeln(`Longitude: ${data.longitude}`);
    term.writeln(`Time Zone: ${data.timezone}`);
    term.writeln(`ISP: ${data.org}`);
    term.writeln(`System Information: ${navigator.userAgent}`);
  } catch (error) {
    term.writeln('Error fetching user data.');
  }
};

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
  // Hidden Easter egg commands
  happybday: () => {
    term.writeln('Happy Birthday! 🎉');
  },
  dmr: () => {
    term.writeln('From your best friend to you Sablinova, Happy birthday and hope we meet. Asalamulakium');
  },
  randomurl: () => {
    const urls = [
      'https://www.example.com',
      'https://www.github.com',
      'https://www.stackoverflow.com'
    ];
    const randomUrl = urls[Math.floor(Math.random() * urls.length)];
    term.writeln(`\x1B]8;;${randomUrl}\x1B\\Open random URL\x1B]8;;\x1B\\`);
  },
  linuxfun: () => {
    term.writeln('Just a fun command for Linux users!');
  },
  userdata: fetchUserData,
  motd: () => {
    term.writeln('Welcome to the best terminal ever!');
},
fortune: () => {
    const fortunes = [
        'You will have a great day!',
        'Your future is looking bright!',
        'Good things are coming your way.',
        'Expect the unexpected.',
        'Keep pushing forward, success is near.'
    ];
    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    term.writeln(randomFortune);
},
cowsay: () => {
    term.writeln(' ________________________________________');
    term.writeln('/ Hello there! Moo!                       \\');
    term.writeln('\\________________________________________/');
    term.writeln('        \\   ^__^');
    term.writeln('         \\  (oo)\\_______');
    term.writeln('            (__)\\       )\\/\\');
    term.writeln('                ||----w |');
    term.writeln('                ||     ||');
},
figlet: () => {
    term.writeln(' _    _ _       _     _ ');
    term.writeln('| |  (_) |     | |   | |');
    term.writeln('| | ___| |_ ___| |__ | |');
    term.writeln('| |/ / | __/ _ \\ \'_ \\| |');
    term.writeln('|   <| | ||  __/ | | |_|');
    term.writeln('|_|\\_\\_|\\__\\___|_| |_(_)');
},
sl: () => {
    term.writeln('    ====        ________                ___________');
    term.writeln('D ___|  |________/        \\_____     _______/         \\__I_I_____===__|_________|');
    term.writeln(' |   |  |  |     |   H\\ ______/  \\   /     |   |  \\ |   |  |_     |   |   |');
    term.writeln(' |   |  |  |     |    |/    \\ \\   |   |  \\  |   |  | |   |  |_____|   |   |');
    term.writeln(' |___|  |__|     |____| \\___|  |  \\___/|_____|  |__\\_____/|___|');
    term.writeln('   (O)\\()         (O)---(O)     \\(O)---(O)        (O)(O)---(O)(O)');
},
matrix: () => {
    const matrixLines = [
        '0101010101010101010101010101010101010101010101010101010101010101',
        '0010110101010101010011010101010101010100101010101010110101010101',
        '1010101010110101010101010101001010101001010110101010101010101010',
        '0101010110101010101001010101010100101010110101010101010101001010'
    ];
    term.writeln(matrixLines.join('\n'));
  },
  echo: () => {
    term.writeln('Echo... echo... echo...');
},
date: () => {
    term.writeln(new Date().toString());
},
cal: () => {
    const calendar = `
      July 2024
Su Mo Tu We Th Fr Sa
    1  2  3  4  5  6
 7  8  9 10 11 12 13
14 15 16 17 18 19 20
21 22 23 24 25 26 27
28 29 30 31
    `;
    term.writeln(calendar);
},
uptime: () => {
    term.writeln('Uptime: ' + process.uptime().toFixed(0) + ' seconds');
},
uname: () => {
    term.writeln('Linux Sablinova 5.10.0-8-amd64 #1 SMP Debian 5.10.46-4 (2021-08-03) x86_64 GNU/Linux');
},
neofetch: () => {
    term.writeln(`
           -/+:.          visitor@Sablinova
          :++++.          -----------------
         /+++/.           OS: Sablinova Linux x86_64
  .:-::- .+/:-.            Host: Sablinova Terminal
 .:/++++++/::::/+/       Kernel: 5.10.0-8-amd64
 .://////////////////:    Uptime: ${Math.floor(process.uptime()/3600)} hours
 .://///////////////////:  Packages: 1287
    -+//////:.-://////+:. Shell: bash
       .:::.      ...:::   Resolution: 1920x1080
    `);
},
lsblk: () => {
    term.writeln(`
NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
sda           8:0    0 931.5G  0 disk 
├─sda1        8:1    0   512M  0 part /boot
├─sda2        8:2    0 914.4G  0 part /
└─sda3        8:3    0  16.6G  0 part [SWAP]
`);
},
df: () => {
    term.writeln(`
Filesystem     1K-blocks      Used Available Use% Mounted on
/dev/sda2      944898452 123456789 821441663  15% /
/dev/sda1         523248     31268    491980   6% /boot
`);
},
ps: () => {
    term.writeln(`
  PID TTY          TIME CMD
    1 ?        00:00:01 init
   42 ?        00:00:00 bash
  100 ?        00:00:00 ps
`);
},
top: () => {
    term.writeln(`
top - 15:20:17 up  1:23,  1 user,  load average: 0.20, 0.14, 0.10
Tasks: 193 total,   1 running, 192 sleeping,   0 stopped,   0 zombie
%Cpu(s):  3.7 us,  2.0 sy,  0.0 ni, 94.0 id,  0.0 wa,  0.0 hi,  0.3 si,  0.0 st
MiB Mem :  16000.0 total,  12000.0 free,   2000.0 used,   1000.0 buff/cache
MiB Swap:   2000.0 total,   1999.0 free,      1.0 used.  12999.0 avail Mem 

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND     
 1000 visitor   20   0  162652   2820   2440 S   0.3  0.0   0:00.03 bash
 1001 visitor   20   0  123412   3120   2760 R   0.3  0.0   0:00.01 top
`);
},

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
              if (typeof commands[cmd] === 'function') {
                  commands[cmd]();
              } else {
                  term.writeln(commands[cmd]);
              }
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
