export type CommunityFeature = {
  icon: string;
  title: string;
  description: string;
};

export const communityFeatures: CommunityFeature[] = [
  {
    icon: "?",
    title: "Quiz",
    description:
      "Short quizzes on the topics covered in the Technical Reports, with your score tracked over time.",
  },
  {
    icon: "◆",
    title: "Group Projects",
    description: "Team up with other members and build something together.",
  },
  {
    icon: "★",
    title: "Challenges & Prizes",
    description: "Take on timed challenges and compete for prizes.",
  },
];
