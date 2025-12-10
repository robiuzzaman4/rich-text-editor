"use client";

import { useState, useEffect } from "react";
import Editor from "@/components/rich-text-editor/Editor";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";
import { Tag, TagsCombobox } from "./_components/TagsCombobox";
import { Input } from "@/components/ui/input";

// === types ===
interface Option {
    id: string;
    content: string;
}

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

        const newMcq = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            questionContent,
            explanationContent,
            options,
            correctOptionId,
            selectedTags,
        };

        try {
            // Get existing MCQs
            const existingData = localStorage.getItem("MCQ_STORAGE_LIST");
            const mcqList = existingData ? JSON.parse(existingData) : [];

            // Add new MCQ
            const updatedList = [...mcqList, newMcq];

            // Save back to storage
            localStorage.setItem("MCQ_STORAGE_LIST", JSON.stringify(updatedList));

            // Clear current state
            setQuestionContent("");
            setExplanationContent("");
            setOptions([
                { id: crypto.randomUUID(), content: "" },
                { id: crypto.randomUUID(), content: "" },
                { id: crypto.randomUUID(), content: "" },
                { id: crypto.randomUUID(), content: "" },
            ]);
            setCorrectOptionId(null);
            setSelectedTags([]);

            // Clear draft state
            localStorage.removeItem("MCQ_CREATE_STATE");

            toast.success("MCQ saved successfully!");
            console.log("Saved MCQ Payload:", newMcq);
        } catch (error) {
            console.error("Failed to save MCQ", error);
            toast.error("Failed to save MCQ");
        }
    };

    return (
        <section className="py-10">
            <div className="max-w-7xl mx-auto space-y-4">
                <header className="p-4 rounded-lg bg-primary/20">
                    <h1 className="text-xl font-medium text-primary text-center">Create MCQ</h1>
                </header>

                <div className="grid gap-4">
                    {/* === question section === */}
                    <section className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                        <Label className="text-lg font-semibold">Question</Label>
                        <div className="min-h-[200px]">
                            <Editor
                                content={questionContent}
                                setContent={setQuestionContent}
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
                                <div key={index} className="group relative flex gap-4 items-start">
                                    {/* radio button for correct answer */}
                                    <div className="pt-1">
                                        <Input
                                            key={index}
                                            type="radio"
                                            name="correct-option"
                                            id={`radio-${index}`}
                                            checked={correctOptionId === option.id}
                                            onChange={() => setCorrectOptionId(option.id)}
                                            className="size-5 text-primary border-border focus:ring-primary cursor-pointer accent-primary"
                                        />
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center justify-between mb-1">
                                            <Label htmlFor={`radio-${index}`}
                                                className="text-sm font-medium text-gray-500 cursor-pointer">
                                                Option {index + 1}
                                                {correctOptionId === option.id && <span className="ml-2 text-green-600 text-xs font-bold">(Correct Answer)</span>}
                                            </Label>

                                            {/* remove button */}
                                            <Button
                                                variant="secondary"
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

                <div className="w-fit ms-auto">
                    <Button onClick={handleSaveMcq} size="lg" className="w-full sm:w-auto">
                        Save MCQ
                    </Button>
                </div>
            </div>
        </section>
    );
}

