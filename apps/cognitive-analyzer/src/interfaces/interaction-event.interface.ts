export interface InteractionEvent {
  id: string;
  userId: string;
  content: string;
  timestamp: number;
  type?: 'interaction' | 'burnout_alert' | string;
}

export interface BurnoutAlert {
  userId: string;
  riskLevel: string;
  correlationId?: string;
  observedAt: number;
}
