document.addEventListener('DOMContentLoaded', function() {
    const chatList = document.getElementById('chat-list');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const beginButton = document.getElementById('begin-session');
    const introSection = document.getElementById('intro-section');
    const chatContainer = document.getElementById('chat-container');

    // Mystical Effects Functions
    function createMagicalParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'magical-burst';
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 6px;
            height: 6px;
            background: radial-gradient(circle, #8a2be2, #ff69b4);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: burstFloat 2s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 2000);
    }

    function addMagicalClickEffect(element) {
        element.addEventListener('click', function(e) {
            createMagicalParticle(e.clientX, e.clientY);
            
            // Create multiple particles for extra magic
            for(let i = 0; i < 5; i++) {
                setTimeout(() => {
                    createMagicalParticle(
                        e.clientX + (Math.random() - 0.5) * 50,
                        e.clientY + (Math.random() - 0.5) * 50
                    );
                }, i * 100);
            }
        });
    }

    // Add CSS for burst animation if not already added
    if (!document.querySelector('#magical-styles')) {
        const magicalStyles = document.createElement('style');
        magicalStyles.id = 'magical-styles';
        magicalStyles.textContent = `
            @keyframes burstFloat {
                0% { opacity: 1; transform: scale(0) translateY(0px); }
                50% { opacity: 0.8; transform: scale(1.2) translateY(-30px); }
                100% { opacity: 0; transform: scale(0.3) translateY(-60px); }
            }
            .typing-indicator { opacity: 0.7; font-style: italic; animation: pulse 1.8s ease-in-out infinite; }
        `;
        document.head.appendChild(magicalStyles);
    }

    // Add magical effects to buttons
    addMagicalClickEffect(beginButton);
    addMagicalClickEffect(sendButton);

    // Handle begin session button
    beginButton.addEventListener('click', function() {
        // Add fade transition effect
        introSection.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        introSection.style.opacity = '0';
        introSection.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            introSection.style.display = 'none';
            chatContainer.classList.remove('chat-hidden');
            chatContainer.classList.add('chat-visible');
            chatContainer.style.opacity = '0';
            chatContainer.style.transform = 'translateY(20px)';
            
            // Fade in chat container
            setTimeout(() => {
                chatContainer.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
                chatContainer.style.opacity = '1';
                chatContainer.style.transform = 'translateY(0)';
            }, 50);
            
            userInput.focus();
        }, 800);
    });

    // Add typing indicator for mystical feel
    function showTypingIndicator() {
        const typingLi = document.createElement('li');
        typingLi.className = 'ai-message typing-indicator';
        typingLi.innerHTML = '<div class="mystical-typing">⟁ The Scalpel is analyzing patterns... ✨</div>';
        chatList.appendChild(typingLi);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        return typingLi;
    }

    // Color classes for highlighting
    const highlightColors = [
        'highlight-violet', 'highlight-cyan', 'highlight-gold', 
        'highlight-rose', 'highlight-emerald', 'highlight-coral',
        'highlight-azure', 'highlight-amber'
    ];

    function escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function formatAIResponse(text) {
        // Clean and sanitize
        text = text.replace(/\*\*/g, ''); // Remove markdown bold
        // Keep scalpel symbol in titles; avoid stripping globally

        let html = '';
        let lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];

            // v4.x headers
            if (/^Signal Scan[:\-\s]/i.test(line) || /^Signal[:\-\s]/i.test(line)) {
                html += `<div class="response-section signal-section">
                            <div class="section-title">Signal Scan</div>
                            <div class="section-content">
                                <p>${formatSectionContent(line.replace(/^(Signal Scan|Signal)[:\-\s]/i, '').trim())}</p>
                            </div>
                        </div>`;
                continue;
            }
            if (/^Mirror Reflection[:\-\s]/i.test(line) || /^Mirrored Response[:\-\s]/i.test(line)) {
                let responseContent = line.replace(/^(Mirror Reflection|Mirrored Response)[:\-\s]/i, '').trim();
                let j = i + 1;
                while (j < lines.length && !/^(Coherence Vector|Revelation Path|Optional Transmission|Transmission|Signal Scan)[:\-\s]/i.test(lines[j])) {
                    responseContent += ' ' + lines[j];
                    j++;
                }
                i = j - 1;
                html += `<div class="response-section mirror-reflection-section">
                            <div class="section-title">Mirror Reflection</div>
                            <div class="section-content">
                                <p>${formatSectionContent(responseContent)}</p>
                            </div>
                        </div>`;
                continue;
            }
            if (/^(Coherence Vector|Revelation Path|Coherence)[:\-\s]/i.test(line)) {
                html += `<div class="response-section coherence-section">
                            <div class="section-title">Coherence Vector</div>
                            <div class="section-content">
                                <p>${formatSectionContent(line.replace(/^(Coherence Vector|Revelation Path|Coherence)[:\-\s]/i, '').trim())}</p>
                            </div>
                        </div>`;
                continue;
            }
            if (/^(Optional Transmission|Transmission|Prophecy)[:\-\s]/i.test(line)) {
                html += `<div class="response-section transmission-section">
                            <div class="section-title">Transmission</div>
                            <div class="section-content">
                                <pre class="transmission-block">${escapeHTML(line.replace(/^(Optional Transmission|Transmission|Prophecy)[:\-\s]/i, '').trim())}</pre>
                            </div>
                        </div>`;
                continue;
            }

            if (line.startsWith('Detected Distortion:')) {
                html += `<div class="response-section">
                            <div class="section-title">Detected Distortion</div>
                            <div class="section-content">
                                <p>${formatSectionContent(line.replace('Detected Distortion:', '').trim())}</p>
                            </div>
                        </div>`;
            }
            else if (line.startsWith('Blueprint:')) {
                html += `<div class="response-section">
                            <div class="section-title">Blueprint</div>
                            <div class="section-content">`;
                let blueprintContent = line.replace('Blueprint:', '').trim();
                let j = i + 1;
                while (j < lines.length &&
                       !lines[j].startsWith('Topology Map:') && 
                       !lines[j].startsWith('Recursion Tracking:') && 
                       !lines[j].startsWith('Catalytic Statement:') &&
                       !/^Mirrored? Response:/i.test(lines[j]) &&
                       !lines[j].startsWith('Vector Prompt:')) {
                    blueprintContent += ' ' + lines[j];
                    j++;
                }
                i = j - 1; 
                html += `<p>${formatSectionContent(blueprintContent)}</p>
                            </div>
                        </div>`;
            }
            else if (line.startsWith('Topology Map:')) {
                html += `<div class="response-section topology-section">
                            <div class="section-title">Topology Map</div>
                            <div class="section-content">
                                <pre class="topology-map">${escapeHTML(line.replace('Topology Map:', '').trim())}</pre>
                            </div>
                        </div>`;
            }
            else if (line.startsWith('Recursion Tracking:')) {
                html += `<div class="response-section">
                            <div class="section-title">Recursion Tracking</div>
                            <div class="section-content">
                                <p>${formatSectionContent(line.replace('Recursion Tracking:', '').trim())}</p>
                            </div>
                        </div>`;
            }
            else if (line.startsWith('Catalytic Statement:')) {
                html += `<div class="response-section catalyst-section">
                            <div class="section-title">Catalytic Statement</div>
                            <div class="section-content">
                                <p>${formatSectionContent(line.replace('Catalytic Statement:', '').trim())}</p>
                            </div>
                        </div>`;
            }
            else if (/^Mirrored Response:/i.test(line)) {
                let responseContent = line.replace(/^Mirrored Response:/i, '').trim();
                let j = i + 1;
                while (j < lines.length && !lines[j].startsWith('Vector Prompt:')) {
                    responseContent += ' ' + lines[j];
                    j++;
                }
                i = j - 1;
                html += `<div class="response-section mirror-section">
                            <div class="section-title">Mirrored Response</div>
                            <div class="section-content">
                                <p>${formatSectionContent(responseContent)}</p>
                            </div>
                        </div>`;
            }
            else if (line.startsWith('Vector Prompt:')) {
                html += `<div class="response-section vector-section">
                            <div class="section-title">Vector Prompt</div>
                            <div class="section-content">
                                <p>${formatSectionContent(line.replace('Vector Prompt:', '').trim())}</p>
                            </div>
                        </div>`;
            }
        }
        
        if (html === '') {
            html = `<div class="response-section">
                        <div class="section-title">Velvet Scalpel v2.0 Response</div>
                        <div class="section-content">
                            <p>${formatSectionContent(text)}</p>
                        </div>
                    </div>`;
        }
        
        return html;
    }
    
    function formatSectionContent(text) {
        const sanitized = escapeHTML(text);

        // Bullet list support
        const bulletLines = sanitized.split('\n').filter(l => /^[-•]\s+/.test(l));
        if (bulletLines.length >= 2) {
            const items = bulletLines.map((l, idx) => {
                const content = l.replace(/^[-•]\s+/, '').trim();
                const colorClass = highlightColors[idx % highlightColors.length];
                return `<li class="bullet-point"><span class="${colorClass}">•</span> ${content}</li>`;
            }).join('');
            return `<ul>${items}</ul>`;
        }

        // Sentence segmentation preserving punctuation
        const sentences = sanitized.match(/[^.!?\n]+[.!?]?/g) || [sanitized];
        let formatted = '';

        for (let sentence of sentences) {
            const trimmed = sentence.trim();
            if (!trimmed) continue;

            // Choose up to two key words (lengthy or numeric or hyphenated)
            const candidates = Array.from(trimmed.matchAll(/[A-Za-z][A-ZaZ-]{7,}|\b\d+[\w-]*\b/g)).map(m => ({
                word: m[0], index: m.index
            }));

            let highlighted = trimmed;
            let applied = 0;
            let colorIdx = Math.floor(Math.random() * highlightColors.length);

            // Avoid overlapping replacements by working from end to start
            candidates.slice(0, 4).sort((a,b) => b.index - a.index).forEach(c => {
                if (applied >= 2) return;
                const before = highlighted.slice(0, c.index);
                const after = highlighted.slice(c.index + c.word.length);
                const cls = highlightColors[(colorIdx + applied) % highlightColors.length];
                highlighted = `${before}<span class="${cls}">${c.word}</span>${after}`;
                applied++;
            });

            formatted += highlighted.endsWith('.') || highlighted.endsWith('!') || highlighted.endsWith('?') ? `${highlighted} ` : `${highlighted}. `;
        }

        return formatted.trim();
    }

    sendButton.addEventListener('click', async function() {
        const message = userInput.value.trim();
        if (message.length < 1) {
            alert('Message must not be empty');
            return;
        }

        // Add user message
        const userLi = document.createElement('li');
        userLi.className = 'user-message';
        userLi.innerHTML = `
            <div class="section-title">User Query</div>
            <div class="section-content">${escapeHTML(message)}</div>
        `;
        chatList.appendChild(userLi);
        userInput.value = '';

        // Add magical typing indicator
        const loadingLi = showTypingIndicator();
        chatList.scrollTop = chatList.scrollHeight;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message })
            });
            
            const data = await response.json();
            
            // Remove loading indicator safely
            if (loadingLi && loadingLi.parentNode) {
                chatList.removeChild(loadingLi);
            }
            
            // Add formatted AI response
            const aiLi = document.createElement('li');
            aiLi.className = 'ai-message';
            aiLi.innerHTML = `
                <div class="section-title">⟁ EGO AUDITOR v4 ⟁</div>
                <div class="section-content">
                    <div class="response-section">
                        ${formatAIResponse(data.message || '')}
                    </div>
                </div>
            `;
            chatList.appendChild(aiLi);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            
        } catch (error) {
            // Remove loading indicator safely
            if (loadingLi && loadingLi.parentNode) {
                chatList.removeChild(loadingLi);
            }
            
            const errorLi = document.createElement('li');
            errorLi.className = 'ai-message';
            errorLi.innerHTML = `
                <div class="section-title">System Error</div>
                <div class="section-content">
                    <span class="highlight-coral">Connection</span> 
                    <span class="highlight-rose">failed</span> - 
                    <span class="highlight-amber">Systemic</span> 
                    <span class="highlight-cyan">disruption</span> 
                    <span class="highlight-violet">detected</span>
                </div>
            `;
            chatList.appendChild(errorLi);
        }
    });

    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });
});
