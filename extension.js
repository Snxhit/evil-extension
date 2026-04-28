const vscode = require('vscode');

let panel = null;

function activate(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand('evil.start', () => {
            if (panel) return;

            panel = vscode.window.createWebviewPanel(
                'evilOverlay',
                '',
                vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true
                }
            );

            panel.webview.html = getHtml();
            vscode.commands.executeCommand('workbench.action.focusActiveEditorGroup');

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
            html, body {
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
                background: rgba(0,0,0,0);
            }

            #evil {
                position: absolute;
                font-size: 42px;
                pointer-events: none;
                will-change: transform;
            }

            #msg {
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

            let x = 200, y = 200;
            let targetX = 200, targetY = 200;
            let lastX = 200, lastY = 200;
            let speed = 0;

            const insults = [
                "stop it, get some help.",
                "what is bro even doing",
                "this is painful to watch </3",
                "why are you like this?",
                "no one likes you",
                "i hope bugs eat your code",
                "im gonna steal your cookies.",
                "you call that code?",
                "this looked better in your head",
                "you typed that with so much confidence",
                "did you mean to do that orrr",
                "well, this is awkward.",
                "this is held together by hope and a ton of glue",
                "you vs compiler but the compiler is winning",
                "your variables deserve better </3",
                "you really typed this and hit save??",
                "this doesnt solve problem this creates them",
                "i dont like this"
            ];

            window.addEventListener('mousemove', e => {
                targetX = e.clientX;
                targetY = e.clientY;
            });

            function update() {
                const dx = targetX - lastX;
                const dy = targetY - lastY;
                speed = Math.sqrt(dx*dx + dy*dy);

                lastX = targetX;
                lastY = targetY;

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
                if (speed > 5 && Math.random() < 0.6) {
                    x = targetX - 5;
                    y = targetY - 5;
                    msg.textContent = "STOP MOVING.";
                }
            }, 2000);
        </script>
    </body>
    </html>
    `;
}

function deactivate() {}

module.exports = { activate, deactivate };