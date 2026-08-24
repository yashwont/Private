export type Memory = {
  src: string;
  alt: string;
  caption: string;
  variant: "wide" | "polaroid" | "tall";
};

export const apology = {
  // Replace these names before deployment.
  herName: "Alisha",
  myName: "Yashan",
  importantDate: "",
  theme: {
    ivory: "#fff8ee",
    parchment: "#f5eadb",
    burgundy: "#6f1d2f",
    rose: "#b66a74",
    clay: "#8d5b4c",
    cocoa: "#3b2420",
    moss: "#6f7461"
  },
  heroImage: "/images/hero.jpg",
  finalImage: "/images/final-photo.jpg",
  youtubeMusicId: "II61t5qHJ2E",
  opening: {
    line: "I made something for you because a simple 'sorry' didn't feel enough.",
    button: "Please hear me out"
  },
  hero: {
    title: "For the person I never wanted to hurt",
    text: "I can't take back the words I used, but I can take responsibility for them."
  },
  acknowledgement: {
    title: "Something I've Been Thinking About",
    paragraphs: [
      "Sometimes emotions become difficult to express, and the words we choose don't reflect what is truly in our hearts.",
      "Looking back, I realise that I could have communicated with more patience, kindness and understanding. I never wanted you to feel unappreciated or misunderstood, because you mean far more to me than I always manage to express.",
      "I cannot change that moment, but I can learn from it. I want to listen more carefully, communicate more gently and be more thoughtful with your feelings.",
      "I am truly sorry for hurting you."
    ]
  },
  understandings: [
    {
      title: "My words were unfair",
      text: "I turned my emotions into accusations instead of explaining what I was feeling calmly and respectfully."
    },
    {
      title: "I made you feel misunderstood",
      text: "By saying that you didn't respect me, I may have made you feel that your love, care and effort meant nothing to me. That was unfair."
    },
    {
      title: "Sorry requires change",
      text: "A meaningful apology is not only about saying the right words. It is about communicating better and showing change through consistent actions."
    }
  ],
  memories: [
    {
      src: "/images/memory-1.jpg",
      alt: "A playful ice cream selfie together",
      caption: "The silly moments I love",
      variant: "wide"
    },
    {
      src: "/images/memory-2.jpg",
      alt: "Smiling together in front of flowers",
      caption: "One of my favourite smiles",
      variant: "polaroid"
    },
    {
      src: "/images/memory-3.jpg",
      alt: "A close quiet moment together",
      caption: "The little moments mean everything",
      variant: "tall"
    },
    {
      src: "/images/memory-4.jpg",
      alt: "A playful upside-down selfie together",
      caption: "A memory close to my heart",
      variant: "polaroid"
    },
    {
      src: "/images/memory-5.jpg",
      alt: "Smiling at each other in a close selfie",
      caption: "A look I never want to take for granted",
      variant: "wide"
    },
    {
      src: "/images/memory-6.png",
      alt: "A bright outdoor memory together",
      caption: "A day that still feels warm",
      variant: "polaroid"
    }
  ] satisfies Memory[],
  // Replace these with her real qualities before deployment.
  appreciations: [
    "I appreciate the way you care.",
    "I appreciate the happiness you bring into ordinary moments.",
    "I appreciate your patience, even when I make things difficult.",
    "I appreciate the memories we have created.",
    "I appreciate you, not only when everything is easy, but every day."
  ],
  letter: {
    greeting: "My love,",
    paragraphs: [
      "I am sorry for the words I used and for the way I spoke to you. Saying that you didn't respect me or that you looked down on me was hurtful and unfair.",
      "I should have explained my feelings without attacking your character or questioning how much you value me. You deserved a calm conversation, but instead, I allowed my emotions to control my words.",
      "I cannot expect this website to erase the hurt. I made it because I wanted to slow down, reflect, and give you the apology I should have given with patience and honesty.",
      "I will work on listening before reacting, expressing my feelings without making accusations, and choosing words that protect our relationship instead of damaging it.",
      "You do not have to forgive me immediately. I respect whatever time and space you need. I only want you to know that I recognise my mistake, I care about your feelings, and I am truly sorry."
    ],
    closing: "With love,"
  },
  promises: [
    "I will pause before speaking when I am angry.",
    "I will explain my feelings without accusing you.",
    "I will listen to understand, not only to respond.",
    "I will show my respect through consistent actions."
  ],
  final: {
    firstLine: "I'm not asking you to forget what happened.",
    secondLine: "I'm asking for the chance to show you that I can communicate, listen and love you better.",
    apologyLine: "I am truly sorry",
    memoryMessage: "No matter what happens next, I'm grateful for every genuine moment we have shared.",
    questionIntro: "Before you go, there's one thing I want to ask...",
    question: "Will you accept my apology?",
    reassurance: "I understand if you need time. Whatever you choose, I respect how you feel.",
    notYetMessage:
      "I understand. Take all the time you need. I'm not expecting an immediate answer. I only wanted you to know that I'm genuinely sorry.",
    acceptanceTitle: "Thank you for hearing my heart.",
    acceptanceText:
      "Your forgiveness means more to me than I can put into words. I'll do my best to show through my actions how much you mean to me.",
    acceptanceClosing: "Here's to understanding each other, growing together and creating happier memories.",
    favoriteMemoryCaption: "This is only one moment, but it holds a thousand reasons why you are special to me."
  }
};
