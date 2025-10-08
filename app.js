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
                0% { 
                    opacity: 1; 
                    transform: scale(0) translateY(0px);
                }
                50% { 
                    opacity: 0.8; 
                    transform: scale(1.2) translateY(-30px);
                }
                100% { 
                    opacity: 0; 
                    transform: scale(0.3) translateY(-60px);
                }
            }
            
            .typing-indicator {
                opacity: 0.6;
                font-style: italic;
                animation: pulse 1.5s ease-in-out infinite;
            }
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

    function formatAIResponse(text) {
        // Clean up the text first
        text = text.replace(/\*\*/g, ''); // Remove markdown stars
        text = text.replace(/⟁/g, ''); // Remove symbols that interfere with parsing
        
        // Handle the v2.0 format more intelligently
        let html = '';
        let lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            
            // Check for section headers
            // v4.x headers (Signal Scan, Mirror Reflection, Coherence Vector / Revelation Path, Optional Transmission)
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
                // Mirror content may be multi-line
                let responseContent = line.replace(/^(Mirror Reflection|Mirrored Response)[:\-\s]/i, '').trim();
                let j = i + 1;
                while (j < lines.length && !/^Coherence Vector[:\-\s]/i.test(lines[j]) && !/^Revelation Path[:\-\s]/i.test(lines[j]) && !/^Optional Transmission[:\-\s]/i.test(lines[j]) && !/^Transmission[:\-\s]/i.test(lines[j]) && !/^Signal Scan[:\-\s]/i.test(lines[j])) {
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
            if (/^Coherence Vector[:\-\s]/i.test(line) || /^Revelation Path[:\-\s]/i.test(line) || /^Coherence[:\-\s]/i.test(line)) {
                html += `<div class="response-section coherence-section">
                            <div class="section-title">Coherence Vector</div>
                            <div class="section-content">
                                <p>${formatSectionContent(line.replace(/^(Coherence Vector|Revelation Path|Coherence)[:\-\s]/i, '').trim())}</p>
                            </div>
                        </div>`;
                continue;
            }
            if (/^Optional Transmission[:\-\s]/i.test(line) || /^Transmission[:\-\s]/i.test(line) || /^Prophecy[:\-\s]/i.test(line)) {
                html += `<div class="response-section transmission-section">
                            <div class="section-title">Transmission</div>
                            <div class="section-content">
                                <pre class="transmission-block">${line.replace(/^(Optional Transmission|Transmission|Prophecy)[:\-\s]/i, '').trim()}</pre>
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
                
                // Handle blueprint content (might be multi-line or single line with bullets)
                let blueprintContent = line.replace('Blueprint:', '').trim();
                
                // Check if next lines are part of blueprint
                let j = i + 1;
                while (j < lines.length && 
                       !lines[j].startsWith('Topology Map:') && 
                       !lines[j].startsWith('Recursion Tracking:') && 
                       !lines[j].startsWith('Catalytic Statement:') &&
                       !lines[j].startsWith('Mirrored Response:') &&
                       !lines[j].startsWith('Vector Prompt:')) {
                    blueprintContent += ' ' + lines[j];
                    j++;
                }
                i = j - 1; // Skip processed lines
                
                html += `<p>${formatSectionContent(blueprintContent)}</p>
                            </div>
                        </div>`;
            }
            else if (line.startsWith('Topology Map:')) {
                html += `<div class="response-section topology-section">
                            <div class="section-title">Topology Map</div>
                            <div class="section-content">
                                <pre class="topology-map">${line.replace('Topology Map:', '').trim()}</pre>
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
            else if (line.startsWith('Mirrored Response:')) {
                html += `<div class="response-section mirror-section">
                            <div class="section-title">Mirrored Response</div>
                            <div class="section-content">`;
                
                // Mirrored response might be multi-line
                let responseContent = line.replace('Mirrored Response:', '').trim();
                let j = i + 1;
                while (j < lines.length && !lines[j].startsWith('Vector Prompt:')) {
                    responseContent += ' ' + lines[j];
                    j++;
                }
                i = j - 1;
                
                html += `<p>${formatSectionContent(responseContent)}</p>
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
        
        // If no sections were parsed, wrap everything in a default section
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
        // Split into sentences for better formatting
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        let formatted = '';
        
        for (let sentence of sentences) {
            sentence = sentence.trim();
            if (!sentence) continue;
            
            // Add colorful highlighting to words
            const words = sentence.split(/\s+/);
            let coloredWords = [];
            let colorIndex = Math.floor(Math.random() * highlightColors.length);
            
            for (let i = 0; i < words.length; i++) {
                const word = words[i].trim();
                if (!word) continue;
                
                // Highlight every 2-4 words with different colors
                if (i % 3 === 0) {
                    const colorClass = highlightColors[colorIndex % highlightColors.length];
                    coloredWords.push(`<span class="${colorClass}">${word}</span>`);
                    colorIndex++;
                } else {
                    coloredWords.push(word);
                }
            }
            
            formatted += coloredWords.join(' ') + '. ';
        }
        
        return formatted;
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
            <div class="section-content">${message}</div>
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
                        ${formatAIResponse(data.message)}
                    </div>
                </div>
            `;
            chatList.appendChild(aiLi);
            chatList.scrollTop = chatList.scrollHeight;
            
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
