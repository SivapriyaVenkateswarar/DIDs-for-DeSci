export interface IncentiveEffect {
  voting_weight?: number;
  badge?: string;
  access?: string[];
}

export interface IncentiveResult {
  platform: string;
  score: number;
  effects: IncentiveEffect;
}
