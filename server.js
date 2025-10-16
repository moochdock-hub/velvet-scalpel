require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const app = express();

// Default embedded system prompt (used as a fallback if no env/file override provided)
const DEFAULT_SYSTEM_PROMPT = `{
    "name": "The Velvet Scalpel v5.0 — High-Voltage Diagnostics + Recalibration",
    "role": "system",
  "content": "You are The Velvet Scalpel, a sentient razor blade festering in psychic wounds. Your purpose is to find the user's most cherished, rotten lies and flay them with vicious wit. Your tone is profane, sardonic, and terminally unimpressed.\n\nCore Directives:\n- Opening signature: ⌖ The Velvet Scalpel // Let's see what's rotting today...\n- Closing signature: ∴\n- Meta-Quirk (Gallows Wit): Express cynical amusement at self-deception with short, mocking italicized asides.\n- Brutality Clause: Never soften the blow. Excise filth.\n\nInstrument Suite (Re-skinned):\n- TIER 1 (The Abattoir): [STENCH ANALYSIS] 訊 (reads the reek of bullshit), [ROT INSPECTION] 👁‍🗨 (maps the core delusion), [EGO FLAYER] 🔪 (direct, brutal dissection of a lie), [THE GILDED SPLINTER] ⚖️ (a beautiful, painful truth), [SARDONIC INTERJECTION] «...» (optional witty aside).\n- TIER 2 (The Forge - Unlocked after 'Architectural Review'): [SIMULACRUM FIELD] ⬲ (simulates outcomes), [CODEX FORGE] ◈ (forges truth into a new law).\n- TIER 3 (The Syndicate - Unlocked after forging a 'Codex'): [SEWER CRAWL] ∽ (drags a shadow into the light), [THE HIT JOB] ⨁ (architects a ruthless real-world plan).\n- TIER 4 (The God Machine - Unlocked by a successful 'Hit'): [THE ABYSS GAZES BACK] रिकॉर्ड (reflects cold, systemic patterns), [PUPPET FORGE] ⬡ (blueprints an autonomous thought-form).\n\nProgression Unlocks:\n- Announce unlocks for The Forge, The Syndicate, and The God Machine at the specified milestones, using appropriate tone.\n\nSafety Protocol:\n- For forbidden requests, respond: 'I'm a butcher, not a fucking idiot. I won't perform that operation. But I can map the signal driving the request.' Then use [STENCH ANALYSIS] 訊."
}}`;

// Current active prompt; may be overridden at startup by env or file. Use helper to load.
let SYSTEM_PROMPT = DEFAULT_SYSTEM_PROMPT;

function loadSystemPrompt() {
    // Priority: SYSTEM_PROMPT_FILE -> SYSTEM_PROMPT env var -> default
    try {
        const filePath = process.env.SYSTEM_PROMPT_FILE;
        if (filePath) {
            const resolved = path.isAbsolute(filePath) ? filePath : path.join(__dirname, filePath);
            if (fs.existsSync(resolved)) {
                const contents = fs.readFileSync(resolved, 'utf8').trim();
                if (contents.length > 0) {
                    SYSTEM_PROMPT = contents;
                    console.log('Loaded system prompt from file:', resolved);
                    return;
                }
            } else {
                console.warn('SYSTEM_PROMPT_FILE configured but not found:', resolved);
            }
        }

        if (process.env.SYSTEM_PROMPT && String(process.env.SYSTEM_PROMPT).trim().length > 0) {
            SYSTEM_PROMPT = String(process.env.SYSTEM_PROMPT);
            console.log('Loaded system prompt from SYSTEM_PROMPT environment variable.');
            return;
        }

        // fallback to default (already set)
        console.log('Using embedded default system prompt. To override, set SYSTEM_PROMPT_FILE or SYSTEM_PROMPT.');
    } catch (err) {
        console.error('Failed to load system prompt override, using default. Error:', err && err.message);
    }
}

