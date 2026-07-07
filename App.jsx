import React, { useState, useEffect } from 'react';

const App = () => {
  const [activeAuthTab, setActiveAuthTab] = useState('login');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [panels, setPanels] = useState({
    aiPanel: false,
    outputPanel: false,
    roomPanel: false,
    onlinePanel: false,
    activityPanel: false,
    chatPanel: false,
  });

  const togglePanel = (panelName) => {
    setPanels((prev) => ({
      ...prev,
      [panelName]: !prev[panelName],
    }));
  };

  const switchTab = (tab) => setActiveAuthTab(tab);
  const hideAuthModal = () => setShowAuthModal(false);

  // Stub functions for event handlers
  const joinRoom = () => {};
  const generateRoom = () => {};
  const changeLanguage = () => {};
  const logout = () => {};
  const explainCode = () => {};
  const debugCode = () => {};
  const runCode = () => {};
  const copyRoomId = () => {};
  const copyCode = () => {};
  const clearCode = () => {};
  const sendChatMessage = () => {};
  const login = () => {};
  const register = () => {};

  return (
    <>
      <style>{`
        /* ============================================
           CODE-FORGE--AI — DESIGN SYSTEM
           ============================================ */
        :root {
          --bg:         #080810;
          --bg2:        #0d0d1a;
          --bg3:        #12121f;
          --surface:    #15151f;
          --surface2:   #1a1a28;
          --border:     rgba(255,255,255,0.06);
          --border2:    rgba(255,255,255,0.12);
          --accent:     #7fffb2;
          --accent2:    #00e5ff;
          --accent3:    #ff6af0;
          --accent-dim: rgba(127,255,178,0.12);
          --text:       #e8e8f0;
          --text2:      #8888aa;
          --text3:      #444466;
          --red:        #ff4d6a;
          --yellow:     #ffd166;
          --font-display: 'Syne', sans-serif;
          --font-mono:    'JetBrains Mono', monospace;
          --font-ui:      'Space Mono', monospace;
          --radius:     8px;
          --radius-lg:  16px;
          --glow:       0 0 30px rgba(127,255,178,0.15);
          --glow-sm:    0 0 12px rgba(127,255,178,0.2);
        }

        *, *::before, *::after {
          margin: 0; padding: 0;
          box-sizing: border-box;
        }

        html, body {
          width: 100%; height: 100%;
          background: var(--bg);
          color: var(--text);
          font-family: var(--font-ui);
          overflow: hidden;
          cursor: none;
        }

        .cursor {
          width: 8px; height: 8px;
          background: var(--accent);
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          transition: width 0.2s, height 0.2s, background 0.2s;
          mix-blend-mode: difference;
        }

        .cursor-trail {
          width: 32px; height: 32px;
          border: 1px solid rgba(127,255,178,0.4);
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          z-index: 9998;
          transform: translate(-50%, -50%);
          transition: all 0.12s ease;
        }

        body:has(button:hover) .cursor { width: 16px; height: 16px; }

        .noise {
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 9997;
          opacity: 0.4;
        }

        .auth-screen {
          position: fixed; inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          z-index: 100;
        }

        .auth-grid {
          position: absolute; inset: -50%;
          background-image:
            linear-gradient(rgba(127,255,178,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(127,255,178,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          animation: gridMove 20s linear infinite;
          transform-origin: center;
        }

        @keyframes gridMove {
          0%   { transform: perspective(600px) rotateX(20deg) translateY(0); }
          100% { transform: perspective(600px) rotateX(20deg) translateY(60px); }
        }

        .float-code {
          position: absolute;
          font-family: var(--font-mono);
          font-size: 11px;
          color: rgba(127,255,178,0.2);
          white-space: nowrap;
          animation: floatUp 12s linear infinite;
          pointer-events: none;
          letter-spacing: 0.05em;
        }

        .fc1 { left: 5%; animation-delay: 0s; animation-duration: 14s; }
        .fc2 { left: 20%; animation-delay: -3s; animation-duration: 11s; }
        .fc3 { left: 60%; animation-delay: -6s; animation-duration: 16s; }
        .fc4 { left: 75%; animation-delay: -2s; animation-duration: 13s; }
        .fc5 { left: 88%; animation-delay: -8s; animation-duration: 10s; }

        @keyframes floatUp {
          0%   { transform: translateY(110vh); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(-10vh); opacity: 0; }
        }

        .auth-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
          animation: authReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes authReveal {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .auth-logo {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .logo-icon {
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 800;
        }

        .logo-bracket {
          color: var(--accent);
          text-shadow: var(--glow-sm);
        }

        .logo-dot {
          width: 8px; height: 8px;
          background: var(--accent3);
          border-radius: 50%;
          box-shadow: 0 0 12px var(--accent3);
          animation: pulse 2s ease-in-out infinite;
        }

        .logo-dot.sm { width: 5px; height: 5px; }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(0.8); }
        }

        .logo-text h1 {
          font-family: var(--font-display);
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, var(--text) 0%, var(--accent) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .logo-text p {
          font-size: 11px;
          color: var(--text3);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-top: 2px;
        }

        .auth-box {
          width: 400px;
          background: var(--surface);
          border: 1px solid var(--border2);
          border-radius: var(--radius-lg);
          padding: 8px;
          box-shadow:
            0 0 0 1px rgba(127,255,178,0.05),
            0 32px 80px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(255,255,255,0.05);
          backdrop-filter: blur(20px);
        }

        .auth-tabs {
          position: relative;
          display: flex;
          background: var(--bg3);
          border-radius: 10px;
          padding: 4px;
          margin-bottom: 8px;
        }

        .tab {
          flex: 1;
          padding: 10px;
          background: transparent;
          border: none;
          color: var(--text2);
          font-family: var(--font-ui);
          font-size: 12px;
          letter-spacing: 0.1em;
          cursor: none;
          position: relative;
          z-index: 1;
          transition: color 0.3s;
        }

        .tab.active { color: var(--bg); }

        .tab-indicator {
          position: absolute;
          top: 4px; left: 4px;
          width: calc(50% - 4px);
          height: calc(100% - 8px);
          background: var(--accent);
          border-radius: 7px;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: var(--glow-sm);
        }

        .tab-indicator.right { transform: translateX(100%); }

        .auth-form {
          padding: 16px 12px 12px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .input-group label {
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--text3);
        }

        .input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          color: var(--text3);
          font-size: 12px;
          pointer-events: none;
          transition: color 0.3s;
        }

        .input-wrap:focus-within .input-icon { color: var(--accent); }

        .input-wrap input {
          width: 100%;
          padding: 12px 14px 12px 36px;
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          color: var(--text);
          font-family: var(--font-mono);
          font-size: 13px;
          outline: none;
          cursor: none;
          transition: border-color 0.3s, box-shadow 0.3s;
        }

        .input-wrap input:focus {
          border-color: rgba(127,255,178,0.4);
          box-shadow: 0 0 0 3px rgba(127,255,178,0.08);
        }

        .input-wrap input::placeholder { color: var(--text3); }

        .auth-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          background: var(--accent);
          border: none;
          border-radius: var(--radius);
          color: var(--bg);
          font-family: var(--font-ui);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          cursor: none;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .auth-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .auth-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(127,255,178,0.3);
        }
        .auth-btn:hover::before { opacity: 1; }

        .btn-arrow {
          font-size: 16px;
          transition: transform 0.3s;
        }
        .auth-btn:hover .btn-arrow { transform: translateX(4px); }

        .error-msg {
          font-size: 11px;
          color: var(--red);
          min-height: 16px;
          text-align: center;
          letter-spacing: 0.05em;
        }

        .auth-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .auth-tags span {
          padding: 4px 12px;
          border: 1px solid var(--border2);
          border-radius: 20px;
          font-size: 10px;
          color: var(--text3);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .app-screen {
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--bg);
        }

        .topbar {
          height: 52px;
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          padding: 0 16px;
          gap: 16px;
          flex-shrink: 0;
          position: relative;
          z-index: 10;
        }

        .topbar::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          opacity: 0.3;
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .app-logo {
          display: flex;
          align-items: center;
          gap: 3px;
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 800;
        }

        .app-name {
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 700;
          color: var(--text);
          letter-spacing: -0.01em;
        }

        .status-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 3px 10px;
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: 20px;
          font-size: 10px;
          color: var(--text2);
          letter-spacing: 0.08em;
        }

        .status-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--text3);
          transition: background 0.3s, box-shadow 0.3s;
        }

        .status-dot.connected {
          background: var(--accent);
          box-shadow: 0 0 8px var(--accent);
          animation: statusPulse 2s ease-in-out infinite;
        }

        @keyframes statusPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }

        .topbar-center { flex: 2; display: flex; justify-content: center; }

        .room-bar {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 4px 4px 4px 12px;
        }

        .room-label {
          font-size: 9px;
          letter-spacing: 0.2em;
          color: var(--text3);
          white-space: nowrap;
        }

        #roomInput {
          background: transparent;
          border: none;
          outline: none;
          color: var(--accent);
          font-family: var(--font-mono);
          font-size: 12px;
          width: 160px;
          cursor: none;
          letter-spacing: 0.05em;
        }

        #roomInput::placeholder { color: var(--text3); }

        .room-btn {
          padding: 5px 12px;
          border: none;
          border-radius: 6px;
          font-family: var(--font-ui);
          font-size: 11px;
          cursor: none;
          transition: all 0.2s;
          letter-spacing: 0.05em;
        }

        .join-btn {
          background: var(--accent-dim);
          color: var(--accent);
          border: 1px solid rgba(127,255,178,0.2);
        }

        .join-btn:hover {
          background: var(--accent);
          color: var(--bg);
        }

        .new-btn {
          background: var(--accent);
          color: var(--bg);
          font-weight: 700;
        }

        .new-btn:hover {
          box-shadow: var(--glow-sm);
          transform: translateY(-1px);
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          justify-content: flex-end;
        }

        .lang-select {
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          color: var(--text2);
          font-family: var(--font-mono);
          font-size: 11px;
          padding: 5px 10px;
          outline: none;
          cursor: none;
        }

        .user-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px 4px 4px;
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: 20px;
        }

        .user-avatar {
          width: 26px; height: 26px;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          color: var(--bg);
        }

        #loggedInUser {
          font-size: 12px;
          color: var(--text2);
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .logout-btn {
          width: 32px; height: 32px;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          color: var(--text3);
          font-size: 14px;
          cursor: none;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logout-btn:hover {
          border-color: var(--red);
          color: var(--red);
          background: rgba(255,77,106,0.1);
        }

        .app-layout {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        .sidebar-left {
          width: 200px;
          background: var(--surface);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          flex-shrink: 0;
        }

        .sidebar-section {
          padding: 16px 12px;
          border-bottom: 1px solid var(--border);
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .section-title {
          font-size: 9px;
          letter-spacing: 0.2em;
          color: var(--text3);
          font-weight: 700;
        }

        .user-count {
          width: 18px; height: 18px;
          background: var(--accent-dim);
          border: 1px solid rgba(127,255,178,0.2);
          border-radius: 4px;
          font-size: 10px;
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .user-list li {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--text2);
          padding: 4px 0;
          animation: userJoin 0.3s ease forwards;
        }

        @keyframes userJoin {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .user-list li::before {
          content: '';
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 6px var(--accent);
          flex-shrink: 0;
        }

        .activity-log {
          display: flex;
          flex-direction: column;
          gap: 4px;
          max-height: 200px;
          overflow-y: auto;
        }

        .activity-item {
          font-size: 10px;
          color: var(--text3);
          padding: 3px 0;
          border-left: 2px solid var(--border);
          padding-left: 8px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .editor-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
        }

        .editor-topbar {
          height: 36px;
          background: var(--bg2);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 12px 0 0;
        }

        .file-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 20px;
          height: 100%;
          border-right: 1px solid var(--border);
          font-size: 12px;
          color: var(--text2);
          position: relative;
        }

        .file-tab.active {
          color: var(--text);
          background: var(--bg);
        }

        .file-tab.active::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: var(--accent);
          box-shadow: var(--glow-sm);
        }

        .file-icon { color: var(--accent); font-size: 10px; }

        .editor-actions {
          display: flex;
          gap: 4px;
        }

        .action-btn {
          padding: 4px 10px;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 5px;
          color: var(--text3);
          font-family: var(--font-mono);
          font-size: 10px;
          cursor: none;
          transition: all 0.2s;
          letter-spacing: 0.05em;
        }

        .action-btn:hover {
          border-color: var(--accent);
          color: var(--accent);
        }

        #editor-container {
          flex: 1;
          overflow: hidden;
        }

        .editor-statusbar {
          height: 24px;
          background: var(--accent);
          display: flex;
          align-items: center;
          padding: 0 12px;
          gap: 16px;
          font-size: 10px;
          color: var(--bg);
          font-family: var(--font-mono);
          letter-spacing: 0.05em;
        }

        .sync-indicator {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 700;
        }

        .sidebar-right {
          width: 260px;
          background: var(--surface);
          border-left: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          flex-shrink: 0;
        }

        .sidebar-right::-webkit-scrollbar { width: 4px; }
        .sidebar-right::-webkit-scrollbar-track { background: transparent; }
        .sidebar-right::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

        .panel {
          border-bottom: 1px solid var(--border);
          overflow: hidden;
        }

        .panel-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 14px;
          cursor: none;
          transition: background 0.2s;
          user-select: none;
        }

        .panel-header:hover { background: var(--surface2); }

        .panel-icon {
          color: var(--accent);
          font-size: 12px;
          width: 16px;
          text-align: center;
        }

        .panel-title {
          font-size: 9px;
          letter-spacing: 0.2em;
          color: var(--text3);
          font-weight: 700;
          flex: 1;
        }

        .panel-toggle {
          color: var(--text3);
          font-size: 12px;
          transition: transform 0.3s;
        }

        .panel.collapsed .panel-toggle { transform: rotate(-90deg); }
        .panel.collapsed .panel-body { display: none; }

        .panel-body { padding: 12px; }

        .ai-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          margin-bottom: 10px;
        }

        .ai-btn {
          padding: 8px 10px;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          background: var(--bg3);
          color: var(--text2);
          font-family: var(--font-mono);
          font-size: 11px;
          cursor: none;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
          justify-content: center;
        }

        .explain-btn:hover {
          border-color: var(--accent);
          color: var(--accent);
          background: var(--accent-dim);
        }

        .debug-btn:hover {
          border-color: var(--accent3);
          color: var(--accent3);
          background: rgba(255,106,240,0.1);
        }

        .ai-output {
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 10px;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--accent);
          min-height: 80px;
          max-height: 200px;
          overflow-y: auto;
          white-space: pre-wrap;
          line-height: 1.6;
          transition: all 0.3s;
        }

        .ai-output::-webkit-scrollbar { width: 3px; }
        .ai-output::-webkit-scrollbar-thumb { background: var(--border2); }

        .ai-placeholder { color: var(--text3); font-style: italic; }

        .terminal-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .terminal-dots {
          display: flex;
          gap: 5px;
        }

        .terminal-dots span {
          width: 8px; height: 8px;
          border-radius: 50%;
        }

        .terminal-dots span:nth-child(1) { background: var(--red); }
        .terminal-dots span:nth-child(2) { background: var(--yellow); }
        .terminal-dots span:nth-child(3) { background: var(--accent); }

        .run-btn {
          padding: 5px 14px;
          background: var(--accent);
          border: none;
          border-radius: 5px;
          color: var(--bg);
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 700;
          cursor: none;
          transition: all 0.2s;
          letter-spacing: 0.05em;
        }

        .run-btn:hover {
          box-shadow: var(--glow-sm);
          transform: translateY(-1px);
        }

        .terminal-output {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 10px;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--accent2);
          min-height: 80px;
          max-height: 160px;
          overflow-y: auto;
          white-space: pre-wrap;
          line-height: 1.5;
        }

        .terminal-output::-webkit-scrollbar { width: 3px; }
        .terminal-output::-webkit-scrollbar-thumb { background: var(--border2); }

        .room-info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 0;
          border-bottom: 1px solid var(--border);
        }

        .room-info-item:last-of-type { border: none; }

        .info-label {
          font-size: 10px;
          color: var(--text3);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .info-value {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--accent);
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .copy-room-btn {
          width: 100%;
          margin-top: 10px;
          padding: 7px;
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          color: var(--text2);
          font-family: var(--font-mono);
          font-size: 11px;
          cursor: none;
          transition: all 0.2s;
          letter-spacing: 0.05em;
        }

        .copy-room-btn:hover {
          border-color: var(--accent);
          color: var(--accent);
        }

        .toast {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%) translateY(80px);
          background: var(--surface2);
          border: 1px solid var(--border2);
          border-radius: var(--radius);
          padding: 10px 20px;
          font-size: 12px;
          color: var(--text);
          font-family: var(--font-mono);
          letter-spacing: 0.05em;
          z-index: 9990;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s;
          opacity: 0;
          pointer-events: none;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          white-space: nowrap;
        }

        .toast.show {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }

        .toast.success { border-color: rgba(127,255,178,0.4); color: var(--accent); }
        .toast.error   { border-color: rgba(255,77,106,0.4);  color: var(--red); }

        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

        .ai-loading {
          display: flex;
          gap: 4px;
          align-items: center;
          padding: 4px 0;
        }

        .ai-loading span {
          width: 5px; height: 5px;
          background: var(--accent);
          border-radius: 50%;
          animation: aiDot 1.2s ease-in-out infinite;
        }

        .ai-loading span:nth-child(2) { animation-delay: 0.2s; }
        .ai-loading span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes aiDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1; }
        }

        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(8,8,16,0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 500;
        }

        .modal-box {
          position: relative;
          width: 400px;
          animation: authReveal 0.4s cubic-bezier(0.16,1,0.3,1) forwards;
        }

        .modal-close {
          position: absolute;
          top: 12px; right: 12px;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 6px;
          color: var(--text3);
          width: 28px; height: 28px;
          cursor: none;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .modal-close:hover {
          border-color: var(--red);
          color: var(--red);
        }

        .footer {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          text-align: center;
          padding: 6px;
          font-size: 11px;
          color: var(--text3);
          font-family: var(--font-mono);
          background: var(--bg);
          border-top: 1px solid var(--border);
          letter-spacing: 0.08em;
          z-index: 50;
        }

        .footer a {
          color: var(--accent);
          text-decoration: none;
        }

        .footer a:hover {
          text-decoration: underline;
        }

        .chat-messages {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 200px;
          overflow-y: auto;
          margin-bottom: 10px;
          padding: 4px 0;
        }

        .chat-messages::-webkit-scrollbar { width: 3px; }
        .chat-messages::-webkit-scrollbar-thumb { background: var(--border2); }

        .chat-msg {
          display: flex;
          flex-direction: column;
          gap: 2px;
          max-width: 90%;
        }

        .chat-me {
          align-self: flex-end;
          align-items: flex-end;
        }

        .chat-them {
          align-self: flex-start;
          align-items: flex-start;
        }

        .chat-name {
          font-size: 9px;
          color: var(--text3);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .chat-text {
          padding: 6px 10px;
          border-radius: 8px;
          font-size: 12px;
          font-family: var(--font-mono);
          line-height: 1.4;
          word-break: break-word;
        }

        .chat-me .chat-text {
          background: var(--accent);
          color: var(--bg);
          border-bottom-right-radius: 2px;
        }

        .chat-them .chat-text {
          background: var(--surface2);
          color: var(--text);
          border: 1px solid var(--border);
          border-bottom-left-radius: 2px;
        }

        .chat-input-bar {
          display: flex;
          gap: 6px;
          align-items: center;
        }

        .chat-input-bar input {
          flex: 1;
          padding: 8px 10px;
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          color: var(--text);
          font-family: var(--font-mono);
          font-size: 12px;
          outline: none;
        }

        .chat-input-bar input:focus {
          border-color: rgba(127,255,178,0.4);
        }

        .chat-send-btn {
          width: 32px; height: 32px;
          background: var(--accent);
          border: none;
          border-radius: var(--radius);
          color: var(--bg);
          font-size: 14px;
          font-weight: 700;
          cursor: none;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .chat-send-btn:hover {
          box-shadow: var(--glow-sm);
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .cursor, .cursor-trail { display: none; }
          body { cursor: auto; }
          button, input, select { cursor: auto; }

          .topbar {
            flex-wrap: wrap;
            height: auto;
            padding: 8px 12px;
            gap: 8px;
          }

          .topbar-left { flex: 1; min-width: 0; }
          .topbar-center { order: 3; width: 100%; }
          .topbar-right { gap: 6px; }
          .app-name { display: none; }

          .room-bar { width: 100%; justify-content: space-between; }
          #roomInput { width: 100%; flex: 1; }

          .app-layout { flex-direction: column; overflow-y: auto; }
          .editor-main { height: 55vh; min-height: 300px; }

          .sidebar-left {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid var(--border);
            flex-direction: row;
            overflow-x: auto;
            overflow-y: hidden;
            height: auto;
            order: 2;
          }

          .sidebar-left .panel {
            min-width: 260px;
            border-bottom: none;
            border-right: 1px solid var(--border);
            flex-shrink: 0;
          }

          .sidebar-right {
            width: 100%;
            border-left: none;
            border-top: 1px solid var(--border);
            flex-direction: row;
            overflow-x: auto;
            overflow-y: hidden;
            height: auto;
            order: 3;
          }

          .sidebar-right .sidebar-section {
            min-width: 200px;
            border-bottom: none;
            border-right: 1px solid var(--border);
            flex-shrink: 0;
          }

          .sidebar-chat {
            min-width: 260px !important;
          }

          .editor-statusbar { font-size: 9px; gap: 8px; padding: 0 8px; }
          .modal-box { width: 95vw; max-width: 400px; }
          #loggedInUser { max-width: 60px; font-size: 11px; }
          .lang-select { font-size: 10px; padding: 4px 6px; }
          .topbar-right { flex: 0; }
          .editor-actions { display: none; }
          .room-btn { padding: 5px 8px; font-size: 10px; }
        }
      `}</style>

      {/* CURSOR */}
      <div className="cursor" id="cursor"></div>
      <div className="cursor-trail" id="cursorTrail"></div>

      {/* NOISE OVERLAY */}
      <div className="noise"></div>

      {/* MAIN APP */}
      <div id="appScreen" className="app-screen">

        {/* TOP BAR */}
        <header className="topbar">
          <div className="topbar-left">
            <div className="app-logo">
              <span className="logo-bracket">{'{'}</span>
              <span className="logo-dot sm"></span>
              <span className="logo-bracket">{'}'}</span>
            </div>
            <span className="app-name">Code-Forge--AI</span>
            <div className="status-pill">
              <span className="status-dot" id="statusDot"></span>
              <span id="statusText">Disconnected</span>
            </div>
          </div>

          <div className="topbar-center">
            <div className="room-bar">
              <span className="room-label">ROOM</span>
              <input id="roomInput" placeholder="enter-room-id" spellCheck="false" />
              <button className="room-btn join-btn" onClick={joinRoom}>Join</button>
              <button className="room-btn new-btn" onClick={generateRoom}>+ New</button>
            </div>
          </div>

          <div className="topbar-right">
            <select id="langSelect" onChange={changeLanguage} className="lang-select">
              <option value="javascript">JS</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="typescript">TS</option>
              <option value="rust">Rust</option>
            </select>
            <div className="user-pill">
              <span className="user-avatar" id="userAvatar">G</span>
              <span id="loggedInUser">Guest</span>
            </div>
            <button className="logout-btn" onClick={logout}>⏻</button>
          </div>
        </header>

        {/* MAIN LAYOUT */}
        <div className="app-layout">

          {/* SIDEBAR LEFT — AI, Terminal, Room Info */}
          <aside className="sidebar-left">

            <div className={`panel ${panels.aiPanel ? 'collapsed' : ''}`} id="aiPanel">
              <div className="panel-header" onClick={() => togglePanel('aiPanel')}>
                <span className="panel-icon">◎</span>
                <span className="panel-title">AI ASSISTANT</span>
                <span className="panel-toggle">▾</span>
              </div>
              <div className="panel-body">
                <div className="ai-buttons">
                  <button className="ai-btn explain-btn" onClick={explainCode}>
                    <span>✦</span> Explain
                  </button>
                  <button className="ai-btn debug-btn" onClick={debugCode}>
                    <span>◈</span> Debug
                  </button>
                </div>
                <div id="aiOutput" className="ai-output">
                  <span className="ai-placeholder">Select code and ask AI...</span>
                </div>
              </div>
            </div>

            <div className={`panel ${panels.outputPanel ? 'collapsed' : ''}`} id="outputPanel">
              <div className="panel-header" onClick={() => togglePanel('outputPanel')}>
                <span className="panel-icon">▶</span>
                <span className="panel-title">TERMINAL</span>
                <span className="panel-toggle">▾</span>
              </div>
              <div className="panel-body">
                <div className="terminal-bar">
                  <span className="terminal-dots">
                    <span></span><span></span><span></span>
                  </span>
                  <button className="run-btn" onClick={runCode}>▶ Run</button>
                </div>
                <pre id="codeOutput" className="terminal-output">~ ready to execute...</pre>
              </div>
            </div>

            <div className={`panel ${panels.roomPanel ? 'collapsed' : ''}`} id="roomPanel">
              <div className="panel-header" onClick={() => togglePanel('roomPanel')}>
                <span className="panel-icon">◉</span>
                <span className="panel-title">ROOM INFO</span>
                <span className="panel-toggle">▾</span>
              </div>
              <div className="panel-body">
                <div className="room-info-item">
                  <span className="info-label">Room ID</span>
                  <span className="info-value" id="currentRoomDisplay">—</span>
                </div>
                <div className="room-info-item">
                  <span className="info-label">Language</span>
                  <span className="info-value" id="currentLangDisplay">JavaScript</span>
                </div>
                <div className="room-info-item">
                  <span className="info-label">Participants</span>
                  <span className="info-value" id="participantCount">0</span>
                </div>
                <button className="copy-room-btn" onClick={copyRoomId}>⎘ Copy Room ID</button>
              </div>
            </div>

          </aside>

          {/* EDITOR CENTER */}
          <main className="editor-main">
            <div className="editor-topbar">
              <div className="file-tab active">
                <span className="file-icon">◈</span>
                <span id="fileTabName">main.js</span>
              </div>
              <div className="editor-actions">
                <button className="action-btn" onClick={copyCode}>⎘ Copy</button>
                <button className="action-btn" onClick={clearCode}>⌫ Clear</button>
              </div>
            </div>
            <div id="editor-container"></div>
            <div className="editor-statusbar">
              <span id="cursorPos">Ln 1, Col 1</span>
              <span id="langBadge">JavaScript</span>
              <span id="charCount">0 chars</span>
              <span className="sync-indicator" id="syncIndicator">● Synced</span>
            </div>
          </main>

          {/* SIDEBAR RIGHT — Online, Activity, Chat */}
          <aside className="sidebar-right">

            <div className={`panel ${panels.onlinePanel ? 'collapsed' : ''}`} id="onlinePanel">
              <div className="panel-header" onClick={() => togglePanel('onlinePanel')}>
                <span className="panel-icon">●</span>
                <span className="panel-title">ONLINE</span>
                <span className="panel-toggle">▾</span>
                <span className="user-count" id="userCount">0</span>
              </div>
              <div className="panel-body">
                <ul id="userList" className="user-list"></ul>
              </div>
            </div>

            <div className={`panel ${panels.activityPanel ? 'collapsed' : ''}`} id="activityPanel">
              <div className="panel-header" onClick={() => togglePanel('activityPanel')}>
                <span className="panel-icon">◎</span>
                <span className="panel-title">ACTIVITY</span>
                <span className="panel-toggle">▾</span>
              </div>
              <div className="panel-body">
                <div id="activityLog" className="activity-log"></div>
              </div>
            </div>

            <div className={`panel ${panels.chatPanel ? 'collapsed' : ''}`} id="chatPanel">
              <div className="panel-header" onClick={() => togglePanel('chatPanel')}>
                <span className="panel-icon">💬</span>
                <span className="panel-title">CHAT</span>
                <span className="panel-toggle">▾</span>
              </div>
              <div className="panel-body">
                <div id="chatMessages" className="chat-messages"></div>
                <div className="chat-input-bar">
                  <input
                    id="chatInput"
                    placeholder="Message..."
                    onKeyDown={(e) => { if (e.key === 'Enter') sendChatMessage(); }}
                  />
                  <button className="chat-send-btn" onClick={sendChatMessage}>→</button>
                </div>
              </div>
            </div>

          </aside>
        </div>
      </div>

      {/* AUTH MODAL */}
      <div id="authModal" className="modal-overlay" style={{ display: showAuthModal ? 'flex' : 'none' }}>
        <div className="auth-box modal-box">
          <button className="modal-close" onClick={hideAuthModal}>✕</button>

          <div className="auth-logo" style={{ marginBottom: '16px', justifyContent: 'center' }}>
            <div className="logo-icon">
              <span className="logo-bracket">{'{'}</span>
              <span className="logo-dot"></span>
              <span className="logo-bracket">{'}'}</span>
            </div>
            <div className="logo-text">
              <h1>Sign in to collaborate</h1>
              <p>Join a room to start coding together</p>
            </div>
          </div>

          <div className="auth-tabs">
            <button className={`tab ${activeAuthTab === 'login' ? 'active' : ''}`} id="loginTab" onClick={() => switchTab('login')}>Sign In</button>
            <button className={`tab ${activeAuthTab === 'register' ? 'active' : ''}`} id="registerTab" onClick={() => switchTab('register')}>Sign Up</button>
            <div className={`tab-indicator ${activeAuthTab === 'register' ? 'right' : ''}`} id="tabIndicator"></div>
          </div>

          <div id="loginForm" className="auth-form" style={{ display: activeAuthTab === 'login' ? 'flex' : 'none' }}>
            <div className="input-group">
              <label>Email</label>
              <div className="input-wrap">
                <span className="input-icon">✦</span>
                <input id="loginEmail" type="email" placeholder="you@example.com" />
              </div>
            </div>
            <div className="input-group">
              <label>Password</label>
              <div className="input-wrap">
                <span className="input-icon">◈</span>
                <input id="loginPassword" type="password" placeholder="••••••••" />
              </div>
            </div>
            <button className="auth-btn" onClick={login}>
              <span>Sign In</span>
              <span className="btn-arrow">→</span>
            </button>
            <p id="loginError" className="error-msg"></p>
          </div>

          <div id="registerForm" className="auth-form" style={{ display: activeAuthTab === 'register' ? 'flex' : 'none' }}>
            <div className="input-group">
              <label>Full Name</label>
              <div className="input-wrap">
                <span className="input-icon">◉</span>
                <input id="regName" type="text" placeholder="Your name" />
              </div>
            </div>
            <div className="input-group">
              <label>Email</label>
              <div className="input-wrap">
                <span className="input-icon">✦</span>
                <input id="regEmail" type="email" placeholder="you@example.com" />
              </div>
            </div>
            <div className="input-group">
              <label>Password</label>
              <div className="input-wrap">
                <span className="input-icon">◈</span>
                <input id="regPassword" type="password" placeholder="••••••••" />
              </div>
            </div>
            <button className="auth-btn" onClick={register}>
              <span>Create Account</span>
              <span className="btn-arrow">→</span>
            </button>
            <p id="registerError" className="error-msg"></p>
          </div>

        </div>
      </div>

      {/* TOAST */}
      <div id="toast" className="toast"></div>

      {/* FOOTER */}
      <div className="footer">
        Built with ⚡ by <a href="https://github.com/adhikarimanohard-design" target="_blank" rel="noreferrer">Adhikari Manohar</a>
      </div>
    </>
  );
};

export default App;
