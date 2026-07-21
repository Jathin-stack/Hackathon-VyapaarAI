/**
 * Customer Segmentation & Marketing Automation
 *
 * Segments: Premium | Frequent | Returning | Inactive
 * Generates personalized WhatsApp messages per segment
 */

import { customers, type Customer } from '../data/businessData';
import {
  customerReactivationMessage,
  loyaltyRewardMessage,
  premiumOfferMessage,
  sendWhatsApp,
} from './whatsappService';

export interface SegmentedOffer {
  customer: Customer;
  offerType: string;
  message: string;
  whatsappUrl: string;
}

export function getMessageForSegment(customer: Customer, storeName = 'Vyapaar AI Store'): string {
  switch (customer.segment) {
    case 'inactive':
      return customerReactivationMessage(customer.name.split(' ')[0], 15, storeName);

    case 'premium':
      return premiumOfferMessage(
        customer.name.split(' ')[0],
        `${customer.loyaltyPoints} Loyalty Points — redeem for exclusive rewards!`,
        storeName,
      );

    case 'frequent':
      return loyaltyRewardMessage(customer.name.split(' ')[0], 50, storeName);

    case 'returning':
      return `Dear ${customer.name.split(' ')[0]},

Welcome back! 🙏

We have exciting new products and festival offers waiting for you at ${storeName}.

Your loyalty points: ${customer.loyaltyPoints} 🎁

Visit us soon!

Regards,
${storeName}`;

    default:
      return loyaltyRewardMessage(customer.name.split(' ')[0], 25, storeName);
  }
}

export function getOfferTypeLabel(segment: Customer['segment']): string {
  switch (segment) {
    case 'premium':  return 'Exclusive Loyalty Reward';
    case 'frequent': return 'Bonus Points Offer';
    case 'returning':return 'Festival Offer';
    case 'inactive': return 'Come Back Offer (15% OFF)';
    default:         return 'Special Offer';
  }
}

export function buildSegmentedOffers(storeName = 'Vyapaar AI Store'): SegmentedOffer[] {
  return customers.map((c) => {
    const message = getMessageForSegment(c, storeName);
    const phone = c.phone.replace(/\D/g, '');
    const encoded = encodeURIComponent(message);
    const waPhone = phone.startsWith('91') ? phone : `91${phone}`;
    return {
      customer: c,
      offerType: getOfferTypeLabel(c.segment),
      message,
      whatsappUrl: `https://wa.me/${waPhone}?text=${encoded}`,
    };
  });
}

export function sendSegmentMessage(customer: Customer): void {
  const message = getMessageForSegment(customer);
  sendWhatsApp(customer.phone, message);
}

export function getSegmentStats() {
  return {
    premium:  customers.filter((c) => c.segment === 'premium').length,
    frequent: customers.filter((c) => c.segment === 'frequent').length,
    returning:customers.filter((c) => c.segment === 'returning').length,
    inactive: customers.filter((c) => c.segment === 'inactive').length,
    total:    customers.length,
  };
}
