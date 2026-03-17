import { Class } from "@/lib/types/Resources";

// API Response Data Integration
const apiResponse = {
  statusCode: 200,
  message: "Success",
  data: [
    {
      classId: "ab7d2d4a-fa5b-4445-9175-a0dbd33aad2f",
      className: "UKG-D",
      subjects: [
        {
          subjectId: "3b5511e6-e249-4c02-af41-fecd3674b717",
          subjectName: "Mathematics",
          chapters: [
            {
              chapterId: "46d75a63-9a71-4494-9d09-ae99f86a0b7c",
              chapterName: "asdfsf",
              chapterNo: 1,
              resources: [
                {
                  id: "b409cbf1-4009-4529-adbc-4e1ae0a844fe",
                  title: "HAMMER",
                  description: "DOEMSTICKSD",
                  resourceType: "PDF",
                  uploadedBy: {
                    id: "24ccd4f6-c072-46a6-b82a-5c781fdfd07f",
                    name: "Hassi sduhfi",
                  },
                  createdAt: "2026-03-16T11:22:00.142Z",
                  updatedAt: "2026-03-16T11:22:00.142Z",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  Total_Records: 1,
};

// Transform API data to match existing Class interface
export const resourcesData: Class[] = [
  {
    id: apiResponse.data[0].classId,
    code: apiResponse.data[0].className,
    name: `Grade ${apiResponse.data[0].className.replace(/[^0-9]/g, "")} · Section ${apiResponse.data[0].className.slice(-1)}`,
    level: "Primary",
    color: "blue",
    gradient: "var(--blue),var(--indigo)",
    subjects: apiResponse.data[0].subjects.map(subject => ({
      id: subject.subjectId,
      name: subject.subjectName,
      code: subject.subjectName.replace(/\s+/g, "-").toUpperCase(),
      teacher: subject.chapters[0]?.resources[0]?.uploadedBy?.name || "Unknown",
      color: "blue",
      icon: "calc",
      chapters: subject.chapters.map(chapter => ({
        id:
          chapter.chapterId || `ch-${Math.random().toString(36).substr(2, 9)}`,
        name: `Ch ${chapter.chapterNo}: ${chapter.chapterName}`,
        resources: chapter.resources.map(resource => ({
          title: resource.title,
          type: resource.resourceType as "PDF" | "Video" | "Notes" | "Link",
          size: "Unknown", // API doesn't provide size
          icon:
            resource.resourceType === "PDF"
              ? "📄"
              : resource.resourceType === "Video"
                ? "🎬"
                : "📝",
          bg:
            resource.resourceType === "PDF"
              ? "rose"
              : resource.resourceType === "Video"
                ? "blue"
                : "amber",
        })),
      })),
    })),
  },
  // Keep existing mock data for other classes...
  {
    id: "c1",
    code: "10-A",
    name: "Grade 10 · Section A",
    level: "Secondary",
    color: "blue",
    gradient: "var(--blue),var(--indigo)",
    subjects: [
      {
        id: "s1",
        name: "Mathematics",
        code: "MATH-10",
        teacher: "Sunita Mishra",
        color: "blue",
        icon: "calc",
        chapters: [
          {
            name: "Ch 5: Quadratic Equations",
            resources: [
              {
                title: "Quadratic Equations Notes",
                type: "PDF",
                size: "2.4 MB",
                icon: "📄",
                bg: "rose",
              },
              {
                title: "Solving Quadratics Video",
                type: "Video",
                size: "28 min",
                icon: "🎬",
                bg: "blue",
              },
              {
                title: "Practice Worksheet",
                type: "PDF",
                size: "1.1 MB",
                icon: "📄",
                bg: "rose",
              },
            ],
          },
          {
            name: "Ch 6: Arithmetic Progressions",
            resources: [
              {
                title: "AP Formula Sheet",
                type: "PDF",
                size: "850 KB",
                icon: "📄",
                bg: "rose",
              },
              {
                title: "AP Problems & Solutions",
                type: "Notes",
                size: "12 pages",
                icon: "📝",
                bg: "amber",
              },
            ],
          },
          {
            name: "Ch 7: Coordinate Geometry",
            resources: [
              {
                title: "Coordinate Geometry Basics",
                type: "Video",
                size: "35 min",
                icon: "🎬",
                bg: "blue",
              },
            ],
          },
        ],
      },
      {
        id: "s2",
        name: "Science",
        code: "SCI-10",
        teacher: "Vivek Pandey",
        color: "green",
        icon: "flask",
        chapters: [
          {
            name: "Ch 3: Chemical Bonding",
            resources: [
              {
                title: "Chemical Bonding Lecture",
                type: "Video",
                size: "45 min",
                icon: "🎬",
                bg: "blue",
              },
              {
                title: "Bonding Types Summary",
                type: "PDF",
                size: "1.5 MB",
                icon: "📄",
                bg: "rose",
              },
            ],
          },
          {
            name: "Ch 4: Carbon Compounds",
            resources: [
              {
                title: "Carbon Compounds Notes",
                type: "Notes",
                size: "10 pages",
                icon: "📝",
                bg: "amber",
              },
              {
                title: "NCERT Carbon Chapter",
                type: "Link",
                size: "",
                icon: "🔗",
                bg: "green",
              },
            ],
          },
        ],
      },
      {
        id: "s3",
        name: "English",
        code: "ENG-10",
        teacher: "Rekha Tiwari",
        color: "indigo",
        icon: "lang",
        chapters: [
          {
            name: "Ch 7: Shakespeare Sonnets",
            resources: [
              {
                title: "Shakespeare Sonnets Guide",
                type: "PDF",
                size: "1.8 MB",
                icon: "📄",
                bg: "indigo",
              },
              {
                title: "Shakespearean Language Tips",
                type: "Notes",
                size: "6 pages",
                icon: "📝",
                bg: "amber",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c2",
    code: "9-B",
    name: "Grade 9 · Section B",
    level: "Secondary",
    color: "indigo",
    gradient: "var(--indigo),var(--blue)",
    subjects: [
      {
        id: "s4",
        name: "Science",
        code: "SCI-9",
        teacher: "Vivek Pandey",
        color: "green",
        icon: "flask",
        chapters: [
          {
            name: "Ch 3: Chemical Reactions",
            resources: [
              {
                title: "Chemical Reactions Lab Guide",
                type: "PDF",
                size: "3.2 MB",
                icon: "📄",
                bg: "rose",
              },
              {
                title: "Reaction Types Flowchart",
                type: "Notes",
                size: "4 pages",
                icon: "📝",
                bg: "amber",
              },
              {
                title: "Lab Safety Video",
                type: "Video",
                size: "15 min",
                icon: "🎬",
                bg: "blue",
              },
            ],
          },
        ],
      },
      {
        id: "s5",
        name: "English",
        code: "ENG-9",
        teacher: "Rekha Tiwari",
        color: "indigo",
        icon: "lang",
        chapters: [
          {
            name: "Ch 5: Essay Writing",
            resources: [
              {
                title: "Essay Structure Guide",
                type: "PDF",
                size: "1.2 MB",
                icon: "📄",
                bg: "rose",
              },
              {
                title: "Climate Change Reference",
                type: "Link",
                size: "",
                icon: "🔗",
                bg: "green",
              },
            ],
          },
        ],
      },
      {
        id: "s6",
        name: "Mathematics",
        code: "MATH-9",
        teacher: "Sunita Mishra",
        color: "blue",
        icon: "calc",
        chapters: [
          {
            name: "Ch 1: Number Systems",
            resources: [
              {
                title: "Number Systems Explained",
                type: "Video",
                size: "22 min",
                icon: "🎬",
                bg: "blue",
              },
              {
                title: "Irrational Numbers Notes",
                type: "Notes",
                size: "8 pages",
                icon: "📝",
                bg: "amber",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c3",
    code: "11-C",
    name: "Grade 11 · Section C",
    level: "Senior",
    color: "amber",
    gradient: "var(--amber),var(--rose)",
    subjects: [
      {
        id: "s7",
        name: "Computer Science",
        code: "CS-11",
        teacher: "Vivek Pandey",
        color: "cyan",
        icon: "code",
        chapters: [
          {
            name: "Ch 1: Python Basics",
            resources: [
              {
                title: "Python Basics Tutorial",
                type: "Video",
                size: "32 min",
                icon: "🎬",
                bg: "cyan",
              },
              {
                title: "Python Cheat Sheet",
                type: "PDF",
                size: "920 KB",
                icon: "📄",
                bg: "rose",
              },
            ],
          },
          {
            name: "Ch 3: Sorting Algorithms",
            resources: [
              {
                title: "Sorting Algorithms Explained",
                type: "Video",
                size: "40 min",
                icon: "🎬",
                bg: "cyan",
              },
              {
                title: "Bubble Sort Code",
                type: "Notes",
                size: "3 pages",
                icon: "📝",
                bg: "amber",
              },
              {
                title: "Visualgo Sorting Tool",
                type: "Link",
                size: "",
                icon: "🔗",
                bg: "green",
              },
            ],
          },
        ],
      },
      {
        id: "s8",
        name: "Accountancy",
        code: "ACC-11",
        teacher: "Anand Sharma",
        color: "amber",
        icon: "chart",
        chapters: [
          {
            name: "Ch 1: Introduction to Accounting",
            resources: [
              {
                title: "Accounting Basics PDF",
                type: "PDF",
                size: "2.0 MB",
                icon: "📄",
                bg: "amber",
              },
            ],
          },
        ],
      },
      {
        id: "s9",
        name: "English",
        code: "ENG-11",
        teacher: "Rekha Tiwari",
        color: "indigo",
        icon: "lang",
        chapters: [
          {
            name: "Ch 2: Poetry Analysis",
            resources: [
              {
                title: "Poetry Analysis Framework",
                type: "PDF",
                size: "1.6 MB",
                icon: "📄",
                bg: "indigo",
              },
              {
                title: "Rhyme Scheme Reference",
                type: "Notes",
                size: "5 pages",
                icon: "📝",
                bg: "amber",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c4",
    code: "12-B",
    name: "Grade 12 · Section B",
    level: "Senior",
    color: "green",
    gradient: "var(--green),var(--cyan)",
    subjects: [
      {
        id: "s10",
        name: "Accountancy",
        code: "ACC-12",
        teacher: "Anand Sharma",
        color: "amber",
        icon: "chart",
        chapters: [
          {
            name: "Ch 4: Partnership Accounts",
            resources: [
              {
                title: "Partnership Accounting Guide",
                type: "PDF",
                size: "3.5 MB",
                icon: "📄",
                bg: "rose",
              },
              {
                title: "Practice Problems Set",
                type: "Notes",
                size: "15 pages",
                icon: "📝",
                bg: "amber",
              },
            ],
          },
        ],
      },
      {
        id: "s11",
        name: "Mathematics",
        code: "MATH-12",
        teacher: "Sunita Mishra",
        color: "blue",
        icon: "calc",
        chapters: [
          {
            name: "Ch 1: Relations & Functions",
            resources: [
              {
                title: "Functions Masterclass",
                type: "Video",
                size: "50 min",
                icon: "🎬",
                bg: "blue",
              },
              {
                title: "Relations Study Notes",
                type: "PDF",
                size: "2.8 MB",
                icon: "📄",
                bg: "rose",
              },
            ],
          },
          {
            name: "Ch 2: Inverse Trigonometry",
            resources: [
              {
                title: "Inverse Trig Formulas",
                type: "PDF",
                size: "1.4 MB",
                icon: "📄",
                bg: "rose",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c5",
    code: "8-A",
    name: "Grade 8 · Section A",
    level: "Middle",
    color: "cyan",
    gradient: "var(--cyan),var(--green)",
    subjects: [
      {
        id: "s12",
        name: "Mathematics",
        code: "MATH-8",
        teacher: "Sunita Mishra",
        color: "blue",
        icon: "calc",
        chapters: [
          {
            name: "Ch 1: Rational Numbers",
            resources: [
              {
                title: "Rational Numbers Intro",
                type: "Video",
                size: "18 min",
                icon: "🎬",
                bg: "blue",
              },
            ],
          },
        ],
      },
      {
        id: "s13",
        name: "Science",
        code: "SCI-8",
        teacher: "Vivek Pandey",
        color: "green",
        icon: "flask",
        chapters: [
          {
            name: "Ch 2: Microorganisms",
            resources: [
              {
                title: "Microorganisms Presentation",
                type: "PDF",
                size: "4.1 MB",
                icon: "📄",
                bg: "rose",
              },
              {
                title: "Types of Bacteria Chart",
                type: "Notes",
                size: "3 pages",
                icon: "📝",
                bg: "amber",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c6",
    code: "7-A",
    name: "Grade 7 · Section A",
    level: "Middle",
    color: "rose",
    gradient: "var(--rose),var(--indigo)",
    subjects: [
      {
        id: "s14",
        name: "History",
        code: "HIS-7",
        teacher: "Rekha Tiwari",
        color: "indigo",
        icon: "history",
        chapters: [
          {
            name: "Ch 2: French Revolution",
            resources: [
              {
                title: "French Revolution Notes",
                type: "Notes",
                size: "8 pages",
                icon: "📝",
                bg: "amber",
              },
              {
                title: "Revolution Timeline",
                type: "PDF",
                size: "1.3 MB",
                icon: "📄",
                bg: "rose",
              },
            ],
          },
        ],
      },
      {
        id: "s15",
        name: "Mathematics",
        code: "MATH-7",
        teacher: "Sunita Mishra",
        color: "blue",
        icon: "calc",
        chapters: [
          {
            name: "Ch 3: Fractions & Decimals",
            resources: [
              {
                title: "Fractions Video Tutorial",
                type: "Video",
                size: "25 min",
                icon: "🎬",
                bg: "blue",
              },
              {
                title: "NCERT Fractions Solutions",
                type: "Link",
                size: "",
                icon: "🔗",
                bg: "green",
              },
            ],
          },
        ],
      },
    ],
  },
];
