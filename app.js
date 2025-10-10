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

    function normalizeEmphasis(src) {
        // Preserve emphasis before sanitization/parsing
        return src
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code>$1</code>');
    }

    // Deep-decode existing HTML entities (handles &amp;#039; → ' without re-escaping)
    function decodeHTMLEntities(str) {
        if (!str) return '';
        let prev = null, cur = String(str);
        const textarea = document.createElement('textarea');
        let safety = 0;
        while (cur !== prev && safety < 5) {
            safety++;
            prev = cur;
            textarea.innerHTML = prev;
            cur = textarea.value;
        }
        return cur;
    }

    // Sanitize without converting apostrophes to entities (avoid visual &#039;)
    function escapeHTML(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\"/g, '&quot;');
    }

    function formatAIResponse(text) {
        // Normalize and decode before any parsing
        text = normalizeEmphasis(text);
        text = decodeHTMLEntities(text);
        
        let html = '';
        const rawLines = text.split('\n').map(l => l.replace(/\r/g, '')).filter(l => l.trim().length > 0);

        const lines = rawLines.map(l => l.trim());

        function headerType(line) {
            const stripped = line
                .replace(/^([#>*\-\d]+[\.)]?|[•\u2022\u25AA\u25CF\u25E6]+)\s+/u, '')
                .trim();
            const sepNormalized = stripped.replace(/[\-–—•]+\s*/u, ': ');

            const tests = [
                { key: 'signal', re: /^(Signal Scan|Signal)\s*[:]?/i, title: 'Signal Scan' },
                { key: 'mirror_v4', re: /^(Mirror Reflection|Mirrored Response|Reflection)\s*[:]?/i, title: 'Reflection' },
                { key: 'coherence', re: /^(Coherence Vector|Revelation Path|Coherence)\s*[:]?/i, title: 'Coherence Vector' },
                { key: 'clarifying', re: /^(Clarifying Line)\s*[:]?/i, title: 'Clarifying Line' },
                { key: 'transmission', re: /^(Optional Transmission|Transmission|Prophecy)\s*[:]?/i, title: 'Transmission' },
                { key: 'distortion', re: /^Detected Distortion\s*[:]?/i, title: 'Detected Distortion' },
                { key: 'blueprint', re: /^Blueprint\s*[:]?/i, title: 'Blueprint' },
                { key: 'topology', re: /^Topology Map\s*[:]?/i, title: 'Topology Map' },
                { key: 'recursion', re: /^Recursion Tracking\s*[:]?/i, title: 'Recursion Tracking' },
                { key: 'mirror_legacy', re: /^Mirrored Response\s*[:]?/i, title: 'Reflection' },
                { key: 'vector', re: /^Vector Prompt\s*[:]?/i, title: 'Vector Prompt' },
            ];
            for (const t of tests) {
                if (t.re.test(sepNormalized)) return { key: t.key, title: t.title, matched: t.re.exec(sepNormalized)[0] };
            }
            const md = sepNormalized.replace(/^#+\s*/, '');
            for (const t of tests) {
                if (t.re.test(md)) return { key: t.key, title: t.title, matched: t.re.exec(md)[0] };
            }
            return null;
        }

        const sections = [];
        let i = 0;
        while (i < lines.length) {
            const h = headerType(lines[i]);
            if (!h) { i++; continue; }
            const title = h.title;
            let content = lines[i].replace(h.matched, '').trim();
            i++;
            while (i < lines.length) {
                const nx = headerType(lines[i]);
                if (nx) break;
                content += (content ? '\n' : '') + lines[i];
                i++;
            }
            sections.push({ key: h.key, title, content: content.trim() });
        }

        function renderParagraphsAndLists(body) {
            // Handle blockquotes
            const blocks = body.split(/\n{2,}/).map(b => b.trim()).filter(Boolean);
            let out = '';
            for (const block of blocks) {
                if (/^>/m.test(block)) {
                    const cleaned = block.replace(/^>\s?/gm, '');
                    out += `<blockquote class="velvet-quote">${formatInline(cleaned)}</blockquote>`;
                    continue;
                }
                // Ordered list
                if (/^\d+[\.)]\s+/.test(block)) {
                    const items = block.split(/\n/).filter(l => /^\d+[\.)]\s+/.test(l)).map(l => l.replace(/^\d+[\.)]\s+/, ''));
                    out += `<ol class="velvet-list ol">${items.map(li => `<li>${formatInline(li)}</li>`).join('')}</ol>`;
                    continue;
                }
                // Unordered list
                if (/^(?:[-*•])\s+/.test(block)) {
                    const items = block.split(/\n/).filter(l => /^(?:[-*•])\s+/.test(l)).map(l => l.replace(/^(?:[-*•])\s+/, ''));
                    out += `<ul class="velvet-list ul">${items.map(li => `<li>${formatInline(li)}</li>`).join('')}</ul>`;
                    continue;
                }
                out += `<p>${formatInline(block)}</p>`;
            }
            return out;
        }

        function formatInline(text) {
            // Highlight logic reused but after decode+sanitize
            const sanitized = escapeHTML(text)
                .replace(/&lt;strong&gt;([\s\S]*?)&lt;\/strong&gt;/g, '<strong>$1</strong>')
                .replace(/&lt;em&gt;([\s\S]*?)&lt;\/em&gt;/g, '<em>$1</em>')
                .replace(/&lt;code&gt;([\s\S]*?)&lt;\/code&gt;/g, '<code>$1</code>');

            // Sentence segmentation
            const sentences = sanitized.match(/[^.!?\n]+[.!?]?/g) || [sanitized];
            let formatted = '';
            for (let sentence of sentences) {
                let s = sentence.trim();
                if (!s) continue;
                const candidates = Array.from(s.matchAll(/[A-Za-z][A-Za-z-]{7,}|\b\d+[\w-]*\b/g)).map(m => ({ word: m[0], index: m.index }));
                let highlighted = s;
                let applied = 0;
                const maxHighlights = 3;
                let colorIdx = Math.floor(Math.random() * highlightColors.length);
                candidates.slice(0, 6).sort((a,b) => b.index - a.index).forEach(c => {
                    if (applied >= maxHighlights) return;
                    const before = highlighted.slice(0, c.index);
                    const after = highlighted.slice(c.index + c.word.length);
                    const cls = highlightColors[(colorIdx + applied) % highlightColors.length];
                    highlighted = `${before}<span class="${cls}">${c.word}</span>${after}`;
                    applied++;
                });
                formatted += highlighted.match(/[.!?]$/) ? `${highlighted} ` : `${highlighted}. `;
            }
            return formatted.trim();
        }

        function renderSection(sec) {
            const c = sec.content || '';
            if (sec.key === 'topology') {
                return `<section class="response-card topology-section">
                    <div class="eyebrow">Structure</div>
                    <h3 class="section-title">${sec.title}</h3>
                    <div class="section-content"><pre class="topology-map">${escapeHTML(decodeHTMLEntities(c))}</pre></div>
                </section>`;
            }
            if (sec.key === 'transmission') {
                return `<section class="response-card transmission-section">
                    <div class="eyebrow">Closure</div>
                    <h3 class="section-title">${sec.title}</h3>
                    <div class="section-content"><pre class="transmission-block">${escapeHTML(decodeHTMLEntities(c))}</pre></div>
                </section>`;
            }
            if (sec.key === 'clarifying') {
                return `<section class="response-card clarifying-section">
                    <div class="eyebrow">Grounding</div>
                    <h3 class="section-title">${sec.title}</h3>
                    <div class="section-content">${renderParagraphsAndLists(c)}</div>
                </section>`;
            }
            if (sec.key === 'mirror_v4') {
                return `<section class="response-card mirror-reflection-section">
                    <div class="eyebrow">Image</div>
                    <h3 class="section-title">Reflection</h3>
                    <div class="section-content">${renderParagraphsAndLists(c)}</div>
                </section>`;
            }
            if (sec.key === 'mirror_legacy') {
                return `<section class="response-card mirror-section">
                    <div class="eyebrow">Image</div>
                    <h3 class="section-title">Reflection</h3>
                    <div class="section-content">${renderParagraphsAndLists(c)}</div>
                </section>`;
            }
            if (sec.key === 'vector') {
                return `<section class="response-card vector-section">
                    <div class="eyebrow">Action</div>
                    <h3 class="section-title">${sec.title}</h3>
                    <div class="section-content">${renderParagraphsAndLists(c)}</div>
                </section>`;
            }
            if (sec.key === 'coherence') {
                return `<section class="response-card coherence-section">
                    <div class="eyebrow">Alignment</div>
                    <h3 class="section-title">${sec.title}</h3>
                    <div class="section-content">${renderParagraphsAndLists(c)}</div>
                </section>`;
            }
            if (sec.key === 'signal') {
                return `<section class="response-card signal-section">
                    <div class="eyebrow">Scan</div>
                    <h3 class="section-title">${sec.title}</h3>
                    <div class="section-content">${renderParagraphsAndLists(c)}</div>
                </section>`;
            }
            if (sec.key === 'distortion' || sec.key === 'blueprint' || sec.key === 'recursion') {
                return `<section class="response-card">
                    <div class="eyebrow">Analysis</div>
                    <h3 class="section-title">${sec.title}</h3>
                    <div class="section-content">${renderParagraphsAndLists(c)}</div>
                </section>`;
            }
            return '';
        }

        if (sections.length) {
            html = sections.map(renderSection).join('<hr class="section-divider" />');
        } else {
            html = `<section class="response-card">
                        <div class="eyebrow">Response</div>
                        <h3 class="section-title">Velvet Scalpel v4 Response</h3>
                        <div class="section-content">${renderParagraphsAndLists(text)}</div>
                    </section>`;
        }
        return html;
    }

    // Stardust field
    (function createStardustField() {
        const count = 60; // balanced amount
        const frag = document.createDocumentFragment();
        for (let i = 0; i < count; i++) {
            const s = document.createElement('div');
            s.className = 'stardust';
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const delay = (Math.random() * 4).toFixed(2) + 's';
            const dur = (2 + Math.random() * 3).toFixed(2) + 's';
            const size = Math.random() < 0.2 ? 3 : 2; // a few brighter points
            s.style.left = left + 'vw';
            s.style.top = top + 'vh';
            s.style.setProperty('--d', delay);
            s.style.setProperty('--t', dur);
            s.style.width = size + 'px';
            s.style.height = size + 'px';
            frag.appendChild(s);
        }
        document.body.appendChild(frag);
    })();

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
