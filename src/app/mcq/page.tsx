"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Option {
    id: string;
    content: string;
}

interface Tag {
    value: string;
    label: string;
}

interface MCQ {
    id: string;
    createdAt: string;
    questionContent: string;
    explanationContent: string;
    options: Option[];
    correctOptionId: string;
    selectedTags: Tag[];
}

export default function McqListPage() {
    const [mcqList, setMcqList] = useState<MCQ[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const stored = localStorage.getItem("MCQ_STORAGE_LIST");
        if (stored) {
            try {
                setMcqList(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse MCQ list", e);
            }
        }
    }, []);

    if (!isMounted) return null;

    if (mcqList.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <h2 className="text-2xl font-bold text-gray-500">No MCQs Found</h2>
                <p className="text-gray-400">Create some MCQs to see them here.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-4 py-10">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Stored MCQs</h1>
                <Button asChild>
                    <Link href="/create-mcq">Create MCQ</Link>
                </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {mcqList.map((mcq, index) => (
                    <Card key={index} className="overflow-hidden">
                        <CardHeader className="border-b">
                            <span className="text-sm text-gray-400">
                                {new Date(mcq.createdAt).toLocaleDateString()}
                            </span>
                            {mcq.selectedTags && mcq.selectedTags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {mcq.selectedTags.map((tag, i) => (
                                        <Badge key={i} variant="secondary">
                                            {tag.label}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Question Content */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Question</h3>
                                <div
                                    className="prose prose-sm max-w-none bg-white p-3 rounded border"
                                    dangerouslySetInnerHTML={{ __html: mcq.questionContent }}
                                />
                            </div>

                            {/* Options */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Options</h3>
                                <div className="grid gap-3">
                                    {mcq.options.map((option, i) => (
                                        <div
                                            key={i}
                                            className={`p-3 rounded border flex items-start gap-3 ${mcq.correctOptionId === option.id
                                                ? "bg-green-50 border-green-200"
                                                : "bg-white"
                                                }`}
                                        >
                                            <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${mcq.correctOptionId === option.id
                                                ? "bg-green-500 text-white"
                                                : "bg-gray-100 text-gray-500"
                                                }`}>
                                                {String.fromCharCode(65 + i)}
                                            </span>
                                            <div
                                                className="prose prose-sm max-w-none"
                                                dangerouslySetInnerHTML={{ __html: option.content }}
                                            />
                                            {mcq.correctOptionId === option.id && (
                                                <Badge className="ml-auto bg-green-500 hover:bg-green-600">Correct</Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Explanation */}
                            {mcq.explanationContent && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Explanation</h3>
                                    <div
                                        className="prose prose-sm max-w-none bg-blue-50 p-4 rounded border border-blue-100 text-blue-900"
                                        dangerouslySetInnerHTML={{ __html: mcq.explanationContent }}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
