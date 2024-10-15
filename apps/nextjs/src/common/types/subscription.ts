import { type SubscriptionFrequency } from '~/common';

export interface Frequency {
  value: SubscriptionFrequency;
  label: string;
  priceSuffix: string;
}
