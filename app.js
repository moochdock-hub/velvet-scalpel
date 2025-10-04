document.addEventListener('DOMContentLoaded', function() {
    const chatList = document.getElementById('chat-list');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const beginButton = document.getElementById('begin-session');
    const introSection = document.getElementById('intro-section');
    const chatContainer = document.getElementById('chat-container');

    // Handle begin session button
    beginButton.addEventListener('click', function() {
        introSection.style.display = 'none';
        chatContainer.classList.remove('chat-hidden');
        chatContainer.classList.add('chat-visible');
        userInput.focus();
    });

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
        if (message.length < 1 || message.length > 140) {
            alert('Message must be 1-140 characters');
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

        // Add loading indicator
        const loadingLi = document.createElement('li');
        loadingLi.className = 'ai-message';
        loadingLi.innerHTML = `
            <div class="section-title">Velvet Scalpel v2.0 Processing</div>
            <div class="section-content">Detecting distortions...</div>
        `;
        chatList.appendChild(loadingLi);
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
