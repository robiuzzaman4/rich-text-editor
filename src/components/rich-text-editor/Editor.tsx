/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import { Button } from "@/components/ui/button";
import { Table } from "@tiptap/extension-table";
import { Toolbar } from "./Toolbar";
import "katex/dist/katex.min.css";
import { Mathematics } from "@tiptap/extension-mathematics";
import { toast } from "sonner";
import Highlight from "@tiptap/extension-highlight";
import { cn } from "@/lib/utils";

export default function Editor({
  content,
  setContent,
  editorAreaClassName,
}: {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  editorAreaClassName?: string;
}) {


  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Mathematics.configure({
        inlineOptions: {
          onClick: (node: any, pos: number) => {

            const current = node?.attrs?.latex ?? "";
            if ((window as any).__openInlineMathPopover) {
              (window as any).__openInlineMathPopover(current, pos);
            }
          },
        },
        katexOptions: {
          throwOnError: false,
        },
      }),

      Highlight.configure({ multicolor: true }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Typography,
      Subscript,
      Superscript,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert max-w-none focus:outline-none p-6 text-foreground [&_h1]:text-3xl [&_h2]:text-2xl [&_h3]:text-xl [&_p]:text-base [&_p]:leading-relaxed [&_table]:border-collapse [&_table]:w-full [&_table_th]:border [&_table_th]:p-2 [&_table_th]:bg-muted [&_table_td]:border [&_table_td]:p-2",
      },
    },
    onUpdate: ({ editor }) => {
      // setContent(editor.getHTML());
      const html = editor.getHTML();
      setContent((prev) => (prev === html ? prev : html));
    },
    immediatelyRender: false,
  });

  // Sync content updates from parent if they differ significantly (e.g. loading saved state)
  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      // Simple check to avoid loop, but might need more robust comparison if HTML varies slightly.
      // For this use case (loading initial state), this is sufficient.
      // We only update if the editor content is "empty" or default, OR if we strictly want to enforce parent state.
      // To avoid cursor jumping while typing, we typically don't set content here unless it's a "reset" or "load".
      // Let's assume the parent only sets 'content' initially or on reset.
      if (editor.getText() === "" || content !== editor.getHTML()) {
        // Check if it really needs update to avoid cursor reset on every keystroke if parent updates fast
        // A common pattern is to only set if the editor is not focused? 
        // For now, let's rely on the initial 'content' prop for the main load.
        // If we really need reactive updates (like resetting the form), we do this:
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center p-8">
        Loading content...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background shadow rounded-lg overflow-hidden border">
      <Toolbar editor={editor} />

      {/* Editor Area */}
      <div className={cn("flex-1 overflow-y-auto min-h-[150px]", editorAreaClassName)}>
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  );
}
