const fetch = require('node-fetch');

(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/chat?debug=1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'smoke test message from node' })
    });

    const text = await res.text();
    console.log('HTTP', res.status);
    console.log('RESPONSE:\n', text);
  } catch (err) {
    console.error('REQUEST ERROR:', err);
    process.exit(1);
  }
})();
