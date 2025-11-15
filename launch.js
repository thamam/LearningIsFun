#!/usr/bin/env node

const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const open = require('open');

const PORT = process.env.PORT || 3000;
const HTML_FILE = path.join(__dirname, 'src/math/Emma_math_lab.html');
const SERVER_URL = `http://localhost:${PORT}`;
const HEALTH_URL = `${SERVER_URL}/api/health`;

let serverProcess = null;

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[36m',
    red: '\x1b[31m'
};

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

function checkServerHealth() {
    return new Promise((resolve) => {
        http.get(HEALTH_URL, (res) => {
            if (res.statusCode === 200) {
                resolve(true);
            } else {
                resolve(false);
            }
        }).on('error', () => {
            resolve(false);
        });
    });
}

async function waitForServer(maxAttempts = 30, delayMs = 200) {
    log(`\n${colors.blue}⏳ Waiting for server to start...${colors.reset}`);

    for (let i = 0; i < maxAttempts; i++) {
        if (await checkServerHealth()) {
            return true;
        }
        await new Promise(resolve => setTimeout(resolve, delayMs));
    }
    return false;
}

function startServer() {
    return new Promise((resolve, reject) => {
        log(`\n${colors.bright}🚀 Emma's Math Practice - Launcher${colors.reset}`);
        log('='.repeat(50));
        log(`${colors.blue}📡 Starting backend server on port ${PORT}...${colors.reset}`);

        serverProcess = spawn('node', ['server.js'], {
            stdio: ['ignore', 'pipe', 'pipe'],
            env: { ...process.env, PORT }
        });

        let output = '';

        serverProcess.stdout.on('data', (data) => {
            output += data.toString();
            // Don't echo server output to keep launcher clean
        });

        serverProcess.stderr.on('data', (data) => {
            log(`${colors.red}Server Error: ${data.toString()}${colors.reset}`);
        });

        serverProcess.on('error', (err) => {
            log(`${colors.red}❌ Failed to start server: ${err.message}${colors.reset}`);
            reject(err);
        });

        serverProcess.on('exit', (code, signal) => {
            if (code !== 0 && code !== null && !signal) {
                log(`${colors.red}❌ Server exited with code ${code}${colors.reset}`);
                process.exit(code);
            }
        });

        // Give server a moment to start
        setTimeout(() => resolve(), 500);
    });
}

async function openBrowser() {
    log(`${colors.blue}🌐 Opening browser...${colors.reset}`);

    try {
        // Convert file path to file:// URL
        const fileUrl = `file://${HTML_FILE.replace(/\\/g, '/')}`;
        await open(fileUrl);
        log(`${colors.green}✅ Browser opened: ${path.basename(HTML_FILE)}${colors.reset}`);
    } catch (err) {
        log(`${colors.yellow}⚠️  Could not auto-open browser: ${err.message}${colors.reset}`);
        log(`${colors.yellow}📂 Please manually open: ${HTML_FILE}${colors.reset}`);
    }
}

function setupCleanup() {
    const cleanup = () => {
        log(`\n${colors.yellow}🛑 Shutting down...${colors.reset}`);
        if (serverProcess) {
            serverProcess.kill('SIGTERM');
            setTimeout(() => {
                if (serverProcess && !serverProcess.killed) {
                    serverProcess.kill('SIGKILL');
                }
            }, 2000);
        }
        process.exit(0);
    };

    process.on('SIGINT', cleanup);  // Ctrl+C
    process.on('SIGTERM', cleanup); // Kill command
    process.on('exit', () => {
        if (serverProcess && !serverProcess.killed) {
            serverProcess.kill();
        }
    });
}

async function main() {
    try {
        setupCleanup();

        // Start the server
        await startServer();

        // Wait for server to be ready
        const serverReady = await waitForServer();

        if (!serverReady) {
            log(`${colors.red}❌ Server failed to start within timeout period${colors.reset}`);
            log(`${colors.yellow}💡 Try running manually: npm start${colors.reset}`);
            process.exit(1);
        }

        log(`${colors.green}✅ Server is ready!${colors.reset}`);

        // Open browser
        await openBrowser();

        // Show instructions
        log('\n' + '='.repeat(50));
        log(`${colors.green}${colors.bright}✨ Emma's Math Practice is running!${colors.reset}`);
        log('='.repeat(50));
        log(`${colors.blue}📡 Backend server: ${SERVER_URL}${colors.reset}`);
        log(`${colors.blue}📄 Math practice: ${path.basename(HTML_FILE)}${colors.reset}`);
        log(`${colors.blue}📁 Logs directory: logs/[module]/[date].json${colors.reset}`);
        log('');
        log(`${colors.yellow}Press Ctrl+C to stop the server and exit${colors.reset}`);
        log('='.repeat(50) + '\n');

        // Keep process alive
        process.stdin.resume();

    } catch (err) {
        log(`${colors.red}❌ Launch failed: ${err.message}${colors.reset}`);
        process.exit(1);
    }
}

// Run launcher
main();
