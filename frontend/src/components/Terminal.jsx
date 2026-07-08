import { useState } from 'react';

// Judge0 language IDs — same mapping as the old ai.js / AIHelper.jsx
const langMap = {
  javascript: 63,
  typescript: 74,
  python: 71,
  java: 62,
  cpp: 54,
  rust: 73
};

export default function Terminal({ currentCode, language }) {
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);

  const runCode = async () => {
    if (!currentCode || !currentCode.trim()) {
      setOutput('~ Nothing to run');
      return;
    }

    setRunning(true);
    setOutput('~ running...');

    const language_id = langMap[language];

    try {
      const res = await fetch(
        'https://ce.judge0.com/submissions?base64_encoded=false&wait=true',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            language_id: language_id,
            source_code: currentCode
          })
        }
      );

      const data = await res.json();

      const result =
        data.stdout ||
        data.stderr ||
        data.compile_output ||
        data.message ||
        'No output';

      setOutput('~ ' + result);
    } catch (e) {
      setOutput('~ Error: ' + e.message);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="terminal-panel">
      <button className="action-btn" onClick={runCode} disabled={running}>
        {running ? '⏳ Running...' : '▶ Run Code'}
      </button>
      <pre className="terminal-output">{output}</pre>
    </div>
  );
}
