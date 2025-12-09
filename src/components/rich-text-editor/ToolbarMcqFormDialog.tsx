"use client";

import { useState } from "react";
import { Editor } from "@tiptap/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ListChecks } from "lucide-react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// === schema validation for the mcq form ===
const formSchema = z.object({
    question: z.string().min(1, "Question is required"),
    option1: z.string().min(1, "Option 1 is required"),
    option2: z.string().min(1, "Option 2 is required"),
    option3: z.string().min(1, "Option 3 is required"),
    option4: z.string().min(1, "Option 4 is required"),
    tags: z.string().optional(),
});

interface ToolbarMcqFormDialogProps {
    editor: Editor | null;
}

export function ToolbarMcqFormDialog({ editor }: ToolbarMcqFormDialogProps) {
    const [open, setOpen] = useState(false);

    // === initialize form with react-hook-form and zod resolver ===
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            question: "",
            option1: "",
            option2: "",
            option3: "",
            option4: "",
            tags: "",
        },
    });

    // === handle form submission to insert content into editor ===
    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (!editor) return;

        // === Construct content using JSON structure to ensure proper separation ===
        const content = [
            // 1. Question as a standard paragraph
            {
                type: "paragraph",
                content: [{ type: "text", text: values.question }],
            },
            // 2. Options as an ordered list
            {
                type: "orderedList",
                content: [
                    {
                        type: "listItem",
                        content: [{ type: "paragraph", content: [{ type: "text", text: values.option1 }] }],
                    },
                    {
                        type: "listItem",
                        content: [{ type: "paragraph", content: [{ type: "text", text: values.option2 }] }],
                    },
                    {
                        type: "listItem",
                        content: [{ type: "paragraph", content: [{ type: "text", text: values.option3 }] }],
                    },
                    {
                        type: "listItem",
                        content: [{ type: "paragraph", content: [{ type: "text", text: values.option4 }] }],
                    },
                ],
            },
        ];

        // 3. Tags as a code block (if present)
        if (values.tags) {
            content.push({
                type: "paragraph",
                content: [{ type: "text", text: values.tags }],
            } as any); // using any to bypass strict type checking for the content array construction if needed
        }

        // === Insert all content at once ===
        // This avoids state issues with toggling lists on/off
        editor.chain().focus().insertContent(content).run();

        // === Add a new empty paragraph at the end to make it easy to continue typing ===
        editor.chain().focus().enter().run();

        setOpen(false);
        form.reset();
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("size-8")}
                        >
                            <ListChecks className="size-4" />
                        </Button>
                    </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Insert MCQ Question</p>
                </TooltipContent>
            </Tooltip>

            <AlertDialogContent className="w-[600px] max-w-none">
                <AlertDialogHeader>
                    <AlertDialogTitle>Create MCQ Question</AlertDialogTitle>
                    <AlertDialogDescription>
                        Fill in the details below to insert a multiple-choice question.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="question"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Question</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Type your question here..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="option1"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Option 1</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Option 1" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="option2"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Option 2</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Option 2" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="option3"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Option 3</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Option 3" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="option4"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Option 4</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Option 4" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. #math #algebra" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => form.reset()}>Cancel</AlertDialogCancel>
                            {/* === using plain button type submit inside form instead of alertdialogaction which triggers close automatically usually === */}
                            <Button type="submit">Insert Question</Button>
                        </AlertDialogFooter>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
