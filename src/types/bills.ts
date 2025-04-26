export interface Bill {
  title: string;
  summary: string;
  status: string;
  bias: 'left' | 'center' | 'right';
  sponsors?: string[];
  lastAction?: string;
  nextAction?: string;
  fullText?: string;
  committee?: string;
  fiscalImpact?: string;
}
