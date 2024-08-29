export enum SentimentType {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  NEUTRAL = 'neutral',
}

export type Sentiment = {
  main: SentimentType,
  scores: Record<SentimentType, number>;
};
