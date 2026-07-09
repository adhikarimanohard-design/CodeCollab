import { useState, useEffect, useRef } from 'react';
import Editor from './components/Editor';
import AIHelper from './components/AIHelper';
import Terminal from './components/Terminal'; // NEW: was used below but never imported
import { connectWebSocket, sendSocketChatMessage } from './utils/socket';
import './index.css';

const BASE_URL="https://codecollab-v9om.onrender.com";

export default function App() {
  const [myId] = useState("user_" + Math.random().toString(36).substr(2, 6));
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [trailPos, setTrailPos] = useState({ x: 0, y: 0 });
  const trailRef = useRef({ x: 0, y: 0 });
  const [isOverText, setIsOverText] = useState(false);
  const [caretPos, setCaretPos] = useState({ visible: false, left: 0, top: 0, height: 18 });

  // NEW: holds the real Monaco editor instance once Editor.jsx mounts it,
  // so it can be passed to AIHelper exactly like the old global `editor` was.
  const editorInstanceRef = useRef(null);

  const [user, setUser] = useState({ name: 'Guest', token: null });
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [authTab, setAuthTab] = useState('login');

  const [regForm, setRegForm] = useState({ name: '', email: '', password: '' });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [authError, setAuthError] = useState('');

  const [toast, setToast] = useState({ msg: '', type: '', show: false });
  const [pendingAction, setPendingAction] = useState(null);

  const [panels, setPanels] = useState({
    aiPanel: false, outputPanel: false, roomPanel: false,
    onlinePanel: false, activityPanel: false, chatPanel: false
  });

  const [roomId, setRoomId] = useState('');

  const boilerplates = {
    javascript: `// Welcome to CodeCollab ⚡\n// Join a room and start coding together in real-time\n\nfunction greet(name) {\n  return \`Hello, \${name}! Let's build something amazing.\`;\n}\n\nconsole.log(greet("World"));`,
    typescript: `// Welcome to CodeCollab ⚡\n// Join a room and start coding together in real-time\n\nfunction greet(name: string): string {\n  return \`Hello, \${name}! Let's build something amazing.\`;\n}\n\nconsole.log(greet("World"));`,
    python: `# Welcome to CodeCollab ⚡\n# Join a room and start coding together in real-time\n\ndef greet(name):\n    return f"Hello, {name}! Let's build something amazing."\n\nprint(greet("World"))`,
    java: `// Welcome to CodeCollab ⚡\n// Join a room and start coding together in real-time\n\npublic class Main {\n    public static String greet(String name) {\n        return "Hello, " + name + "! Let's build something amazing.";\n    }\n\n    public static void main(String[] args) {\n        System.out.println(greet("World"));\n    }\n}`,
    cpp: `// Welcome to CodeCollab ⚡\n// Join a room and start coding together in real-time\n#include <iostream>\n#include <string>\nusing namespace std;\n\nstring greet(string name) {\n    return "Hello, " + name + "! Let's build something amazing.";\n}\n\nint main() {\n    cout << greet("World") << endl;\n    return 0;\n}`,
    rust: `// Welcome to CodeCollab ⚡\n// Join a room and start coding together in real-time\n\nfn greet(name: &str) -> String {\n    format!("Hello, {}! Let's build something amazing.", name)\n}\n\nfn main() {\n    println!("{}", greet("World"));\n}`
  };

  const [language, setLanguage] = useState('javascript');
  const [currentCode, setCurrentCode] = useState(boilerplates.javascript);
  const [codeByLang, setCodeByLang] = useState(() => ({ ...boilerplates }));

  const handleLanguageChange = (newLang) => {
    setCodeByLang(prev => {
      const updated = { ...prev, [language]: currentCode };
      setCurrentCode(updated[newLang] !== undefined ? updated[newLang] : (boilerplates[newLang] || ''));
      return updated;
    });
    setLanguage(newLang);
  };

  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [activityLog, setActivityLog] = useState([]);

  useEffect(() => {
    const isTextTarget = (el) => {
      if (!el) return false;
      return !!el.closest('#editor-container, input, textarea, .monaco-editor');
    };

    const moveCursor = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      const target = document.elementFromPoint(e.clientX, e.clientY);
      setIsOverText(isTextTarget(target));
    };
    window.addEventListener('mousemove', moveCursor);

    let animationFrame;
    const animateTrail = () => {
      trailRef.current.x += (cursorPos.x - trailRef.current.x) * 0.15;
      trailRef.current.y += (cursorPos.y - trailRef.current.y) * 0.15;
      setTrailPos({ x: trailRef.current.x, y: trailRef.current.y });
      animationFrame = requestAnimationFrame(animateTrail);
    };
    animateTrail();

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      cancelAnimationFrame(animationFrame);
    };
  }, [cursorPos]);

  useEffect(() => {
    const token = localStorage.getItem("cc_token");
    const name = localStorage.getItem("cc_name");
    if (token && name) { setUser({ name, token }); }
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type, show: true });
    setTimeout(() => setToast({ msg: '', type: '', show: false }), 3000);
  };

  const addActivity = (msg) => {
    setActivityLog(prev => [msg, ...prev].slice(0, 10));
  };

  const requireAuth = (callback) => {
    if (user.token) {
      callback();
    } else {
      setAuthModalVisible(true);
      setPendingAction(() => callback);
    }
  };

  // NEW: matches old app.js's authHeaders() — needed by AIHelper's
  // explain/debug fetch calls, which previously crashed with
  // "authHeaders is not a function" because it was never passed down.
  const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + (user.token || localStorage.getItem('cc_token'))
  });

  const handleAuth = async (isLogin) => {
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const form = isLogin ? loginForm : regForm;

    if (!form.email || !form.password || (!isLogin && !form.name)) {
      setAuthError("All fields required"); return;
    }

    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) { setAuthError(data.message || "Auth failed"); return; }

      localStorage.setItem('cc_token', data.token);
      localStorage.setItem('cc_name', data.name);
      setUser({ name: data.name, token: data.token });
      setAuthModalVisible(false);
      showToast(isLogin ? `Welcome back, ${data.name}!` : 'Account created!', 'success');

      if (pendingAction) { pendingAction(); setPendingAction(null); }
    } catch (e) {
      setAuthError("Server error. Try again.");
    }
  };

  const logout = () => {
    localStorage.removeItem('cc_token');
    localStorage.removeItem('cc_name');
    setUser({ name: 'Guest', token: null });
    showToast('Logged out', 'success');
  };

  const togglePanel = (id) => setPanels({ ...panels, [id]: !panels[id] });

  const handleConnectRoom = (id) => {
    if (!id) { showToast('Enter a room ID', 'error'); return; }
    setConnectionStatus('Connecting...');
    setRoomId(id);

    fetch(`${BASE_URL}/health`).catch(() => {});

    connectWebSocket(id, myId, {
      onConnect: () => {
        setConnectionStatus('Connected');
        showToast(`Joined room: ${id}`, 'success');
        addActivity(`You joined room ${id}`);

        if (user.token) {
          fetch(`${BASE_URL}/api/room/${id}`, {
              headers: { 'Authorization': `Bearer ${user.token}` }
          }).then(r => r.json()).then(room => {
            if (room.currentCode) setCurrentCode(room.currentCode);
            if (room.language) setLanguage(room.language);
          }).catch(() => {});
        }
      },
      onCodeUpdate: (newCode) => setCurrentCode(newCode),
      onUsersUpdate: (users) => setUsersInRoom(users),
      onChatReceive: (msg) => {
        setChatMessages(prev => [...prev, msg]);
        addActivity(`${msg.userId === myId ? 'You' : msg.name}: ${msg.message}`);
      },
      onDisconnect: () => setConnectionStatus('Disconnected'),
      onError: () => setConnectionStatus('Disconnected')
    });
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    if (connectionStatus !== 'Connected') { showToast('Join a room first', 'error'); return; }

    sendSocketChatMessage(roomId, myId, user.name, chatInput);
    setChatInput('');
  };

  return (
    <>
      <div className="cursor" style={{ left: cursorPos.x, top: cursorPos.y }}></div>
      <div className="cursor-trail" style={{ left: trailPos.x, top: trailPos.y }}></div>
      {caretPos.visible && (
        <div
          className="editor-caret"
          style={{ left: caretPos.left, top: caretPos.top, height: caretPos.height }}
        ></div>
      )}
      <div className="noise"></div>

      <div className="app-screen">
        <header className="topbar">
          <div className="topbar-left">
            <div className="app-logo">
              <span className="logo-bracket">{'{'}</span><span className="logo-dot sm"></span><span className="logo-bracket">{'}'}</span>
            </div>
            <span className="app-name">Code-Forge--AI</span>
            <span className="app-credit">Personal project by Adhikari Manohar ⚡️</span>
            <div className="status-pill">
              <span className={`status-dot ${connectionStatus === 'Connected' ? 'connected' : ''}`}></span>
              <span>{connectionStatus}</span>
            </div>
          </div>

          <div className="topbar-center">
            <div className="room-bar">
              <span className="room-label">ROOM</span>
              <input value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder="enter-room-id" spellCheck="false" />
              <button className="room-btn join-btn" onClick={() => requireAuth(() => handleConnectRoom(roomId))}>Join</button>
              <button className="room-btn new-btn" onClick={() => requireAuth(() => handleConnectRoom(Math.random().toString(36).substr(2, 8)))}>+ New</button>
            </div>
          </div>

          <div className="topbar-right">
            <select value={language} onChange={(e) => handleLanguageChange(e.target.value)} className="lang-select">
              <option value="javascript">JS</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="typescript">TS</option>
              <option value="rust">Rust</option>
            </select>
            <div className="user-pill">
              <span className="user-avatar">{user.name.charAt(0).toUpperCase()}</span>
              <span>{user.name}</span>
            </div>
            <button className="logout-btn" onClick={logout}>⏻</button>
          </div>
        </header>

        <div className="app-layout">
          <aside className="sidebar-left">
            <div className={`panel ${panels.aiPanel ? 'collapsed' : ''}`}>
              <div className="panel-header" onClick={() => togglePanel('aiPanel')}>
                <span className="panel-icon">◎</span><span className="panel-title">AI ASSISTANT</span><span className="panel-toggle">▾</span>
              </div>
              <div className="panel-body">
                {/* FIXED: AIHelper now receives the props it actually expects:
                    editor, showAuthModal, showToast, addActivity, authHeaders */}
                <AIHelper
                  editor={editorInstanceRef.current}
                  showAuthModal={() => setAuthModalVisible(true)}
                  showToast={showToast}
                  addActivity={addActivity}
                  authHeaders={authHeaders}
                />
              </div>
            </div>

            <div className={`panel ${panels.outputPanel ? 'collapsed' : ''}`}>
              <div className="panel-header" onClick={() => togglePanel('outputPanel')}>
                <span className="panel-icon">▶</span><span className="panel-title">TERMINAL</span><span className="panel-toggle">▾</span>
              </div>
              <div className="panel-body">
                <Terminal currentCode={currentCode} language={language} addActivity={addActivity} />
              </div>
            </div>

            <div className={`panel ${panels.roomPanel ? 'collapsed' : ''}`}>
              <div className="panel-header" onClick={() => togglePanel('roomPanel')}>
                <span className="panel-icon">◉</span><span className="panel-title">ROOM INFO</span><span className="panel-toggle">▾</span>
              </div>
              <div className="panel-body">
                <div className="room-info-item"><span className="info-label">Room ID</span><span className="info-value">{roomId || '—'}</span></div>
                <div className="room-info-item"><span className="info-label">Language</span><span className="info-value">{language}</span></div>
                <div className="room-info-item"><span className="info-label">Participants</span><span className="info-value">{usersInRoom.length}</span></div>
                <button className="copy-room-btn" onClick={() => { navigator.clipboard.writeText(roomId); showToast('Copied!', 'success'); }}>⎘ Copy Room ID</button>
              </div>
            </div>
          </aside>

          {/* FIXED: pass onEditorMount so App.jsx captures the real Monaco instance */}
          <Editor
            language={language}
            roomId={roomId}
            code={currentCode}
            setCode={setCurrentCode}
            myId={myId}
            onCaretPixelPosition={setCaretPos}
            onEditorMount={(editor) => { editorInstanceRef.current = editor; }}
          />

          <aside className="sidebar-right">
            <div className={`panel ${panels.onlinePanel ? 'collapsed' : ''}`}>
              <div className="panel-header" onClick={() => togglePanel('onlinePanel')}>
                <span className="panel-icon">●</span><span className="panel-title">ONLINE</span><span className="panel-toggle">▾</span>
                <span className="user-count">{usersInRoom.length}</span>
              </div>
              <div className="panel-body">
                <ul className="user-list">
                  {usersInRoom.map((u, i) => <li key={i}>{u === myId ? `${u} (you)` : u}</li>)}
                </ul>
              </div>
            </div>

            <div className={`panel ${panels.activityPanel ? 'collapsed' : ''}`}>
              <div className="panel-header" onClick={() => togglePanel('activityPanel')}>
                <span className="panel-icon">◎</span><span className="panel-title">ACTIVITY</span><span className="panel-toggle">▾</span>
              </div>
              <div className="panel-body">
                <div className="activity-log">
                  {activityLog.map((log, i) => <div key={i} className="activity-item">{log}</div>)}
                </div>
              </div>
            </div>

            <div className={`panel ${panels.chatPanel ? 'collapsed' : ''}`}>
              <div className="panel-header" onClick={() => togglePanel('chatPanel')}>
                <span className="panel-icon">💬</span><span className="panel-title">CHAT</span><span className="panel-toggle">▾</span>
              </div>
              <div className="panel-body">
                <div className="chat-messages">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`chat-msg ${msg.userId === myId ? 'chat-me' : 'chat-them'}`}>
                      <span className="chat-name">{msg.userId === myId ? 'You' : msg.name}</span>
                      <span className="chat-text">{msg.message}</span>
                    </div>
                  ))}
                </div>
                <div className="chat-input-bar">
                  <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendChat()} placeholder="Message..." />
                  <button className="chat-send-btn" onClick={handleSendChat}>→</button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {authModalVisible && (
        <div className="modal-overlay">
          <div className="auth-box modal-box">
            <button className="modal-close" onClick={() => setAuthModalVisible(false)}>✕</button>
            <div className="auth-logo" style={{ marginBottom: '16px', justifyContent: 'center' }}>
              <div className="logo-icon"><span className="logo-bracket">{'{'}</span><span className="logo-dot"></span><span className="logo-bracket">{'}'}</span></div>
              <div className="logo-text"><h1>Sign in</h1><p>Join a room to code</p></div>
            </div>
            <div className="auth-tabs">
              <button className={`tab ${authTab === 'login' ? 'active' : ''}`} onClick={() => setAuthTab('login')}>Sign In</button>
              <button className={`tab ${authTab === 'register' ? 'active' : ''}`} onClick={() => setAuthTab('register')}>Sign Up</button>
            </div>
            <div className="auth-form">
              {authTab === 'register' && (
                <input type="text" placeholder="Name" value={regForm.name} onChange={e => setRegForm({...regForm, name: e.target.value})} className="input-wrap input" />
              )}
              <input type="email" placeholder="Email" value={authTab === 'login' ? loginForm.email : regForm.email} onChange={e => authTab === 'login' ? setLoginForm({...loginForm, email: e.target.value}) : setRegForm({...regForm, email: e.target.value})} className="input-wrap input" />
              <input type="password" placeholder="Password" value={authTab === 'login' ? loginForm.password : regForm.password} onChange={e => authTab === 'login' ? setLoginForm({...loginForm, password: e.target.value}) : setRegForm({...regForm, password: e.target.value})} className="input-wrap input" />
              <button className="auth-btn" onClick={() => handleAuth(authTab === 'login')}>{authTab === 'login' ? 'Sign In' : 'Create Account'}</button>
              <p className="error-msg">{authError}</p>
            </div>
          </div>
        </div>
      )}

      <div className={`toast ${toast.type} ${toast.show ? 'show' : ''}`}>{toast.msg}</div>
    </>
  );
}
