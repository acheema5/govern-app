import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const sampleRulings = [
  {
    title: "Dobbs v. Jackson Women's Health Organization",
    summary: "The Court held that the Constitution does not confer a right to abortion, overruling Roe v. Wade and Planned Parenthood v. Casey.",
    fullText: "https://www.supremecourt.gov/opinions/21pdf/19-1392_6j37.pdf",
    date: "2022-06-24",
    citation: "597 U.S. ___ (2022)"
  },
  {
    title: "New York State Rifle & Pistol Association v. Bruen",
    summary: "The Court held that New York's proper-cause requirement for concealed carry permits violates the Second Amendment.",
    fullText: "https://www.supremecourt.gov/opinions/21pdf/20-843_7j80.pdf",
    date: "2022-06-23",
    citation: "597 U.S. ___ (2022)"
  },
  {
    title: "West Virginia v. Environmental Protection Agency",
    summary: "The Court held that the EPA exceeded its authority under the Clean Air Act in regulating greenhouse gas emissions from power plants.",
    fullText: "https://www.supremecourt.gov/opinions/21pdf/20-1530_n758.pdf",
    date: "2022-06-30",
    citation: "597 U.S. ___ (2022)"
  },
  {
    title: "Kennedy v. Bremerton School District",
    summary: "The Court held that a public school football coach's post-game prayers were protected by the First Amendment.",
    fullText: "https://www.supremecourt.gov/opinions/21pdf/21-418_i425.pdf",
    date: "2022-06-27",
    citation: "597 U.S. ___ (2022)"
  },
  {
    title: "Carson v. Makin",
    summary: "The Court held that Maine's exclusion of religious schools from its tuition assistance program violated the Free Exercise Clause.",
    fullText: "https://www.supremecourt.gov/opinions/21pdf/20-1088_1a7g.pdf",
    date: "2022-06-21",
    citation: "597 U.S. ___ (2022)"
  }
];

export const populateSupremeCourtRulings = async () => {
  try {
    const rulingsRef = collection(db, 'supremeCourtRulings');
    
    for (const ruling of sampleRulings) {
      await addDoc(rulingsRef, ruling);
      console.log(`Added ruling: ${ruling.title}`);
    }
    
    console.log('Successfully populated Supreme Court rulings');
  } catch (error) {
    console.error('Error populating rulings:', error);
  }
}; 