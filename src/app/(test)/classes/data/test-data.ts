




/*
export const initialGroups: Group[] = [
  {
    id: "1",
    title: "Mathematics Year 10",
    joinCode: "MATH10A",
    memberCount: 24,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Science Year 9",
    joinCode: "SCI9B",
    memberCount: 18,
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    title: "English Literature Year 11",
    joinCode: "ENG11A",
    memberCount: 22,
    createdAt: "2024-01-22",
  },
  {
    id: "4",
    title: "Physics Year 12",
    joinCode: "PHY12B",
    memberCount: 16,
    createdAt: "2024-01-25",
  },
  {
    id: "5",
    title: "Chemistry Year 11",
    joinCode: "CHEM11C",
    memberCount: 19,
    createdAt: "2024-01-28",
  },
  {
    id: "6",
    title: "Biology Year 10",
    joinCode: "BIO10D",
    memberCount: 21,
    createdAt: "2024-02-01",
  },
  {
    id: "7",
    title: "History Year 9",
    joinCode: "HIST9E",
    memberCount: 17,
    createdAt: "2024-02-03",
  },
  {
    id: "8",
    title: "Geography Year 10",
    joinCode: "GEO10F",
    memberCount: 20,
    createdAt: "2024-02-05",
  },
  {
    id: "9",
    title: "Art & Design Year 11",
    joinCode: "ART11G",
    memberCount: 15,
    createdAt: "2024-02-08",
  },
  {
    id: "10",
    title: "Music Theory Year 9",
    joinCode: "MUS9H",
    memberCount: 12,
    createdAt: "2024-02-10",
  },
  {
    id: "11",
    title: "Computer Science Year 12",
    joinCode: "CS12I",
    memberCount: 25,
    createdAt: "2024-02-12",
  },
  {
    id: "12",
    title: "French Language Year 10",
    joinCode: "FR10J",
    memberCount: 18,
    createdAt: "2024-02-15",
  },
  {
    id: "13",
    title: "Spanish Language Year 11",
    joinCode: "SP11K",
    memberCount: 16,
    createdAt: "2024-02-17",
  },
  {
    id: "14",
    title: "Physical Education Year 9",
    joinCode: "PE9L",
    memberCount: 28,
    createdAt: "2024-02-20",
  },
  {
    id: "15",
    title: "Drama & Theatre Year 10",
    joinCode: "DRA10M",
    memberCount: 14,
    createdAt: "2024-02-22",
  },
  {
    id: "16",
    title: "Economics Year 12",
    joinCode: "ECON12N",
    memberCount: 19,
    createdAt: "2024-02-25",
  },
  {
    id: "17",
    title: "Psychology Year 11",
    joinCode: "PSY11O",
    memberCount: 23,
    createdAt: "2024-02-28",
  },
  {
    id: "18",
    title: "Business Studies Year 10",
    joinCode: "BUS10P",
    memberCount: 20,
    createdAt: "2024-03-01",
  },
  {
    id: "19",
    title: "Media Studies Year 11",
    joinCode: "MED11Q",
    memberCount: 17,
    createdAt: "2024-03-03",
  },
  {
    id: "20",
    title: "Philosophy Year 12",
    joinCode: "PHIL12R",
    memberCount: 13,
    createdAt: "2024-03-05",
  },
  {
    id: "21",
    title: "Statistics & Data Year 11",
    joinCode: "STAT11S",
    memberCount: 21,
    createdAt: "2024-03-08",
  },
  {
    id: "22",
    title: "Environmental Science Year 10",
    joinCode: "ENV10T",
    memberCount: 18,
    createdAt: "2024-03-10",
  },
]

*/



export interface Profile {
  id: string
  name: string
  email: string
  motherEmail: string
  fatherEmail: string
  groups: { id: string; title: string }[]
  joinedAt: string
  is_teacher: boolean
}

