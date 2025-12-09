import { Editor } from "@tiptap/react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Table, Columns3, Rows3, Trash, TableProperties } from "lucide-react";

export function ToolbarTableControls({ editor, isTableActive }: { editor: Editor; isTableActive: boolean }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" className="size-8">
                    <Table className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit">
                <div className="grid grid-cols-2 gap-2">
                    <Button
                        className="justify-start"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                                .run()
                        }
                    >
                        <TableProperties className="h-4 w-4 mr-2" />
                        Insert Table
                    </Button>
                    {isTableActive && (
                        <>
                            <Button
                                className="justify-start"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                    editor.chain().focus().addColumnBefore().run()
                                }
                                disabled={!editor.can().addColumnBefore()}
                            >
                                <Columns3 className="h-4 w-4 mr-2" />
                                Add Column Left
                            </Button>
                            <Button
                                className="justify-start"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                    editor.chain().focus().addColumnAfter().run()
                                }
                                disabled={!editor.can().addColumnAfter()}
                            >
                                <Columns3 className="h-4 w-4 mr-2 rotate-180" />
                                Add Column Right
                            </Button>
                            <Button
                                className="justify-start"
                                variant="ghost"
                                size="sm"
                                onClick={() => editor.chain().focus().deleteColumn().run()}
                                disabled={!editor.can().deleteColumn()}
                            >
                                <Trash className="h-4 w-4 mr-2" />
                                Delete Column
                            </Button>
                            <Button
                                className="justify-start"
                                variant="ghost"
                                size="sm"
                                onClick={() => editor.chain().focus().addRowBefore().run()}
                                disabled={!editor.can().addRowBefore()}
                            >
                                <Rows3 className="h-4 w-4 mr-2" />
                                Add Row Above
                            </Button>
                            <Button
                                className="justify-start"
                                variant="ghost"
                                size="sm"
                                onClick={() => editor.chain().focus().addRowAfter().run()}
                                disabled={!editor.can().addRowAfter()}
                            >
                                <Rows3 className="h-4 w-4 mr-2 rotate-180" />
                                Add Row Below
                            </Button>
                            <Button
                                className="justify-start"
                                variant="ghost"
                                size="sm"
                                onClick={() => editor.chain().focus().deleteRow().run()}
                                disabled={!editor.can().deleteRow()}
                            >
                                <Trash className="h-4 w-4 mr-2" />
                                Delete Row
                            </Button>
                            <Button
                                className="justify-start"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                    editor.chain().focus().toggleHeaderColumn().run()
                                }
                                disabled={!editor.can().toggleHeaderColumn()}
                            >
                                Toggle Header Column
                            </Button>
                            <Button
                                className="justify-start"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                    editor.chain().focus().toggleHeaderRow().run()
                                }
                                disabled={!editor.can().toggleHeaderRow()}
                            >
                                Toggle Header Row
                            </Button>
                            <Button
                                className="justify-start"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                    editor.chain().focus().toggleHeaderCell().run()
                                }
                                disabled={!editor.can().toggleHeaderCell()}
                            >
                                Toggle Header Cell
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => editor.chain().focus().deleteTable().run()}
                                disabled={!editor.can().deleteTable()}
                                className="col-span-2"
                            >
                                Delete Table
                            </Button>
                        </>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}