const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure logs directory structure exists
const logsDir = path.join(__dirname, 'logs');
const modules = ['decimal', 'multiplication', 'numberline'];

// Create logs directories
modules.forEach(module => {
    const moduleDir = path.join(logsDir, module);
    if (!fs.existsSync(moduleDir)) {
        fs.mkdirSync(moduleDir, { recursive: true });
        console.log(`Created directory: ${moduleDir}`);
    }
});

// POST endpoint to log flagged questions
app.post('/api/flag', (req, res) => {
    try {
        const flagData = req.body;

        // Validate required fields
        if (!flagData.module || !flagData.timestamp) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: module and timestamp'
            });
        }

        // Determine log file path
        const module = flagData.module;
        const date = new Date();
        const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
        const logFile = path.join(logsDir, module, `${dateStr}.json`);

        // Read existing log file or create new array
        let logs = [];
        if (fs.existsSync(logFile)) {
            const fileContent = fs.readFileSync(logFile, 'utf8');
            try {
                logs = JSON.parse(fileContent);
                if (!Array.isArray(logs)) {
                    logs = [logs]; // Convert single object to array
                }
            } catch (parseError) {
                console.error('Error parsing existing log file:', parseError);
                logs = []; // Start fresh if file is corrupted
            }
        }

        // Append new flag entry
        logs.push(flagData);

        // Write back to file
        fs.writeFileSync(logFile, JSON.stringify(logs, null, 2), 'utf8');

        console.log(`✅ Flag logged: ${module} - ${dateStr} (Total: ${logs.length})`);

        res.json({
            success: true,
            message: 'Flag logged successfully',
            logFile: `logs/${module}/${dateStr}.json`,
            totalFlags: logs.length
        });

    } catch (error) {
        console.error('❌ Error logging flag:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Flag logging server is running',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log('');
    console.log('🚀 Flag Logging Server Started');
    console.log('================================');
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`📁 Logs directory: ${logsDir}`);
    console.log(`✅ Modules: ${modules.join(', ')}`);
    console.log('');
    console.log('Endpoints:');
    console.log(`  POST http://localhost:${PORT}/api/flag - Log a flagged question`);
    console.log(`  GET  http://localhost:${PORT}/api/health - Health check`);
    console.log('');
});
