/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";
import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Table,
  Code,
  Quote,
  Undo2,
  Redo2,
  TableProperties,
  Columns3,
  Trash,
  Rows3,
  Subscript,
  SuperscriptIcon,
  LinkIcon,
  Highlighter,
  Ban,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ToolbarMathControls } from "./ToolbarMathControls";
import { Input } from "../ui/input";
import { ToolbarTableControls } from "./ToolbarTableControls";
import { ToolbarMcqFormDialog } from "./ToolbarMcqFormDialog";

type ToolbarState = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strike: boolean;
  code: boolean;
  blockquote: boolean;
  bulletList: boolean;
  orderedList: boolean;
  subScript: boolean;
  superScript: boolean;
  textAlign: "left" | "center" | "right" | "justify" | null;
  heading: 1 | 2 | 3 | 0;
  isTableActive: boolean;
  canUndo: boolean;
  canRedo: boolean;
  highlight: boolean;
};

interface ToolbarProps {
  editor: Editor | null;
}

export function Toolbar({ editor }: ToolbarProps) {
  const [state, setState] = useState<ToolbarState>(() => ({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    code: false,
    blockquote: false,
    bulletList: false,
    orderedList: false,
    subScript: false,
    superScript: false,
    textAlign: null,
    heading: 0,
    isTableActive: false,
    canUndo: false,
    canRedo: false,
    highlight: false,
  }));

  const lastRef = useRef<ToolbarState | null>(null);
  const [linkUrl, setLinkUrl] = useState<string>("");

  useEffect(() => {
    if (!editor) return;

    // helper: compute the derived toolbar state from the editor
    const computeState = (): ToolbarState => {
      // marks
      const bold = editor.isActive("bold");
      const italic = editor.isActive("italic");
      const underline = editor.isActive("underline");
      const strike = editor.isActive("strike");
      const code = editor.isActive("code");
      const blockquote = editor.isActive("blockquote");
      const bulletList = editor.isActive("bulletList");
      const orderedList = editor.isActive("orderedList");
      const subScript = editor.isActive("subscript");
      const superScript = editor.isActive("superscript");
      const highlight = editor.isActive("highlight");

      // heading vs paragraph
      const heading = editor.isActive("heading", { level: 1 })
        ? 1
        : editor.isActive("heading", { level: 2 })
          ? 2
          : editor.isActive("heading", { level: 3 })
            ? 3
            : 0;

      // text align - using editor state attrs
      const textAlign = editor.isActive({ textAlign: "left" })
        ? "left"
        : editor.isActive({ textAlign: "center" })
          ? "center"
          : editor.isActive({ textAlign: "right" })
            ? "right"
            : editor.isActive({ textAlign: "justify" })
              ? "justify"
              : null;

      // table active (node name is `table`)
      const isTableActive = editor.isActive("table");

      // undo/redo availability via editor.can()
      const canUndo = editor.can().undo();
      const canRedo = editor.can().redo();

      return {
        bold,
        italic,
        underline,
        strike,
        code,
        blockquote,
        bulletList,
        orderedList,
        subScript,
        superScript,
        textAlign,
        heading,
        isTableActive,
        canUndo,
        canRedo,
        highlight,
      };
    };

    console.log('state', state.highlight);


    // update only when changed (shallow compare)
    const maybeUpdate = () => {
      const next = computeState();
      const prev = lastRef.current;

      // shallow compare primitive fields
      let changed = false;
      if (!prev) changed = true;
      else {
        for (const key of Object.keys(next) as (keyof ToolbarState)[]) {
          if (next[key] !== prev[key]) {
            changed = true;
            break;
          }
        }
      }

      if (changed) {
        lastRef.current = next;
        setState(next);
      }
    };

    editor.on("selectionUpdate", maybeUpdate);
    editor.on("update", maybeUpdate);
    editor.on("transaction", maybeUpdate);

    // run once to initialize
    maybeUpdate();

    // cleanup
    return () => {
      editor.off("selectionUpdate", maybeUpdate);
      editor.off("update", maybeUpdate);
      editor.off("transaction", maybeUpdate);
    };
  }, [editor]);

  if (!editor) return null;

  const setLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
      setLinkUrl("");
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
  };

  return (
    <div className="border-b bg-background p-2 sticky top-0 z-10">
      <div className="flex flex-wrap gap-1 items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!state.canUndo}
              className={cn("size-8")}
            >
              <Undo2 className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Undo</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!state.canRedo}
              className={cn("size-8")}
            >
              <Redo2 className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Redo</p>
          </TooltipContent>
        </Tooltip>

        <div className="h-8 w-px bg-border mx-1" />

        <Select
          value={
            state.heading === 1
              ? "h1"
              : state.heading === 2
                ? "h2"
                : state.heading === 3
                  ? "h3"
                  : "paragraph"
          }
          onValueChange={(value) => {
            if (value === "paragraph") {
              editor.chain().focus().setParagraph().run();
              return;
            }

            const raw = Number(value.slice(1));
            const allowedLevels = [1, 2, 3] as const;

            if (allowedLevels.includes(raw as any)) {
              editor
                .chain()
                .focus()
                .toggleHeading({ level: raw as (typeof allowedLevels)[number] })
                .run();
            }
          }}
        >
          <SelectTrigger className="h-8 w-[120px]">
            <SelectValue placeholder="Style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paragraph">Paragraph</SelectItem>
            <SelectItem value="h1">Heading 1</SelectItem>
            <SelectItem value="h2">Heading 2</SelectItem>
            <SelectItem value="h3">Heading 3</SelectItem>
          </SelectContent>
        </Select>

        <div className="h-8 w-px bg-border mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={cn(
                "size-8",
                state.bold && "bg-primary/10 text-primary"
              )}
            >
              <Bold className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bold</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={cn(
                "size-8",
                state.italic && "bg-primary/10 text-primary"
              )}
            >
              <Italic className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Italic</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={cn(
                "size-8",
                state.underline && "bg-primary/10 text-primary"
              )}
            >
              <UnderlineIcon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Underline</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={cn(
                "size-8",
                state.strike && "bg-primary/10 text-primary"
              )}
            >
              <Strikethrough className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Strike</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={cn(
                "size-8",
                state.code && "bg-primary/10 text-primary"
              )}
            >
              <Code className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Code</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              className={cn(
                "size-8",
                state.subScript && "bg-primary/10 text-primary"
              )}
            >
              <Subscript className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Subscript</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              className={cn(
                "size-8",
                state.superScript && "bg-primary/10 text-primary"
              )}
            >
              <SuperscriptIcon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Superscript</p>
          </TooltipContent>
        </Tooltip>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "size-8",
                state.highlight && "bg-primary/10 text-primary"
              )}
            >
              <Highlighter className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit p-2">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-muted-foreground px-1">
                Highlight Color
              </p>
              <div className="grid grid-cols-7 gap-1">
                {[
                  { color: "#ffc078", md: "Orange" },
                  { color: "#8ce99a", md: "Green" },
                  { color: "#74c0fc", md: "Blue" },
                  { color: "#faa2c1", md: "Pink" },
                  { color: "#fcc419", md: "Yellow" },
                  { color: "#b197fc", md: "Purple" },
                ].map(({ color, md }) => (
                  <Tooltip key={color}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-6 h-6 p-0 rounded-sm border-muted-foreground/20 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() =>
                          editor.chain().focus().toggleHighlight({ color }).run()
                        }
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{md}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}

                <Tooltip key="remove-color">
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      className="size-6 p-0 rounded-sm border-muted-foreground/20 hover:text-destructive hover:scale-110 transition-transform"
                      onClick={() => editor.chain().focus().unsetHighlight().run()}>
                      <Ban className="size-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remove</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="h-8 w-px bg-border mx-1" />

        {/* Text align */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={cn(
                "size-8",
                state.textAlign === "left" && "bg-primary/10 text-primary"
              )}
            >
              <AlignLeft className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Align Left</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              className={cn(
                "size-8",
                state.textAlign === "center" && "bg-primary/10 text-primary"
              )}
            >
              <AlignCenter className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Align Center</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={cn(
                "size-8",
                state.textAlign === "right" && "bg-primary/10 text-primary"
              )}
            >
              <AlignRight className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Align Right</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                editor.chain().focus().setTextAlign("justify").run()
              }
              className={cn(
                "size-8",
                state.textAlign === "justify" && "bg-primary/10 text-primary"
              )}
            >
              <AlignJustify className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Align Justify</p>
          </TooltipContent>
        </Tooltip>

        <div className="h-8 w-px bg-border mx-1" />

        {/* Lists, blockquote */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={cn(
                "size-8",
                state.bulletList && "bg-primary/10 text-primary"
              )}
            >
              <List className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>List</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={cn(
                "size-8",
                state.orderedList && "bg-primary/10 text-primary"
              )}
            >
              <ListOrdered className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>List Ordered</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={cn(
                "size-8",
                state.blockquote && "bg-primary/10 text-primary"
              )}
            >
              <Quote className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Block Quote</p>
          </TooltipContent>
        </Tooltip>

        <div className="h-8 w-px bg-border mx-1" />

        {/* link */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <LinkIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex flex-col gap-2">
              <h3 className="font-medium">Insert Link</h3>
              <Input
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .extendMarkRange("link")
                      .unsetLink()
                      .run()
                  }
                  disabled={!editor.isActive("link")}
                >
                  Remove Link
                </Button>
                <Button size="sm" onClick={setLink}>
                  {editor.isActive("link") ? "Update Link" : "Add Link"}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Table */}
        <ToolbarTableControls editor={editor} isTableActive={state.isTableActive} />

        <div className="h-8 w-px bg-border mx-1" />

        {/* Math */}
        <ToolbarMathControls editor={editor} />

        <div className="h-8 w-px bg-border mx-1" />

        {/* MCQ Form */}
        <ToolbarMcqFormDialog editor={editor} />
      </div>
    </div>
  );
}
