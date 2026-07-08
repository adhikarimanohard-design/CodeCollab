import React, { useState } from 'react';

const AIHelper = ({ 
  editor, 
  showAuthModal, 
  showToast, 
  addActivity, 
  BASE_URL, 
  authHeaders 
}) => {
  const [aiOutput, setAiOutput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [codeOutput, setCodeOutput] = useState('');
  const [selectedLang, setSelectedLang] = useState('javascript');

  const explainCode = async () => {
    const token = localStorage.getItem('cc_token');
    if (!token) { 
      showAuthModal(); 
      return; 
    }

    const code = editor ? editor.getValue() : '';

    if (!code.trim()) {
      showToast('Nothing to explain', 'error');
      return;
    }

    setIsAiLoading(true);
    setAiOutput('');

    try {
      const res = await fetch(`${BASE_URL}/api/ai/explain`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ code })
      });
      
      const text = await res.text();
      setAiOutput(text);
      addActivity('AI explained code');

    } catch (e) {
      setAiOutput('AI error: ' + e.message);
    } finally {
      setIsAiLoading(false);
    }
  };

  const debugCode = async () => {
    const token = localStorage.getItem('cc_token');
    if (!token) { 
      showAuthModal(); 
      return; 
    }

    const code = editor ? editor.getValue() : '';

    if (!code.trim()) {
      showToast('Nothing to debug', 'error');
      return;
    }

    setIsAiLoading(true);
    setAiOutput('');

    try {
      const res = await fetch(`${BASE_URL}/api/ai/debug`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ code })
      });
      
      const text = await res.text();
      setAiOutput(text);
      addActivity('AI debugged code');

    } catch (e) {
      setAiOutput('AI error: ' + e.message);
    } finally {
      setIsAiLoading(false);
    }
  };

  const runCode = async () => {
    const code = editor ? editor.getValue() : '';

    if (!code.trim()) {
      showToast('Nothing to run', 'error');
      return;
    }

    setCodeOutput('~ running...');

    const langMap = {
      javascript: 63,
      typescript: 74,
      python: 71,
      java: 62,
      cpp: 54,
      rust: 73
    };

    const language_id = langMap[selectedLang];

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

      setCodeOutput('~ ' + result);
      addActivity('Code executed');

    } catch (e) {
      setCodeOutput('~ Error: ' + e.message);
    }
  };

  return (
    <div className="sidebar-left">
      
      {/* AI Panel */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-icon">✨</span>
          <span className="panel-title">AI ASSISTANT</span>
        </div>
        <div className="panel-body">
          <div className="ai-buttons">
            <button className="ai-btn explain-btn" onClick={explainCode}>
              ✦ Explain
            </button>
            <button className="ai-btn debug-btn" onClick={debugCode}>
              🐛 Debug
            </button>
          </div>
          <div className="ai-output">
            {isAiLoading ? (
              <div className="ai-loading">
                <span></span><span></span><span></span>
              </div>
            ) : (
              aiOutput || 'Ask AI...'
            )}
          </div>
        </div>
      </div>

      {/* Terminal Panel */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-icon">▶</span>
          <span className="panel-title">TERMINAL</span>
        </div>
        <div className="panel-body">
          <div className="terminal-bar">
            <div className="terminal-dots">
              <span></span><span></span><span></span>
            </div>
            
            <select 
              className="lang-select"
              value={selectedLang} 
              onChange={(e) => setSelectedLang(e.target.value)}
              style={{ marginLeft: 'auto', marginRight: '10px' }}
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="rust">Rust</option>
            </select>

            <button className="run-btn" onClick={runCode}>
              Run
            </button>
          </div>
          <div className="terminal-output">
            {codeOutput || '~ Ready...'}
          </div>
        </div>
      </div>

    </div>
  );
};

export default AIHelper;