export const initialProfiles: Profile[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.johnson@school.edu",
    motherEmail: "mary.johnson@email.com",
    fatherEmail: "david.johnson@email.com",
    groups: [{ id: "1", title: "Mathematics Year 10" }],
    joinedAt: "2024-01-16",
    is_teacher: false,
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob.smith@school.edu",
    motherEmail: "susan.smith@email.com",
    fatherEmail: "robert.smith@email.com",
    groups: [{ id: "2", title: "Science Year 9" }],
    joinedAt: "2024-01-21",
    is_teacher: false,
  },
  {
    id: "3",
    name: "Carol Davis",
    email: "carol.davis@school.edu",
    motherEmail: "linda.davis@email.com",
    fatherEmail: "michael.davis@email.com",
    groups: [
      { id: "1", title: "Mathematics Year 10" },
      { id: "2", title: "Science Year 9" },
    ],
    joinedAt: "2024-01-22",
    is_teacher: false,
  },
  {
    id: "4",
    name: "Emma Wilson",
    email: "emma.wilson@school.edu",
    motherEmail: "sarah.wilson@email.com",
    fatherEmail: "james.wilson@email.com",
    groups: [
      { id: "3", title: "English Literature Year 11" },
      { id: "7", title: "History Year 9" },
    ],
    joinedAt: "2024-01-23",
    is_teacher: false,
  },
  {
    id: "5",
    name: "Liam Brown",
    email: "liam.brown@school.edu",
    motherEmail: "jennifer.brown@email.com",
    fatherEmail: "christopher.brown@email.com",
    groups: [{ id: "4", title: "Physics Year 12" }],
    joinedAt: "2024-01-24",
    is_teacher: false,
  },
  {
    id: "6",
    name: "Olivia Taylor",
    email: "olivia.taylor@school.edu",
    motherEmail: "michelle.taylor@email.com",
    fatherEmail: "andrew.taylor@email.com",
    groups: [
      { id: "5", title: "Chemistry Year 11" },
      { id: "6", title: "Biology Year 10" },
    ],
    joinedAt: "2024-01-25",
    is_teacher: false,
  },
  {
    id: "7",
    name: "Noah Anderson",
    email: "noah.anderson@school.edu",
    motherEmail: "amanda.anderson@email.com",
    fatherEmail: "matthew.anderson@email.com",
    groups: [{ id: "11", title: "Computer Science Year 12" }],
    joinedAt: "2024-01-26",
    is_teacher: false,
  },
  {
    id: "8",
    name: "Ava Thomas",
    email: "ava.thomas@school.edu",
    motherEmail: "lisa.thomas@email.com",
    fatherEmail: "daniel.thomas@email.com",
    groups: [
      { id: "12", title: "French Language Year 10" },
      { id: "13", title: "Spanish Language Year 11" },
    ],
    joinedAt: "2024-01-27",
    is_teacher: false,
  },
  {
    id: "9",
    name: "William Jackson",
    email: "william.jackson@school.edu",
    motherEmail: "karen.jackson@email.com",
    fatherEmail: "steven.jackson@email.com",
    groups: [{ id: "9", title: "Art & Design Year 11" }],
    joinedAt: "2024-01-28",
    is_teacher: false,
  },
  {
    id: "10",
    name: "Sophia White",
    email: "sophia.white@school.edu",
    motherEmail: "nancy.white@email.com",
    fatherEmail: "kevin.white@email.com",
    groups: [
      { id: "10", title: "Music Theory Year 9" },
      { id: "15", title: "Drama & Theatre Year 10" },
    ],
    joinedAt: "2024-01-29",
    is_teacher: false,
  },
  {
    id: "103",
    name: "Thaddeus Hunt",
    email: "thaddeus.hunt@school.edu",
    motherEmail: "kimberly.hunt@email.com",
    fatherEmail: "ophelia.hunt@email.com",
    groups: [
      { id: "13", title: "Spanish Language Year 11" },
      { id: "1", title: "Mathematics Year 10" },
    ],
    joinedAt: "2024-05-02",
    is_teacher: false,
  },
]
