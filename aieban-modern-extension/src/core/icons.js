// AI更易办 - inline icons adapted from Lucide.
const AiebanIcons = (() => {
  const NS = "http://www.w3.org/2000/svg";
  const paths = {
    briefcase: [
      ["path", { d: "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" }],
      ["rect", { x: "2", y: "7", width: "20", height: "14", rx: "2" }]
    ],
    chevronLeft: [["path", { d: "m15 18-6-6 6-6" }]],
    chevronRight: [["path", { d: "m9 18 6-6-6-6" }]],
    fileText: [
      ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" }],
      ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
      ["path", { d: "M10 9H8" }],
      ["path", { d: "M16 13H8" }],
      ["path", { d: "M16 17H8" }]
    ],
    folder: [
      ["path", { d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.4-.6L9.3 4A2 2 0 0 0 7.9 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" }]
    ],
    graduationCap: [
      ["path", { d: "M22 10 12 5 2 10l10 5 10-5Z" }],
      ["path", { d: "M6 12v5c3 3 9 3 12 0v-5" }]
    ],
    layoutGrid: [
      ["rect", { x: "3", y: "3", width: "7", height: "7", rx: "1" }],
      ["rect", { x: "14", y: "3", width: "7", height: "7", rx: "1" }],
      ["rect", { x: "14", y: "14", width: "7", height: "7", rx: "1" }],
      ["rect", { x: "3", y: "14", width: "7", height: "7", rx: "1" }]
    ],
    moon: [["path", { d: "M20.9 13.5A8.5 8.5 0 1 1 10.5 3.1a7 7 0 0 0 10.4 10.4Z" }]],
    moreHorizontal: [
      ["circle", { cx: "12", cy: "12", r: "1" }],
      ["circle", { cx: "19", cy: "12", r: "1" }],
      ["circle", { cx: "5", cy: "12", r: "1" }]
    ],
    penLine: [
      ["path", { d: "M12 20h9" }],
      ["path", { d: "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" }]
    ],
    star: [["path", { d: "m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2L5.8 21 7 14.2 2 9.3l6.9-1Z" }]],
    sun: [
      ["circle", { cx: "12", cy: "12", r: "4" }],
      ["path", { d: "M12 2v2" }],
      ["path", { d: "M12 20v2" }],
      ["path", { d: "m4.9 4.9 1.4 1.4" }],
      ["path", { d: "m17.7 17.7 1.4 1.4" }],
      ["path", { d: "M2 12h2" }],
      ["path", { d: "M20 12h2" }],
      ["path", { d: "m6.3 17.7-1.4 1.4" }],
      ["path", { d: "m19.1 4.9-1.4 1.4" }]
    ],
    type: [
      ["path", { d: "M4 7V4h16v3" }],
      ["path", { d: "M9 20h6" }],
      ["path", { d: "M12 4v16" }]
    ]
  };

  const aliases = {
    favorite: "star",
    fontLiterary: "penLine",
    fontSans: "type",
    sectionBriefcase: "briefcase",
    sectionCommon: "layoutGrid",
    sectionDocs: "fileText",
    sectionMore: "moreHorizontal",
    sectionSchool: "graduationCap",
    sectionFolder: "folder",
    themeDark: "moon",
    themeLight: "sun"
  };

  const create = (name, options = {}) => {
    const doc = options.document || document;
    const iconName = aliases[name] || name;
    const svg = doc.createElementNS(NS, "svg");
    svg.setAttribute("class", `aieban-icon aieban-icon-${iconName}`);
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", options.strokeWidth || "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");

    (paths[iconName] || paths.moreHorizontal).forEach(([tag, attrs]) => {
      const node = doc.createElementNS(NS, tag);
      Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
      svg.appendChild(node);
    });

    return svg;
  };

  const setIcon = (element, name, options = {}) => {
    if (!element) return;
    element.replaceChildren(create(name, { ...options, document: element.ownerDocument }));
  };

  return { create, setIcon };
})();
