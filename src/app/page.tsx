"use client";

import Editor from "@/components/rich-text-editor/Editor";
import { useState } from "react";

const HomePage = () => {
  const [content, setContent] = useState("");
  return (
    <section className="py-20 px-4">
      <h1 className="text-2xl font-semibold text-center font-mono pb-6">
        Rich Text Editor
      </h1>
      <Editor content={content} setContent={setContent} />
    </section>
  );
};

export default HomePage;
