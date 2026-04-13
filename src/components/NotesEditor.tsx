import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef } from "react";
import "./NotesEditor.css";

interface NotesEditorProps {
  initialHtml: string;
  onSave: (html: string) => void;
  autoFocus?: boolean;
}

export function NotesEditor({ initialHtml, onSave, autoFocus }: NotesEditorProps) {
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  const pendingHtmlRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = () => {
    console.log("[NotesEditor] flush() called", {
      hasTimer: !!timerRef.current,
      pending: pendingHtmlRef.current,
    });
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (pendingHtmlRef.current !== null) {
      const html = pendingHtmlRef.current;
      pendingHtmlRef.current = null;
      console.log("[NotesEditor] flush -> calling onSave", html);
      onSaveRef.current(html);
    } else {
      console.log("[NotesEditor] flush -> nothing pending");
    }
  };

  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder: "添加备注…" })],
    content: initialHtml || "",
    autofocus: autoFocus ? "end" : false,
    editorProps: {
      attributes: {
        class: "notes-editor-content",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.isEmpty ? "" : editor.getHTML();
      console.log("[NotesEditor] onUpdate", html);
      pendingHtmlRef.current = html;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        console.log("[NotesEditor] debounce timer fired");
        timerRef.current = null;
        if (pendingHtmlRef.current !== null) {
          const toSave = pendingHtmlRef.current;
          pendingHtmlRef.current = null;
          console.log("[NotesEditor] timer -> calling onSave", toSave);
          onSaveRef.current(toSave);
        }
      }, 400);
    },
    onBlur: () => {
      console.log("[NotesEditor] onBlur fired");
      flush();
    },
  });

  // Sync content when initialHtml changes externally (e.g. refetch from another
  // source). Skip while the user is focused/typing to avoid cursor jumps, and
  // skip when we still have a pending save that will soon reflect on the server.
  useEffect(() => {
    if (!editor || editor.isFocused) return;
    if (pendingHtmlRef.current !== null) return;
    const current = editor.isEmpty ? "" : editor.getHTML();
    if (current !== initialHtml) {
      editor.commands.setContent(initialHtml || "", { emitUpdate: false });
    }
  }, [editor, initialHtml]);

  // Flush pending content on unmount (e.g. user toggles notes hidden quickly).
  useEffect(() => {
    console.log("[NotesEditor] mounted");
    return () => {
      console.log("[NotesEditor] unmount cleanup -> flush");
      flush();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!editor) return null;

  const btn = (active: boolean) =>
    `notes-toolbar-btn${active ? " active" : ""}`;

  return (
    <div className="notes-editor" onClick={(e) => e.stopPropagation()}>
      <div className="notes-toolbar">
        <button
          type="button"
          className={btn(editor.isActive("bold"))}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="加粗"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          className={btn(editor.isActive("italic"))}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="斜体"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          className={btn(editor.isActive("strike"))}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="删除线"
        >
          <s>S</s>
        </button>
        <span className="notes-toolbar-sep" />
        <button
          type="button"
          className={btn(editor.isActive("bulletList"))}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="无序列表"
        >
          •
        </button>
        <button
          type="button"
          className={btn(editor.isActive("orderedList"))}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="有序列表"
        >
          1.
        </button>
        <button
          type="button"
          className={btn(editor.isActive("codeBlock"))}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          title="代码块"
        >
          {"</>"}
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
