import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

interface NewsItem {
  title: string;
  summary: string;
  source: string;
  region: string;
  category: string;
  imageUrl: string;
  tags: string[];
}

const initialNews: NewsItem[] = [
  {
    title: "New Environmental Protection Bill Introduced",
    summary: "Comprehensive legislation aims to reduce carbon emissions and protect wildlife habitats",
    source: "Environmental News Network",
    region: "Federal",
    category: "Environmental Policy",
    imageUrl: "https://picsum.photos/seed/env1/200",
    tags: ["Environmental Policy", "Federal Politics", "Climate Change"]
  },
  {
    title: "Election Security Measures Enhanced",
    summary: "State implements new voting system security protocols ahead of upcoming elections",
    source: "State Election Board",
    region: "State",
    category: "Election Security",
    imageUrl: "https://picsum.photos/seed/election1/200",
    tags: ["Election Security", "State Politics", "Voting Rights"]
  },
  {
    title: "Healthcare Reform Debate Continues",
    summary: "Lawmakers discuss potential changes to healthcare system and insurance regulations",
    source: "Health Policy Journal",
    region: "Federal",
    category: "Healthcare",
    imageUrl: "https://picsum.photos/seed/health1/200",
    tags: ["Healthcare", "Federal Politics", "Policy Reform"]
  },
  {
    title: "Education Budget Increase Proposed",
    summary: "New proposal suggests 15% increase in education funding for next fiscal year",
    source: "Education Weekly",
    region: "State",
    category: "Education",
    imageUrl: "https://picsum.photos/seed/edu1/200",
    tags: ["Education", "State Politics", "Budget"]
  },
  {
    title: "Business Regulations Under Review",
    summary: "Committee examines impact of current regulations on small businesses",
    source: "Business Insider",
    region: "Federal",
    category: "Campaign Finance",
    imageUrl: "https://picsum.photos/seed/business1/200",
    tags: ["Campaign Finance", "Federal Politics", "Business"]
  }
];

export const seedDatabase = async () => {
  try {
    const newsCollection = collection(db, 'news');
    
    for (const newsItem of initialNews) {
      await addDoc(newsCollection, newsItem);
    }
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

export default initialNews;

// Uncomment and run this function once to seed the database
// seedDatabase(); 