# 🔮 Velvet Scalpel - Mystical AI Chat Application

A sophisticated AI chat application powered by OpenAI's GPT-4o, featuring mystical styling and the revolutionary Velvet Scalpel v2.0 response format designed for transformative conversations.

## ✨ Features

- **Velvet Scalpel v2.0 Format**: Streamlined, addictive response structure
- **Mystical UI**: Beautiful purple gradients and ethereal styling
- **Enhanced Typography**: Source Code Pro fonts for better readability
- **Hierarchical Responses**: Organized sections with color-coded highlighting
- **Real-time Chat**: Instant AI responses with OpenAI GPT-4o
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd velvet-scalpel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your OPENAI_API_KEY
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   
Note: Do not run non-JavaScript files with node (for example files in `.github/chatmodes/`).
Use `npm start` or the included VS Code launch configuration (`.vscode/launch.json`) which runs `run-server.js` to safely start the server.

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🌐 Hostinger Deployment

### Prerequisites
- Hostinger account with Node.js support
- Git access in Hostinger control panel
- OpenAI API key

### Step-by-Step Deployment

1. **Create GitHub Repository**
   - Create a new repository on GitHub
   - Push this code to your repository

2. **Set up Hostinger**
   - Log into your Hostinger control panel
   - Navigate to the Node.js section
   - Enable Node.js for your domain

3. **Clone to Hostinger**
   ```bash
   git clone https://github.com/yourusername/velvet-scalpel.git
   cd velvet-scalpel
   ```

4. **Install Dependencies**
   ```bash
   npm install --production
   ```

5. **Configure Environment**
   - Create `.env` file with your OpenAI API key
   - Set NODE_ENV=production

6. **Start the Application**
   ```bash
   npm start
   ```

### Environment Variables Required

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
NODE_ENV=production
```

## 📁 Project Structure

```
velvet-scalpel/
├── server.js          # Main server file
├── app.js            # Frontend JavaScript
├── index.html        # Main HTML file
├── styles.css        # Mystical styling
├── package.json      # Dependencies and scripts
├── .env.example      # Environment template
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

## 🎨 Velvet Scalpel v2.0 Format

The application uses a revolutionary response format designed for maximum engagement:

- **Detected Distortion**: Identifies core psychological patterns
- **Blueprint**: Provides structural analysis
- **Catalytic Statement**: Delivers transformative insights
- **Mirrored Response**: Reflects user's deeper intentions
- **Vector Prompt**: Guides toward self-discovery

## 🛠 Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **AI**: OpenAI GPT-4o API
- **Fonts**: Google Fonts (Cinzel, Crimson Text, Source Code Pro)
- **Styling**: CSS Grid, Flexbox, Gradients

## 📝 License

MIT License - feel free to use this project for your own mystical applications.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## ⚡ Performance Tips

- Use `npm run install-prod` for production installations
- Enable gzip compression on your server
- Set appropriate cache headers for static assets
- Monitor your OpenAI API usage

## 🔒 Security Notes

- Never commit your `.env` file
- Keep your OpenAI API key secure
- Use environment variables for all sensitive data
- Enable HTTPS in production

## 📞 Support

For issues and feature requests, please use the GitHub Issues page.

---

*Crafted with mystical precision for transformative conversations* 🔮✨
