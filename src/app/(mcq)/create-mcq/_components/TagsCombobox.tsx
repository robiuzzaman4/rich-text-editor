import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, Plus, Search, X } from "lucide-react";
import { useState } from "react";

export interface Tag {
    id: string;
    label: string;
}

const PREDEFINED_TAGS: Tag[] = [
    { id: "1", label: "Math" },
    { id: "2", label: "Physics" },
    { id: "3", label: "Chemistry" },
    { id: "4", label: "Biology" },
    { id: "5", label: "English" },
    { id: "6", label: "Urdu" },
    { id: "7", label: "Academic" },
];


export function TagsCombobox({
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