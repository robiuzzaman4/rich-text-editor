/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useCallback, useEffect } from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Textarea } from "../ui/textarea";
import katex from "katex";

type Props = {
  editor: Editor | null;
};

type ViewMode = "selection" | "custom";

const COMMON_EQUATIONS = [
  { label: "Fraction", latex: "\\frac{x}{y}" },
  { label: "Square Root", latex: "\\sqrt{x}" },
  { label: "Power", latex: "x^2" },
  { label: "Subscript", latex: "x_1" },
  { label: "Integral", latex: "\\int_0^\\infty f(x)dx" },
  { label: "Sum", latex: "\\sum_{i=0}^n x_i" },
  { label: "Limit", latex: "\\lim_{x \\to 0}" },
  { label: "Matrix", latex: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}" },
  { label: "Quadratic", latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}" },
  { label: "Infinity", latex: "\\infty" },
  { label: "Pi", latex: "\\pi" },
  { label: "Theta", latex: "\\theta" },
  { label: "Alpha", latex: "\\alpha" },
  { label: "Beta", latex: "\\beta" },
  { label: "Gamma", latex: "\\gamma" },
  { label: "Delta", latex: "\\Delta" },
];

export function ToolbarMathControls({ editor }: Props) {
  const [inlineLatex, setInlineLatex] = useState("");
  const [inlinePopoverOpen, setInlinePopoverOpen] = useState(false);
  const [editingMathPos, setEditingMathPos] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("selection");

  // Expose these functions globally so the Mathematics extension can call them
  const openInlineMathPopover = useCallback((latex: string, pos: number) => {
    setInlineLatex(latex);
    setEditingMathPos(pos);
    setViewMode("custom"); // Always open custom mode when editing
    setInlinePopoverOpen(true);
  }, []);

  const openBlockMathPopover = useCallback((latex: string, pos: number) => {
    setEditingMathPos(pos);
    setInlinePopoverOpen(false);
  }, []);

  // Attach to window so Mathematics extension can access them
  useEffect(() => {
    (window as any).__openInlineMathPopover = openInlineMathPopover;
    (window as any).__openBlockMathPopover = openBlockMathPopover;

    return () => {
      delete (window as any).__openInlineMathPopover;
      delete (window as any).__openBlockMathPopover;
    };
  }, [openInlineMathPopover, openBlockMathPopover]);

  const insertInlineMath = (latex: string) => {
    if (!editor) return;
    try {
      if (
        (editor as any).commands &&
        (editor as any).commands.insertInlineMath
      ) {
        (editor as any).chain().focus().insertInlineMath({ latex }).run();
        return;
      }
    } catch { }
    editor
      .chain()
      .focus()
      .insertContent({ type: "inlineMath", attrs: { latex } })
      .run();
  };

  const updateInlineMathAtPos = (pos: number, latex: string) => {
    if (!editor) return;
    try {
      if (
        (editor as any).commands &&
        (editor as any).commands.updateInlineMath
      ) {
        editor
          .chain()
          .setNodeSelection(pos)
          .updateInlineMath({ latex })
          .focus()
          .run();
        return;
      }
    } catch { }
    editor
      .chain()
      .setNodeSelection(pos)
      .deleteSelection()
      .insertContent({ type: "inlineMath", attrs: { latex } })
      .focus()
      .run();
  };

  const handleSave = () => {
    if (editingMathPos !== null) {
      updateInlineMathAtPos(editingMathPos, inlineLatex);
    } else {
      insertInlineMath(inlineLatex);
    }
    closePopover();
  };

  const handleSelectEquation = (latex: string) => {
    insertInlineMath(latex);
    closePopover();
  };

  const closePopover = () => {
    setInlineLatex("");
    setEditingMathPos(null);
    setInlinePopoverOpen(false);
    setViewMode("selection");
  };

  const handleOpenChange = (open: boolean) => {
    setInlinePopoverOpen(open);
    if (open) {
      // If opening fresh (not via editing callback), reset to selection
      if (editingMathPos === null) {
        setViewMode("selection");
        setInlineLatex("");
      }
    } else {
      setEditingMathPos(null);
      setInlineLatex("");
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Popover open={inlinePopoverOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button variant="secondary" size="sm">
            Math 𝑓
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[340px]" align="end">
          {viewMode === "selection" ? (
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto p-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-muted [&::-webkit-scrollbar-thumb]:bg-primary/20">
                {COMMON_EQUATIONS.map((eq, i) => (
                  <button
                    key={i}
                    className="flex flex-col items-center justify-center p-2 rounded hover:bg-muted border transition-colors aspect-square"
                    onClick={() => handleSelectEquation(eq.latex)}
                    title={eq.label}
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html: katex.renderToString(eq.latex, {
                          throwOnError: false,
                          displayMode: false,
                        }),
                      }}
                    />
                    {/* <span className="text-[10px] text-muted-foreground mt-1 truncate w-full text-center">{eq.label}</span> */}
                  </button>
                ))}
              </div>
              <Button
                className="w-full"
                onClick={() => setViewMode("custom")}
                variant="default"
              >
                Insert Custom
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">
                  {editingMathPos !== null ? "Edit Equation" : "Insert Equation"}
                </span>
                {editingMathPos === null && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => setViewMode("selection")}
                  >
                    Back
                  </Button>
                )}
              </div>
              <Textarea
                value={inlineLatex}
                onChange={(e) => setInlineLatex(e.target.value)}
                placeholder="e.g. \int_0^\infty e^{-x} dx = 1"
                className="border p-2 rounded h-24 font-mono text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSave();
                  }
                }}
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <Button onClick={closePopover} size="sm" variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleSave} size="sm">
                  {editingMathPos !== null ? "Update" : "Insert"}
                </Button>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
