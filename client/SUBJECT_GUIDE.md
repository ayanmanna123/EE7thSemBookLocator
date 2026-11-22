# Guide: Adding New Subjects to EE 7th Sem Book Locator

This project is architected to allow adding any new subject (e.g. Electric Drives, Power Systems, Renewable Energy, etc.) in just 2 simple steps without touching any UI code.

---

## Architecture Overview

```
client/
├── public/
│   └── data/
│       ├── computer-networks/
│       │   ├── topics.json       <-- Extracted & enriched topics + subtopics
│       │   └── chapters.json     <-- Parts, chapters, sections, subsections TOC
│       └── <new-subject-id>/     <-- (Step 1) Put your new subject JSON files here
│           ├── topics.json
│           └── chapters.json
└── src/
    ├── config/
    │   └── subjects.js           <-- (Step 2) Register subject metadata here
    ├── hooks/
    │   └── useSubjectData.js     <-- Automatically loads and caches data on demand
    ├── views/
    │   ├── SearchView.jsx        <-- Instant ranked search, spotlight & filters
    │   ├── TocView.jsx           <-- Parts & chapters atlas hierarchy
    │   └── PageInspectorView.jsx <-- Page inspector (1 to totalPages)
    └── components/
        └── layout/
            └── Header.jsx        <-- Auto-renders the Subject Switcher dropdown
```

---

## Step-by-Step Instructions

### Step 1: Add JSON Data Files
Create a folder inside `client/public/data/` for your subject:
```
client/public/data/electric-drives/
  ├── chapters.json
  └── topics.json
```

- **`chapters.json` format**:
  ```json
  {
    "parts": [
      {
        "id": "PART 1",
        "title": "Dynamics of Electrical Drives",
        "start_page": 1,
        "end_page": 85,
        "chapters": [
          {
            "id": "Chapter 1",
            "title": "Fundamental Torque Equations",
            "start_page": 1,
            "end_page": 30,
            "part_id": "PART 1",
            "part_title": "Dynamics of Electrical Drives",
            "sections": [
              {
                "id": "1.1",
                "title": "Multi-quadrant Operation",
                "start_page": 5,
                "end_page": 12,
                "chapter_id": "Chapter 1",
                "chapter_title": "Fundamental Torque Equations",
                "subsections": [
                  {
                    "id": "1.1.1",
                    "title": "Four-Quadrant Drive Operation",
                    "start_page": 7
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
  ```

- **`topics.json` format**:
  ```json
  [
    {
      "topic": "Chopper-Controlled DC Motor",
      "pages": ["142", "145-148"],
      "see": null,
      "see_also": null,
      "index_page": 580,
      "parts": ["PART 2: DC Drives"],
      "chapters": ["Chapter 4: Chopper Control of DC Drives"],
      "page_details": [
        {
          "page": "142",
          "part": "PART 2: DC Drives",
          "chapter": "Chapter 4: Chopper Control of DC Drives",
          "section": "4.2 Regenerative Braking",
          "subsection": ""
        }
      ],
      "subtopics": [
        {
          "topic": "Regenerative Braking Control",
          "pages": ["146"],
          "see": null,
          "see_also": null,
          "page_details": []
        }
      ]
    }
  ]
  ```

---

### Step 2: Register in `src/config/subjects.js`

Open `client/src/config/subjects.js` and add your new subject to the `SUBJECTS` array:

```javascript
{
  id: "electric-drives",
  name: "Electric Drives",
  shortName: "ED",
  code: "EE-702",
  bookTitle: "Dubey Electric Drives",
  editionBadge: "Fundamentals of Electrical Drives (2nd Ed.)",
  subtitle: "Motor Dynamics, Power Converters & Closed-Loop Vector Control",
  author: "G.K. Dubey",
  totalPages: 600,
  defaultInspectorPage: 142,
  topicsFile: "/data/electric-drives/topics.json",
  chaptersFile: "/data/electric-drives/chapters.json",
  quickChips: [
    "Chopper Fed DC Drive",
    "Four Quadrant Operation",
    "V/f Control",
    "Vector Control",
    "Regenerative Braking",
    "PMSM",
    "Slip Power Recovery"
  ],
  partColors: {
    "PART 1": "#38bdf8",
    "PART 2": "#10b981",
    "PART 3": "#f59e0b",
    "PART 4": "#a855f7",
    "APPENDICES": "#64748b"
  },
  acronyms: {
    "vfd": "Variable-frequency drive",
    "pmsm": "Permanent magnet synchronous generator",
    "bldc": "Brushless DC electric motor",
    "igbt": "Insulated-gate bipolar transistor",
    "pwm": "Pulse-width modulation"
  },
  getSearchUrls: (cleanTopic, parentTopic = "") => {
    const full = parentTopic ? `${parentTopic} ${cleanTopic}` : cleanTopic;
    const q = encodeURIComponent(`${full} electrical drives Dubey`);
    return {
      cleanTopic,
      expanded: full,
      google: `https://www.google.com/search?q=${q}`,
      wikipedia: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(full)}`,
      youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${full} electric drives NPTEL lecture`)}`,
      gfg: `https://www.google.com/search?q=${encodeURIComponent(`site:electrical4u.com ${full}`)}`,
      scholar: `https://scholar.google.com/scholar?q=${encodeURIComponent(`${full} electric motor drive`)}`,
      ietf: `https://www.google.com/search?q=${encodeURIComponent(`site:ieee.org ${full} drive`)}`
    };
  }
}
```

---

## What Happens Automatically:
1. **Subject Switcher Dropdown**: Appears in the top navigation bar when multiple subjects are registered.
2. **Instant Asynchronous Loading**: Only the active subject's data is loaded, and once loaded it is cached in memory for seamless switching.
3. **Table of Contents Atlas & Part Ribbon**: Automatically populates from the subject's `chapters.json`.
4. **Instant Topic Finder**: Full scoring algorithm, subtopics search, and spotlight banner work out-of-the-box.
5. **Page Inspector**: Automatically clamps slider to `1` to `totalPages` for that subject.
6. **Knowledge Explorer & Multi-Engine Web Search**: Queries Wikipedia and search engines with subject-relevant keywords.
