export type MathCategory = {
    name: string;
    items: { label: string; latex: string }[];
};

export const LATEX_LIST: MathCategory[] = [
    {
        name: "Common",
        items: [
            { label: "Fraction", latex: "\\frac{x}{y}" },
            { label: "Power", latex: "x^2" },
            { label: "Square Root", latex: "\\sqrt{x}" },
            { label: "Sum", latex: "\\sum_{i=0}^n x_i" },
            { label: "Integral", latex: "\\int_0^\\infty f(x)dx" },
        ],
    },
    {
        name: "Accents",
        items: [
            { label: "Hat", latex: "\\hat{a}" },
            { label: "Bar", latex: "\\bar{a}" },
            { label: "Dot", latex: "\\dot{a}" },
            { label: "Vec", latex: "\\vec{a}" },
            { label: "Tilde", latex: "\\tilde{a}" },
            { label: "Underline", latex: "\\underline{a}" },
        ],
    },
    {
        name: "Delimiters",
        items: [
            { label: "Parentheses", latex: "(x)" },
            { label: "Brackets", latex: "[x]" },
            { label: "Braces", latex: "\\{x\\}" },
            { label: "Angle", latex: "\\langle x \\rangle" },
            { label: "Pipe", latex: "|x|" },
            { label: "Floor", latex: "\\lfloor x \\rfloor" },
            { label: "Ceil", latex: "\\lceil x \\rceil" },
        ],
    },
    {
        name: "Environments",
        items: [
            { label: "Matrix (2x2)", latex: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}" },
            { label: "Cases", latex: "f(x) = \\begin{cases} x & x \\ge 0 \\\\ -x & x < 0 \\end{cases}" },
            { label: "Aligned", latex: "\\begin{aligned} a &= b + c \\\\ &= d \\end{aligned}" },
            { label: "Bmatrix", latex: "\\begin{Bmatrix} a & b \\\\ c & d \\end{Bmatrix}" },
            { label: "Vmatrix", latex: "\\begin{Vmatrix} a & b \\\\ c & d \\end{Vmatrix}" },
        ],
    },
    {
        name: "Logic & Sets",
        items: [
            { label: "For All", latex: "\\forall" },
            { label: "Exists", latex: "\\exists" },
            { label: "In", latex: "\\in" },
            { label: "Not In", latex: "\\notin" },
            { label: "Subset", latex: "\\subset" },
            { label: "Union", latex: "\\cup" },
            { label: "Intersection", latex: "\\cap" },
            { label: "Infinity", latex: "\\infty" },
            { label: "Implies", latex: "\\implies" },
        ],
    },
    {
        name: "Greek Letters",
        items: [
            { label: "Alpha", latex: "\\alpha" },
            { label: "Beta", latex: "\\beta" },
            { label: "Gamma", latex: "\\gamma" },
            { label: "Delta", latex: "\\Delta" },
            { label: "Theta", latex: "\\theta" },
            { label: "Pi", latex: "\\pi" },
            { label: "Sigma", latex: "\\sigma" },
            { label: "Omega", latex: "\\Omega" },
            { label: "Phi", latex: "\\phi" },
        ],
    },
];
