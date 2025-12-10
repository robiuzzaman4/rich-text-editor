"use client";

import { useState, useEffect } from "react";
import Editor from "@/components/rich-text-editor/Editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X, Plus, Check, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// === types ===
interface Option {
    id: string;
    content: string;
}

interface Tag {
    id: string;
    label: string;
}

const PREDEFINED_TAGS: Tag[] = [
    { id: "1", label: "JavaScript" },
    { id: "2", label: "React" },
    { id: "3", label: "Next.js" },
    { id: "4", label: "TypeScript" },
    { id: "5", label: "CSS" },
    { id: "6", label: "HTML" },
    { id: "7", label: "Node.js" },
    { id: "8", label: "Python" },
];

export default function CreateMcqPage() {
    // === state management ===
    const [questionContent, setQuestionContent] = useState("");
    const [explanationContent, setExplanationContent] = useState("");
    const [options, setOptions] = useState<Option[]>([
        { id: crypto.randomUUID(), content: "" },
        { id: crypto.randomUUID(), content: "" },
        { id: crypto.randomUUID(), content: "" },
        { id: crypto.randomUUID(), content: "" },
    ]);
    const [correctOptionId, setCorrectOptionId] = useState<string | null>(null);
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

    // === state loading ===
    useEffect(() => {
        const savedData = localStorage.getItem("MCQ_CREATE_STATE");
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setQuestionContent(parsed.questionContent || "");
                setExplanationContent(parsed.explanationContent || "");
                setOptions(parsed.options || []);
                setCorrectOptionId(parsed.correctOptionId || null);
                setSelectedTags(parsed.selectedTags || []);
            } catch (e) {
                console.error("Failed to parse saved MCQ state", e);
            }
        }
    }, []);

    // === handlers ===
    const handleAddOption = () => {
        setOptions((prev) => [
            ...prev,
            { id: crypto.randomUUID(), content: "" },
        ]);
    };

    const handleRemoveOption = (id: string) => {
        if (options.length <= 2) {
            toast.error("At least 2 options are required.");
            return;
        }
        setOptions((prev) => prev.filter((opt) => opt.id !== id));
        if (correctOptionId === id) {
            setCorrectOptionId(null);
        }
    };

    const handleOptionContentChange = (id: string, newContent: string) => {
        setOptions((prev) =>
            prev.map((opt) => (opt.id === id ? { ...opt, content: newContent } : opt))
        );
    };

    // === save handler ===
    const handleSaveMcq = () => {
        if (!questionContent.trim()) {
            toast.error("Question content is required.");
            return;
        }
        if (options.length < 2) {
            toast.error("At least 2 options are required.");
            return;
        }
        if (!correctOptionId) {
            toast.error("Please select a correct answer.");
            return;
        }

        // validate options have content? (optional, but good practice)
        for (const opt of options) {
            if (!opt.content.trim()) {
                toast.error("All options must have content.");
                return;
            }
        }

        const payload = {
            questionContent,
            explanationContent,
            options,
            correctOptionId,
            selectedTags,
        };

        localStorage.setItem("MCQ_CREATE_STATE", JSON.stringify(payload));
        toast.success("MCQ saved successfully (Local Storage)");
        console.log("Saved MCQ Payload:", payload);
    };

    return (
        <section className="py-10">
            <div className="max-w-7xl mx-auto space-y-4">

                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create MCQ</h1>
                        <p className="text-gray-500 mt-1">Design your multiple choice question.</p>
                    </div>
                    <Button onClick={handleSaveMcq} size="lg" className="w-full md:w-auto">
                        Save MCQ
                    </Button>
                </header>

                <div className="grid gap-4">
                    {/* === question section === */}
                    <section className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                        <Label className="text-lg font-semibold">Question</Label>
                        <div className="min-h-[200px]">
                            <Editor
                                content={questionContent}
                                setContent={setQuestionContent}
                                placeholder="Type your question here..."
                                editorAreaClassName="min-h-[180px]"
                            />
                        </div>
                    </section>

                    {/* === options section === */}
                    <section className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <Label className="text-lg font-semibold">Options</Label>
                            <Button onClick={handleAddOption} variant="outline" size="sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Option
                            </Button>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-6">
                            {options.map((option, index) => (
                                <div key={option.id} className="group relative flex gap-4 items-start">

                                    {/* radio button for correct answer */}
                                    <div className="pt-4">
                                        <input
                                            type="radio"
                                            name="correct-option"
                                            id={`radio-${option.id}`}
                                            checked={correctOptionId === option.id}
                                            onChange={() => setCorrectOptionId(option.id)}
                                            className="w-5 h-5 text-primary border-gray-300 focus:ring-primary cursor-pointer accent-black"
                                        />
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center justify-between mb-1">
                                            <Label htmlFor={`radio-${option.id}`} className="text-sm font-medium text-gray-500 cursor-pointer">
                                                Option {index + 1}
                                                {correctOptionId === option.id && <span className="ml-2 text-green-600 text-xs font-bold">(Correct Answer)</span>}
                                            </Label>

                                            {/* remove button */}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemoveOption(option.id)}
                                                disabled={options.length <= 2}
                                                className="h-6 w-6 text-gray-400 hover:text-red-500 hover:bg-red-50"
                                                title="Remove option"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        <Editor
                                            content={option.content}
                                            setContent={(val) => {
                                                // This handles the setter from the editor. 
                                                // Since Editor expects a setter callback, we wrap our handler.
                                                // Wait, setContent expects React.Dispatch<React.SetStateAction<string>>
                                                // We can pass a wrapper function if strictly typed, but let's see.
                                                // Editor calls setContent((prev) => ...) or setContent(newValue)
                                                // We need to support functional updates if Editor uses them.
                                                // Editor.tsx: setContent((prev) => (prev === html ? prev : html));
                                                // So we need to handle a function or value.
                                                if (typeof val === 'function') {
                                                    // We can't easily access previous state here without refitching.
                                                    // Actually, we can just pass a wrapper that gets the current content of THIS option.
                                                    // But since we are mapping, it's easier to just pass a direct setter if we refactored Editor.
                                                    // But Editor uses functional update.
                                                    // Let's hack it slightly: The Editor uses `setContent` which is a state setter.
                                                    // We can pass a dummy setter that extracts the value? No, Editor *calls* it.
                                                    // Correct way: Pass a function that accepts `value | fn`.
                                                    const newValue = typeof val === 'function' ? val(option.content) : val;
                                                    handleOptionContentChange(option.id, newValue);
                                                } else {
                                                    handleOptionContentChange(option.id, val);
                                                }
                                            }}
                                            placeholder={`Option ${index + 1} content...`}
                                            editorAreaClassName="min-h-[100px]"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* === explanation section === */}
                    <section className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                        <Label className="text-lg font-semibold">Explanation</Label>
                        <div className="min-h-[150px]">
                            <Editor
                                content={explanationContent}
                                setContent={setExplanationContent}
                                placeholder="Explain why the answer is correct..."
                                editorAreaClassName="min-h-[100px]"
                            />
                        </div>
                    </section>

                    {/* === tags section === */}
                    <section className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                        <Label className="text-lg font-semibold">Tags</Label>
                        <TagsCombobox selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
                    </section>

                </div>
            </div>
        </section>
    );
}

