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

export default function Editor() {
  const [content, setContent] = useState("");

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
        // blockOptions: {
        //   onClick: (node: any, pos: number) => {
        //     const current = node?.attrs?.latex ?? "";
        //     if ((window as any).__openBlockMathPopover) {
        //       (window as any).__openBlockMathPopover(current, pos);
        //     }
        //   },
        // },
        katexOptions: {
          throwOnError: false,
        },
      }),

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
    content: "<p>Start typing or paste your content here...</p>",
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

  useEffect(() => {
    if (editor) {
      const savedContent = localStorage.getItem("RICH_TEXT_EDITOR_CONTENT");
      if (savedContent) {
        editor.commands.setContent(savedContent);
      }
    }
  }, [editor]);

  const handleSaveDocument = () => {
    localStorage.setItem("RICH_TEXT_EDITOR_CONTENT", content);
    toast.success("Document Saved");
  };

  if (!editor) {
    return (
      <div className="flex items-center justify-center p-8">
        Loading editor...
      </div>
    );
  }

  console.log("content", content);

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-full bg-background shadow rounded-lg overflow-hidden relative">
      <Toolbar editor={editor} />

      {/* Editor Area */}
      <div className="flex-1 overflow-y-auto max-h-[600px]">
        <EditorContent editor={editor} className="h-full" />
      </div>

      <div className="p-4 border-t w-full flex items-center justify-end">
        <Button onClick={handleSaveDocument}>Save Document</Button>
      </div>
    </div>
  );
}
