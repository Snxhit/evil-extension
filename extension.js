const vscode = require('vscode');

let panel = null;

function activate(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand('evil.start', () => {
            if (panel) return;

            panel = vscode.window.createWebviewPanel('evilOverlay', '', { viewColumn: vscode.ViewColumn.One, preserveFocus: true }, { enableScripts: true, retainContextWhenHidden: true} );
            panel.webview.html = getHtml();

            panel.onDidDispose(() => {
                panel = null;
            });
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('evil.stop', () => {
            if (panel) {
                panel.dispose();
                panel = null;
            }
        })
    );
}

function getHtml() {
    return `
    <!DOCTYPE html>
    <html>
        <body>
            <div id="evil">😈</div>
            <div id="msg"></div>

            <style>
                body
                {
                    margin: 0;
                    overflow: hidden;
                    background: transparent;
                    cursor: default;
                }

                #evil
                {
                    position: absolute;
                    font-size: 42px;
                    pointer-events: none;
                    will-change: transform;
                }

                #msg
                {
                    position: absolute;
                    color: red;
                    font-family: monospace;
                    font-size: 14px;
                    pointer-events: none;
                }
            </style>

            <script>
                const evil = document.getElementById("evil");
                const msg = document.getElementById("msg");

                let x = 200;
                let y = 200;
                let targetX = 200;
                let targetY = 200;

                const insults = [
                    "stop it, get some help.",
                    "what is bro even doing",
                    "this is painful to watch </3",
                    "why are you like this?",
                    "no one likes you",
                    "i hope bugs eat your code",
                    "im gonna steal your cookies.",
                    "you call that code?"
                ]

                window.addEventListener('mousemove', e => {
                    targetX = e.clientX;
                    targetY = e.clientY;    
                });

                function update() {
                    x += (targetX - x) * 0.08 + (Math.random() - 0.5) * 2;
                    y += (targetY - y) * 0.08 + (Math.random() - 0.5) * 2;

                    evil.style.transform = \`translate(\${x}px, \${y}px)\`;
                    msg.style.transform = \`translate(\${x + 30}px, \${y - 10}px)\`;
                    requestAnimationFrame(update);
                }

                update();

                setInterval(() => {
                    msg.textContent = insults[Math.floor(Math.random() * insults.length)];    
                }, 2500);

                setInterval(() => {
                    if (Math.random() < 0.6) {
                        x = targetX - 5;
                        y = targetY - 5;
                        msg.textContent = "STOP MOVING.";
                    }
                }, 5000);
            </script>
        </body>
    </html>
    `;
}

function deactivate() {}

module.exports = { activate, deactivate };