// === tags combobox component ===
function TagsCombobox({
    selectedTags,
    setSelectedTags,
}: {
    selectedTags: Tag[];
    setSelectedTags: React.Dispatch<React.SetStateAction<Tag[]>>;
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [availableTags, setAvailableTags] = useState(PREDEFINED_TAGS);

    const filteredTags = availableTags.filter((tag) =>
        tag.label.toLowerCase().includes(search.toLowerCase())
    );

    const exactMatch = filteredTags.find(
        (tag) => tag.label.toLowerCase() === search.toLowerCase()
    );

    const handleSelect = (tag: Tag) => {
        if (selectedTags.some((t) => t.id === tag.id)) {
            setSelectedTags((prev) => prev.filter((t) => t.id !== tag.id));
        } else {
            setSelectedTags((prev) => [...prev, tag]);
        }
        // Keep open for multi-select
    };

    const handleCreateTag = () => {
        if (!search.trim()) return;
        const newTag: Tag = {
            id: `custom-${crypto.randomUUID()}`,
            label: search.trim(),
        };
        setAvailableTags((prev) => [...prev, newTag]);
        setSelectedTags((prev) => [...prev, newTag]);
        setSearch("");
    };

    const handleRemoveTag = (tagId: string) => {
        setSelectedTags(prev => prev.filter(t => t.id !== tagId));
    }

    return (
        <div className="space-y-3">
            {/* selected tags display */}
            <div className="flex flex-wrap gap-2 mb-2">
                {selectedTags.map(tag => (
                    <Badge key={tag.id} variant="secondary" className="px-3 py-1 text-sm bg-white border shadow-sm hover:bg-gray-50 transition-colors cursor-default flex items-center gap-1">
                        {tag.label}
                        <button onClick={() => handleRemoveTag(tag.id)} className="text-gray-400 hover:text-red-500 ml-1">
                            <X className="w-3 h-3" />
                        </button>
                    </Badge>
                ))}
                {selectedTags.length === 0 && <span className="text-gray-400 text-sm italic">No tags selected</span>}
            </div>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {selectedTags.length > 0
                            ? `${selectedTags.length} tags selected`
                            : "Select tags..."}
                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                    <div className="p-2 border-b">
                        <Input
                            placeholder="Search tags..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-8 border-none focus-visible:ring-0 shadow-none bg-transparent"
                        />
                    </div>
                    <div className="max-h-[200px] overflow-y-auto p-1">
                        {filteredTags.length === 0 && search.trim() !== "" && !exactMatch && (
                            <div className="p-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="w-full justify-start text-blue-600"
                                    onClick={handleCreateTag}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create "{search}"
                                </Button>
                            </div>
                        )}

                        {filteredTags.map((tag) => {
                            const isSelected = selectedTags.some(t => t.id === tag.id);
                            return (
                                <div
                                    key={tag.id}
                                    onClick={() => handleSelect(tag)}
                                    className={cn(
                                        "flex items-center w-full px-2 py-2 text-sm rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground",
                                        isSelected && "bg-accent/50"
                                    )}
                                >
                                    <div className={cn("mr-2 flex h-4 w-4 items-center justify-center border border-primary/20 rounded-sm", isSelected ? "bg-primary border-primary" : "opacity-50")}>
                                        {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                                    </div>
                                    <span>{tag.label}</span>
                                </div>
                            );
                        })}

                        {filteredTags.length === 0 && search.trim() === "" && (
                            <p className="text-sm text-center text-muted-foreground py-4">No tags found.</p>
                        )}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}