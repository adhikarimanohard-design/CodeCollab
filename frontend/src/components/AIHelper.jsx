import React, { useState } from 'react';

const CodeCollabFeatures = ({ 
  editor, 
  showAuthModal, 
  showToast, 
  addActivity, 
  authHeaders 
}) => {
  const BASE_URL = 'https://codecollab-v9om.onrender.com';

  const [aiOutput, setAiOutput] = useState('');
  const [lang, setLang] = useState('javascript');
  const [codeOutput, setCodeOutput] = useState('');

  // ============================================
  // AI EXPLAIN
  // ============================================
  const explainCode = async () => {
    const token = localStorage.getItem('cc_token');
    if (!token) { showAuthModal(); return; }

    const code = editor ? editor.getValue() : '';
    // In React, state replaces: const output = document.getElementById('aiOutput');

    if (!code.trim()) {
      showToast('Nothing to explain', 'error');
      return;
    }

    // output.innerHTML = `<div class="ai-loading">...</div>`;
    setAiOutput(
      <div className="ai-loading">
        <span></span><span></span><span></span>
      </div>
    );

    try {
      const res = await fetch(`${BASE_URL}/api/ai/explain`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ code })
      });
      const text = await res.text();
      
      // output.textContent = text;
      setAiOutput(text);
      addActivity('AI explained code');

    } catch (e) {
      // output.textContent = 'AI error: ' + e.message;
      setAiOutput('AI error: ' + e.message);
    }
  };

  // ============================================
  // AI DEBUG
  // ============================================
  const debugCode = async () => {
    const token = localStorage.getItem('cc_token');
    if (!token) { showAuthModal(); return; }

    const code = editor ? editor.getValue() : '';
    // In React, state replaces: const output = document.getElementById('aiOutput');

    if (!code.trim()) {
      showToast('Nothing to debug', 'error');
      return;
    }

    // output.innerHTML = `<div class="ai-loading">...</div>`;
    setAiOutput(
      <div className="ai-loading">
        <span></span><span></span><span></span>
      </div>
    );

    try {
      const res = await fetch(`${BASE_URL}/api/ai/debug`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ code })
      });
      const text = await res.text();
      
      // output.textContent = text;
      setAiOutput(text);
      addActivity('AI debugged code');

    } catch (e) {
      // output.textContent = 'AI error: ' + e.message;
      setAiOutput('AI error: ' + e.message);
    }
  };

  // ============================================
  // RUN CODE (Judge0 API)
  // ============================================
  const runCode = async () => {
    const code = editor ? editor.getValue() : '';
    // In React, state replaces: const lang = document.getElementById('langSelect').value;
    // In React, state replaces: const output = document.getElementById('codeOutput');

    if (!code.trim()) {
      showToast('Nothing to run', 'error');
      return;
    }

    // output.textContent = '~ running...';
    setCodeOutput('~ running...');

    // Judge0 language IDs
    const langMap = {
      javascript: 63,
      typescript: 74,
      python: 71,
      java: 62,
      cpp: 54,
      rust: 73
    };

    const language_id = langMap[lang];

    try {
      const res = await fetch(
        'https://ce.judge0.com/submissions?base64_encoded=false&wait=true',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            language_id: language_id,
            source_code: code
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

      // output.textContent = '~ ' + result;
      setCodeOutput('~ ' + result);

      addActivity('Code executed');

    } catch (e) {
      // output.textContent = '~ Error: ' + e.message;
      setCodeOutput('~ Error: ' + e.message);
    }
  };

  return (
    <>
      {/* Container for AI outputs matching your old JS IDs */}
      <div>
        <button onClick={explainCode}>Explain Code</button>
        <button onClick={debugCode}>Debug Code</button>
        
        <div id="aiOutput">
          {aiOutput}
        </div>
      </div>

      <hr />

      {/* Container for Run outputs matching your old JS IDs */}
      <div>
        <select 
          id="langSelect" 
          value={lang} 
          onChange={(e) => setLang(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="rust">Rust</option>
        </select>
        
        <button onClick={runCode}>Run Code</button>

        <div id="codeOutput">
          {codeOutput}
        </div>
      </div>
    </>
  );
};

export default CodeCollabFeatures;

