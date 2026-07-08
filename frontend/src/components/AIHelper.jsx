import { useState } from 'react';

const BASE_URL = "https://codecollab-v9om.onrender.com";

export default function AIHelper({ currentCode, requireAuth }) {
  const [output, setOutput] = useState('Select code and ask AI...');
  const [isLoading, setIsLoading] = useState(false);

  const handleAIRequest = async (endpoint) => {
    requireAuth(async () => {
      if (!currentCode?.trim()) {
        setOutput('Error: Nothing to process.');
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/api/ai/${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('cc_token')}`
          },
          body: JSON.stringify({ code: currentCode })
        });
        const text = await res.text();
        setOutput(text);
      } catch (e) {
        setOutput('AI error: ' + e.message);
      } finally {
        setIsLoading(false);
      }
    });
  };

  return (
    <>
      <div className="ai-buttons">
        <button className="ai-btn explain-btn" onClick={() => handleAIRequest('explain')}>
          <span>✦</span> Explain
        </button>
        <button className="ai-btn debug-btn" onClick={() => handleAIRequest('debug')}>
          <span>◈</span> Debug
        </button>
      </div>
      <div className="ai-output">
        {isLoading ? (
          <div className="ai-loading">
            <span></span><span></span><span></span>
          </div>
        ) : (
          output
        )}
      </div>
    </>
  );
}