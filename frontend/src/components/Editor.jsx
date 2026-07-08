import { useState, useRef, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { sendSocketCodeUpdate } from '../utils/socket';

export default function Editor({ language, roomId, code, setCode, myId, onCaretPixelPosition, onEditorMount }) {
  const [cursorPos, setCursorPos] = useState('Ln 1, Col 1');
  const [charCount, setCharCount] = useState(code.length);
  const [syncStatus, setSyncStatus] = useState('● Synced');

  const editorRef = useRef(null);
  const debounceTimer = useRef(null);

  useEffect(() => {
    setCharCount(code.length);
  }, [code]);

  const handleEditorWillMount = (monaco) => {
    monaco.editor.defineTheme('codecollab', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '444466', fontStyle: 'italic' },
        { token: 'keyword', foreground: '7fffb2', fontStyle: 'bold' },
        { token: 'string', foreground: 'ffd166' },
        { token: 'number', foreground: '00e5ff' },
        { token: 'type', foreground: 'ff6af0' },
        { token: 'function', foreground: '7fffb2' },
        { token: 'variable', foreground: 'e8e8f0' },
        { token: 'operator', foreground: '00e5ff' },
      ],
      colors: {
        'editor.background': '#080810',
        'editor.foreground': '#e8e8f0',
        'editorLineNumber.foreground': '#333355',
        'editorLineNumber.activeForeground': '#7fffb2',
        'editor.lineHighlightBackground': '#0d0d1a',
        'editor.selectionBackground': '#7fffb220',
        'editor.inactiveSelectionBackground': '#7fffb210',
        'editorCursor.foreground': '#7fffb2',
        'editorWhitespace.foreground': '#1a1a2e',
        'editorIndentGuide.background': '#1a1a2e',
        'editorIndentGuide.activeBackground': '#333355',
      }
    });
  };

  // Reports the exact on-screen pixel position of Monaco's own text caret
  // (not the mouse) up to the parent, so a custom cursor overlay can be
  // rendered exactly beside the last typed character instead of guessing
  // from mouse coordinates.
  const reportCaretPixelPosition = (editor) => {
    if (!onCaretPixelPosition) return;
    const position = editor.getPosition();
    if (!position) return;
    const visiblePos = editor.getScrolledVisiblePosition(position);
    if (!visiblePos) return;
    const domNode = editor.getDomNode();
    if (!domNode) return;
    const rect = domNode.getBoundingClientRect();
    onCaretPixelPosition({
      left: rect.left + visiblePos.left,
      top: rect.top + visiblePos.top,
      height: visiblePos.height,
      visible: true
    });
  };

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;

    // NEW: expose the real Monaco editor instance to the parent (App.jsx)
    // so it can be passed down to AIHelper for explain/debug/run, exactly
    // like old code relied on the global `editor` variable.
    if (onEditorMount) onEditorMount(editor);

    editor.onDidChangeCursorPosition((e) => {
      setCursorPos(`Ln ${e.position.lineNumber}, Col ${e.position.column}`);
      reportCaretPixelPosition(editor);
    });

    // Keep the overlay caret glued to the text position while scrolling,
    // typing, or resizing — Monaco fires these independently of cursor moves.
    editor.onDidScrollChange(() => reportCaretPixelPosition(editor));
    editor.onDidLayoutChange(() => reportCaretPixelPosition(editor));

    editor.onDidFocusEditorText(() => reportCaretPixelPosition(editor));
    editor.onDidBlurEditorText(() => {
      if (onCaretPixelPosition) onCaretPixelPosition({ visible: false });
    });
  };

  const handleEditorChange = (value) => {
    const val = value || '';
    setCode(val);
    setCharCount(val.length);
    setSyncStatus('↑ Syncing...');

    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      if (roomId) {
        sendSocketCodeUpdate(roomId, val, myId);
      }
      setSyncStatus('● Synced');
    }, 300);

    if (editorRef.current) reportCaretPixelPosition(editorRef.current);
  };

  const clearCode = () => { setCode(''); setCharCount(0); };
  const copyCode = () => { navigator.clipboard.writeText(code); };

  const getFileExtension = (lang) => {
    const map = { javascript: 'js', java: 'java', python: 'py', cpp: 'cpp', typescript: 'ts', rust: 'rs' };
    return map[lang] || 'js';
  };

  return (
    <main className="editor-main">
      <div className="editor-topbar">
        <div className="file-tab active">
          <span className="file-icon">◈</span>
          <span>main.{getFileExtension(language)}</span>
        </div>
        <div className="editor-actions">
          <button className="action-btn" onClick={copyCode}>⎘ Copy</button>
          <button className="action-btn" onClick={clearCode}>⌫ Clear</button>
        </div>
      </div>

      <div id="editor-container" style={{ flex: 1, overflow: 'hidden' }}>
        <MonacoEditor
          height="100%"
          language={language}
          theme="codecollab"
          value={code}
          beforeMount={handleEditorWillMount}
          onMount={handleEditorMount}
          onChange={handleEditorChange}
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace",
            minimap: { enabled: false },
            padding: { top: 16, bottom: 16 },
            smoothScrolling: true,
            wordWrap: 'on',
            cursorBlinking: 'solid'
          }}
        />
      </div>

      <div className="editor-statusbar">
        <span>{cursorPos}</span>
        <span>{language.charAt(0).toUpperCase() + language.slice(1)}</span>
        <span>{charCount} chars</span>
        <span className="sync-indicator">{syncStatus}</span>
      </div>
    </main>
  );
}
