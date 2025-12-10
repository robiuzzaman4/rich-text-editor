"use client";

import Editor from "@/components/rich-text-editor/Editor";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

const HomePage = () => {
  const [content, setContent] = useState("");
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold text-center font-mono pb-6">
        Rich Text Editor
      </h1>
      <Button asChild className="my-10">
        <Link href="/create-mcq">Create MCQ</Link>
      </Button>
      <Editor content={content} setContent={setContent} />
    </section>
  );
};

export default HomePage;
