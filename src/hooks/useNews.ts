import { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { UserPreferences } from './useAuth';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  region: string;
  category: string;
  imageUrl: string;
  tags: string[];
}

export const useNews = (userId: string | null) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        
        // Get user preferences if userId is provided
        let userPreferences: UserPreferences | null = null;
        if (userId) {
          const userDoc = await getDoc(doc(db, 'users', userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            userPreferences = userData.preferences;
          }
        }

        // Fetch all news
        const newsRef = collection(db, 'news');
        const newsQuery = query(newsRef);
        const querySnapshot = await getDocs(newsQuery);
        let newsItems: NewsItem[] = [];
        
        querySnapshot.forEach((doc) => {
          newsItems.push({ ...doc.data(), id: doc.id } as NewsItem);
        });

        // Filter and sort by user preferences if available
        if (userPreferences) {
          newsItems = newsItems.filter(item => 
            item.tags.some(tag => userPreferences!.interests.includes(tag))
          );

          // Sort by relevance to user interests
          newsItems.sort((a, b) => {
            const aRelevance = a.tags.filter(tag => 
              userPreferences!.interests.includes(tag)
            ).length;
            const bRelevance = b.tags.filter(tag => 
              userPreferences!.interests.includes(tag)
            ).length;
            return bRelevance - aRelevance;
          });
        }

        setNews(newsItems);
        setError(null);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [userId]);

  return { news, loading, error };
};

export default useNews; 