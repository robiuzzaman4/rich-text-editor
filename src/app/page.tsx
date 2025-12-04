import Editor from "@/components/rich-text-editor/Editor";

const HomePage = () => {
  return (
    <section className="py-20 px-4">
      <h1 className="text-2xl font-semibold text-center font-mono pb-6">
        Rich Text Editor
      </h1>
      <Editor />
    </section>
  );
};

export default HomePage;
