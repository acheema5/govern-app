import { useState, useEffect } from 'react';
import { Bill } from '../types/bills';

interface StateBillsState {
  bills: Bill[];
  error: string | null;
  loading: boolean;
}

export const useStateBills = (state: string | null) => {
  const [billsState, setBillsState] = useState<StateBillsState>({
    bills: [],
    error: null,
    loading: true,
  });

  useEffect(() => {
    const fetchBills = async () => {
      if (!state) {
        setBillsState({
          bills: [],
          error: 'No state provided',
          loading: false,
        });
        return;
      }

      try {
        // You'll need to sign up for an API key at https://legiscan.com/legiscan
        // Store this in an environment variable
        const LEGISCAN_API_KEY = import.meta.env.VITE_LEGISCAN_API_KEY;
        if (!LEGISCAN_API_KEY) {
          throw new Error('LegiScan API key not found. Please set VITE_LEGISCAN_API_KEY in your .env file');
        }
        
        // Get the state code
        const stateCode = getStateCode(state);
        
        const response = await fetch(
          `https://api.legiscan.com/?key=${LEGISCAN_API_KEY}&op=getMasterList&state=${stateCode}`
        );
        
        const data = await response.json();
        
        if (data.status === 'OK' && data.masterlist) {
          const bills = Object.values(data.masterlist)
            .filter((item: any) => typeof item === 'object')
            .map((bill: any) => {
              // Simple bias detection based on keywords (this is a basic example)
              let bias: 'left' | 'center' | 'right' = 'center';
              const title = bill.title.toLowerCase();
              
              // This is a very simplified example of bias detection
              if (title.includes('tax') || title.includes('regulation') || title.includes('environmental')) {
                bias = title.includes('reduce') || title.includes('cut') ? 'right' : 'left';
              }

              return {
                title: bill.title,
                summary: `${bill.bill_id} - ${bill.number}`,
                status: bill.status || 'Unknown',
                bias,
                lastAction: bill.last_action,
                committee: bill.current_committee,
                sponsors: [],
                nextAction: '',
                fullText: '',
                fiscalImpact: ''
              };
            });

          setBillsState({
            bills,
            error: null,
            loading: false,
          });
        } else {
          throw new Error('Failed to fetch bills');
        }
      } catch (error) {
        setBillsState({
          bills: [],
          error: 'Failed to fetch state bills',
          loading: false,
        });
      }
    };

    fetchBills();
  }, [state]);

  return billsState;
};

// Helper function to convert state names to two-letter codes
const getStateCode = (stateName: string): string => {
  const stateMap: { [key: string]: string } = {
    'Alabama': 'AL',
    'Alaska': 'AK',
    'Arizona': 'AZ',
    // ... add all states
    'Wyoming': 'WY'
  };
  
  return stateMap[stateName] || '';
};
