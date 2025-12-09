/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { LATEX_LIST } from "./latex-list";

type Props = {
  editor: Editor | null;
};

type ViewMode = "selection" | "custom";

export function ToolbarMathControls({ editor }: Props) {
  const [inlineLatex, setInlineLatex] = useState("");
  const [inlinePopoverOpen, setInlinePopoverOpen] = useState(false);
  const [editingMathPos, setEditingMathPos] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("selection");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);

  const handleCursorUpdate = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    setCursorPosition(e.currentTarget.selectionStart);
  };

  const handleInsertSymbol = (symbol: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const text = inlineLatex;
      const before = text.substring(0, start);
      const after = text.substring(end);
      const newText = before + symbol + after;

      setInlineLatex(newText);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(start + symbol.length, start + symbol.length);
          setCursorPosition(start + symbol.length);
        }
      }, 0);
    } else {
      setInlineLatex((prev) => prev ? `${prev} ${symbol}` : symbol);
    }
  };

  useEffect(() => {
    if (inlinePopoverOpen && viewMode === "custom") {
      setTimeout(() => {
        if (textareaRef.current) {
          const length = textareaRef.current.value.length;
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(length, length);
          setCursorPosition(length);
        }
      }, 0);
    }
  }, [viewMode, inlinePopoverOpen]);

  // Expose these functions globally so the Mathematics extension can call them
  const openInlineMathPopover = useCallback((latex: string, pos: number) => {
    setInlineLatex(latex);
    setEditingMathPos(pos);
    setViewMode("custom"); // Always open custom mode when editing
    setInlinePopoverOpen(true);
  }, []);

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
                {LATEX_LIST.map((group, groupIndex) => (
                  <div key={groupIndex} className="mb-4 last:mb-0">
                    <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                      {group.name}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((eq, i) => {
                        return (
                          <Badge title={eq.latex} key={i} onClick={() => handleSelectEquation(eq.latex)}
                            className="hover:cursor-pointer"
                            variant={
                              group.name === "Common" ? "emerald" :
                                group.name === "Accents" ? "orange" :
                                  group.name === "Delimiters" ? "indigo" :
                                    group.name === "Environments" ? "blue" :
                                      group.name === "Logic & Sets" ? "yellow" :
                                        group.name === "Greek Letters" ? "fuchsia" :
                                          "default"
                            }

                          >
                            {eq.label}
                          </Badge>
                        )
                      })}
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
                ref={textareaRef}
                value={inlineLatex}
                onChange={(e) => setInlineLatex(e.target.value)}
                onClick={handleCursorUpdate}
                onKeyUp={handleCursorUpdate}
                onSelect={handleCursorUpdate}
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

              <div className="border-t pt-2 mt-1">
                <p className="text-xs text-muted-foreground mb-2">Append Symbol:</p>
                <div className="max-h-[200px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-muted [&::-webkit-scrollbar-thumb]:bg-primary/20">
                  {LATEX_LIST.map((group, groupIndex) => (
                    <div key={groupIndex} className="mb-4 last:mb-0">
                      <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                        {group.name}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map((eq, i) => {
                          return (
                            <Badge
                              key={i}
                              onClick={() => handleInsertSymbol(eq.latex)}
                              title={eq.latex}
                              className="hover:cursor-pointer"
                              variant={
                                group.name === "Common" ? "emerald" :
                                  group.name === "Accents" ? "orange" :
                                    group.name === "Delimiters" ? "indigo" :
                                      group.name === "Environments" ? "blue" :
                                        group.name === "Logic & Sets" ? "yellow" :
                                          group.name === "Greek Letters" ? "fuchsia" :
                                            "default"
                              }>
                              {eq.label}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
