import { useState } from 'react';

export default function Terminal({ currentCode, language }) {
  const [output, setOutput] = useState('~ ready to execute...');
  const [isRunning, setIsRunning] = useState(false);

  const runCode = async () => {
    if (!currentCode?.trim()) {
      setOutput('~ Error: Nothing to run');
      return;
    }

    setIsRunning(true);
    setOutput('~ running...');

    const langMap = { javascript: 63, typescript: 74, python: 71, java: 62, cpp: 54, rust: 73 };
    const language_id = langMap[language];

    try {
      const res = await fetch('https://ce.judge0.com/submissions?base64_encoded=false&wait=true', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language_id, source_code: currentCode })
      });
      const data = await res.json();
      const result = data.stdout || data.stderr || data.compile_output || data.message || 'No output';
      setOutput(`~ ${result}`);
    } catch (e) {
      setOutput(`~ Error: ${e.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <>
      <div className="terminal-bar">
        <span className="terminal-dots">
          <span></span><span></span><span></span>
        </span>
        <button className="run-btn" onClick={runCode} disabled={isRunning}>
          {isRunning ? '▶ Running...' : '▶ Run'}
        </button>
      </div>
      <pre className="terminal-output">{output}</pre>
    </>
  );
}