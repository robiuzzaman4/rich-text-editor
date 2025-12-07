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

type MathCategory = {
  name: string;
  items: { label: string; latex: string }[];
};

const MATH_GROUPS: MathCategory[] = [
  {
    name: "Common",
    items: [
      { label: "Fraction", latex: "\\frac{x}{y}" },
      { label: "Power", latex: "x^2" },
      { label: "Square Root", latex: "\\sqrt{x}" },
      { label: "Sum", latex: "\\sum_{i=0}^n x_i" },
      { label: "Integral", latex: "\\int_0^\\infty f(x)dx" },
    ],
  },
  {
    name: "Accents",
    items: [
      { label: "Hat", latex: "\\hat{a}" },
      { label: "Bar", latex: "\\bar{a}" },
      { label: "Dot", latex: "\\dot{a}" },
      { label: "Vec", latex: "\\vec{a}" },
      { label: "Tilde", latex: "\\tilde{a}" },
      { label: "Underline", latex: "\\underline{a}" },
    ],
  },
  {
    name: "Delimiters",
    items: [
      { label: "Parentheses", latex: "(x)" },
      { label: "Brackets", latex: "[x]" },
      { label: "Braces", latex: "\\{x\\}" },
      { label: "Angle", latex: "\\langle x \\rangle" },
      { label: "Pipe", latex: "|x|" },
      { label: "Floor", latex: "\\lfloor x \\rfloor" },
      { label: "Ceil", latex: "\\lceil x \\rceil" },
    ],
  },
  {
    name: "Environments",
    items: [
      { label: "Matrix (2x2)", latex: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}" },
      { label: "Cases", latex: "f(x) = \\begin{cases} x & x \\ge 0 \\\\ -x & x < 0 \\end{cases}" },
      { label: "Aligned", latex: "\\begin{aligned} a &= b + c \\\\ &= d \\end{aligned}" },
      { label: "Bmatrix", latex: "\\begin{Bmatrix} a & b \\\\ c & d \\end{Bmatrix}" },
      { label: "Vmatrix", latex: "\\begin{Vmatrix} a & b \\\\ c & d \\end{Vmatrix}" },
    ],
  },
  {
    name: "Logic & Sets",
    items: [
      { label: "For All", latex: "\\forall" },
      { label: "Exists", latex: "\\exists" },
      { label: "In", latex: "\\in" },
      { label: "Not In", latex: "\\notin" },
      { label: "Subset", latex: "\\subset" },
      { label: "Union", latex: "\\cup" },
      { label: "Intersection", latex: "\\cap" },
      { label: "Infinity", latex: "\\infty" },
      { label: "Implies", latex: "\\implies" },
    ],
  },
  {
    name: "Greek Letters",
    items: [
      { label: "Alpha", latex: "\\alpha" },
      { label: "Beta", latex: "\\beta" },
      { label: "Gamma", latex: "\\gamma" },
      { label: "Delta", latex: "\\Delta" },
      { label: "Theta", latex: "\\theta" },
      { label: "Pi", latex: "\\pi" },
      { label: "Sigma", latex: "\\sigma" },
      { label: "Omega", latex: "\\Omega" },
      { label: "Phi", latex: "\\phi" },
    ],
  },
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

  // const openBlockMathPopover = useCallback((latex: string, pos: number) => {
  //   setEditingMathPos(pos);
  //   setInlinePopoverOpen(false);
  // }, []);

  // Attach to window so Mathematics extension can access them
  useEffect(() => {
    (window as any).__openInlineMathPopover = openInlineMathPopover;
    // (window as any).__openBlockMathPopover = openBlockMathPopover;

    return () => {
      delete (window as any).__openInlineMathPopover;
      // delete (window as any).__openBlockMathPopover;
    };
  }, [openInlineMathPopover]);

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
        <PopoverContent className="w-[400px]" align="end">
          {viewMode === "selection" ? (
            <div className="flex flex-col gap-2">
              <div className="max-h-[400px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-muted [&::-webkit-scrollbar-thumb]:bg-primary/20">
                {MATH_GROUPS.map((group, groupIndex) => (
                  <div key={groupIndex} className="mb-4 last:mb-0">
                    <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                      {group.name}
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {group.items.map((eq, i) => (
                        <button
                          key={i}
                          className="flex flex-col items-center justify-center p-2 rounded hover:bg-muted border transition-colors aspect-square bg-card"
                          onClick={() => handleSelectEquation(eq.latex)}
                          title={eq.label}
                        >
                          <span
                            className="flex items-center justify-center w-full h-full"
                            dangerouslySetInnerHTML={{
                              __html: katex.renderToString(eq.latex, {
                                throwOnError: false,
                                displayMode: false,
                              }),
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <Button
                className="w-full mt-2"
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
                  {editingMathPos !== null
                    ? "Edit Equation"
                    : "Insert Equation"}
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