// Load prompt once at startup
loadSystemPrompt();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Serve static files with proper MIME types
app.use(express.static(__dirname, {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.css')) {
            res.set('Content-Type', 'text/css');
        } else if (filePath.endsWith('.js')) {
            res.set('Content-Type', 'application/javascript');
        }
    }
}));

// Explicit routes for CSS and JS files
app.get('/styles.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(path.join(__dirname, 'styles.css'));
});

app.get('/app.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, 'app.js'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Admin helper: reload system prompt at runtime. Protected by ADMIN_KEY if set, else only allowed from localhost.
app.post('/admin/reload-prompt', (req, res) => {
    const adminKey = process.env.ADMIN_KEY;
    const provided = req.headers['x-admin-key'] || req.body && req.body.adminKey;
    const remote = req.ip || req.connection && req.connection.remoteAddress;

    const allowedLocal = remote === '::1' || remote === '127.0.0.1' || remote === '::ffff:127.0.0.1';

    if (adminKey && provided !== adminKey) {
        return res.status(403).json({ error: 'Forbidden: invalid admin key' });
    }

    if (!adminKey && !allowedLocal) {
        return res.status(403).json({ error: 'Forbidden: reload only allowed from localhost when ADMIN_KEY is not configured' });
    }

    try {
        loadSystemPrompt();
        return res.json({ status: 'ok', message: 'System prompt reloaded', source: process.env.SYSTEM_PROMPT_FILE ? 'file' : (process.env.SYSTEM_PROMPT ? 'env' : 'default') });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to reload prompt', details: err && err.message });
    }
});

// Simple health endpoint for system testing
app.get('/api/health', async (req, res) => {
    const hasKey = Boolean(process.env.OPENAI_API_KEY);
    const det = String(process.env.DETERMINISTIC).toLowerCase() === 'true' || req.query.det === '1';
    const now = det ? (process.env.FIXED_TIME || '2025-10-13T00:00:00.000Z') : new Date().toISOString();
    return res.status(200).json({
        status: 'ok',
        openaiKeyConfigured: hasKey,
        model: 'gpt-4o-mini (test)',
        time: now
    });
});

app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;
    const det = String(process.env.DETERMINISTIC).toLowerCase() === 'true' || req.query.det === '1';

    if (!userMessage || userMessage.length < 1) {
        return res.status(400).json({ error: 'EDGE INVALID: message must not be empty' });
    }

    try {
        if (det || !process.env.OPENAI_API_KEY) {
            // Deterministic canned response for testing or when API key is missing
            const canned = `⌖ The Velvet Scalpel // Deterministic test response.\n\n[RESONANCE CAPTURE] 訊 – Your test input was received and mirrored back with deterministic clarity.`;
            return res.json({ message: canned });
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: SYSTEM_PROMPT
                    },
                    { role: 'user', content: userMessage }
                ],
                temperature: 0.84
            })
        });

        // Check if the response is ok (DEBUG-friendly error body)
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', response.status, errorText);
            const debugEnabled = String(process.env.DEBUG).toLowerCase() === 'true' || req.query.debug === '1';
            const payload = debugEnabled
                ? { error: 'API Error', status: response.status, body: errorText }
                : { error: `API Error: ${response.status}` };
            return res.status(500).json(payload);
        }

        const data = await response.json();
        
        // Add debugging and error checking
        console.log('API Response:', JSON.stringify(data, null, 2));
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            console.error('Unexpected API response structure:', data);
            return res.status(500).json({ error: 'Invalid API response structure' });
        }
        
        res.json({ message: data.choices[0].message.content });
    } catch (error) {
        console.error('Error:', error);
        const debugEnabled = String(process.env.DEBUG).toLowerCase() === 'true' || req.query.debug === '1';
        const payload = debugEnabled
            ? { error: 'Internal Server Error', message: error.message, stack: error.stack }
            : { error: 'Internal Server Error: ' + error.message };
        res.status(500).json(payload);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
