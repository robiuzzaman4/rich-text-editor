# Tiptap Rich Text Editor with Math Support

## ✨ Overview

**Tiptap Editor** is a feature-rich, minimal, and fully customizable rich text editor built using **Next.js**, **React**, and the **Tiptap** headless editor framework.

The key feature of this editor is the seamless integration of **mathematical notation** using the **`@tiptap/extension-mathematics`** extension and the **KaTeX** rendering library. This allows users to write and display complex mathematical equations using **LaTeX** syntax directly within the editor.

![Thumbnail](https://i.ibb.co/LDtYxRpx/Group-2.png)

## 🚀 Key Features

* **LaTeX/KaTeX Support:** Effortlessly insert and render mathematical equations.
* **Rich Text Toolkit:** Includes standard features like lists, headings, bold, italics, tables, and text alignment, provided by the **`@tiptap/starter-kit`**.
* **Advanced Text Styling:** Supports **Subscript**, **Superscript**, and **Typography** extensions.
* **Modern Stack:** Built with **Next.js 16.0.7** (using the new React Compiler) and styled with **Tailwind CSS 4**.
* **Accessible Components:** Utilizes **Radix UI** for high-quality, accessible components (Popover, Select, Tooltip, etc.).

## ⚙️ Installation & Setup

1.  **Clone the Repository (Optional):**
    ```bash
    git clone https://github.com/robiuzzaman4/rich-text-editor
    cd tiptap-editor
    ```

2.  **Install Dependencies:**
    All necessary packages, including Tiptap extensions and KaTeX, are listed in `package.json`.
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the Development Server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

    The editor will be accessible at: `http://localhost:3000`


## 📦 Core Technologies

| Category | Package | Version (as of `package.json`) | Description |
| :--- | :--- | :--- | :--- |
| **Frontend** | `next` | `16.0.7` | Next.js framework for React applications. |
| **Editor Core** | `@tiptap/react` | `3.12.1` | React bindings for the Tiptap editor. |
| **Math Support** | `@tiptap/extension-mathematics` | `3.12.1` | Tiptap extension to handle math nodes. |
| **Math Renderer** | `katex` | `0.16.25` | High-speed, high-quality math typesetting library. |
| **Styling** | `tailwindcss` | `^4` | Utility-first CSS framework. |
| **Components** | `@radix-ui/*` | Various | Accessible, unstyled UI primitives. |


## 📝 Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `dev` | `next dev` | Starts the Next.js development server. |
| `build` | `next build` | Compiles the application for production deployment. |
| `start` | `next start` | Starts the Next.js production server. |
| `lint` | `eslint` | Runs the linter to check code quality. |


## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

This project is licensed under the **MIT License**.