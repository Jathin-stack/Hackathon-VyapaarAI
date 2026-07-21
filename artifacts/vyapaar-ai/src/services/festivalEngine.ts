/**
 * AI Festival Marketing Engine
 *
 * Analyzes upcoming Indian festivals, local events, seasonal demand
 * Generates personalized offers, WhatsApp campaigns, countdown data
 */

import { festivals, localEvents, products, customers, type Festival } from '../data/businessData';
import { festivalOfferMessage } from './whatsappService';

export interface FestivalCampaign {
  festival: Festival;
  offers: string[];
  suggestedProducts: string[];
  targetCustomers: number;
  message: string;
  urgency: 'now' | 'soon' | 'upcoming';
}

export interface CountdownData {
  festival: Festival;
  daysLeft: number;
  hoursLeft: number;
  urgency: 'today' | 'this-week' | 'soon';
}

const OFFER_TEMPLATES: Record<string, string[]> = {
  Diwali:          ['Buy 2 Get 1 Free on sweets', '20% off on Dry Fruits & Chocolates', 'Flat ₹100 off above ₹1,000', 'Gift hamper combos at special price'],
  Sankranti:       ['Buy 2 Get 1 Free on Til & Sweets', 'Flat ₹50 off above ₹500', 'Special Sankranti combo packs'],
  Christmas:       ['Gift box combos', '15% off on Chocolates & Biscuits', 'Merry Christmas special hamper'],
  Holi:            ['Colour combo packs', '10% off on beverages', 'Holi special snack bundles'],
  Eid:             ['Festival food hampers', '20% off on dry fruits', 'Eid Mubarak special deals'],
  Dussehra:        ['Victory celebration packs', 'Buy 3 Get 1 Free on snacks', 'Navratri special offers'],
  'Independence Day': ['Patriotic combo offer', '15% off on soft drinks & snacks', 'Flag day bundle'],
  'Republic Day':  ['Festive combo', '10% off on all beverages'],
};

export function getDaysUntil(dateStr: string): number {
  const now = new Date();
  
  // Parse month and day from dateStr (e.g. 'Oct 31, 2025' -> Month: 9, Day: 31)
  const parts = dateStr.match(/([A-Za-z]+)\s+(\d+)/);
  if (!parts) return 0;
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthIndex = monthNames.indexOf(parts[1].slice(0, 3));
  const day = parseInt(parts[2]);
  
  // Create a date object for the current year
  let targetYear = now.getFullYear();
  let targetDate = new Date(targetYear, monthIndex, day);
  
  // If the target date has already passed this year, set it to the next year
  if (targetDate.getTime() < now.getTime()) {
    targetYear += 1;
    targetDate = new Date(targetYear, monthIndex, day);
  }
  
  // Calculate difference in days
  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function getDynamicFestivals() {
  return festivals.map(f => {
    const daysUntil = getDaysUntil(f.date);
    return { ...f, daysUntil };
  });
}

function getOffersForFestival(festival: Festival): string[] {
  return OFFER_TEMPLATES[festival.name] || festival.offerTypes.concat(['Special discount for loyal customers']);
}

export function generateFestivalCampaigns(): FestivalCampaign[] {
  return getDynamicFestivals()
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .map((festival) => {
      const offers = getOffersForFestival(festival);
      const suggestedProducts = festival.products;
      const message = festivalOfferMessage(festival.name, offers);

      let urgency: FestivalCampaign['urgency'] = 'upcoming';
      if (festival.daysUntil <= 3) urgency = 'now';
      else if (festival.daysUntil <= 14) urgency = 'soon';

      return {
        festival,
        offers,
        suggestedProducts,
        targetCustomers: customers.length,
        message,
        urgency,
      };
    });
}

export function getNextFestival(): FestivalCampaign | null {
  const campaigns = generateFestivalCampaigns();
  return campaigns[0] || null;
}

export function getCountdownData(): CountdownData[] {
  return getDynamicFestivals()
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, 3)
    .map((f) => {
      const hoursLeft = f.daysUntil * 24;
      let urgency: CountdownData['urgency'] = 'soon';
      if (f.daysUntil === 0) urgency = 'today';
      else if (f.daysUntil <= 7) urgency = 'this-week';
      return { festival: f, daysLeft: f.daysUntil, hoursLeft, urgency };
    });
}

/** Get products to stock for upcoming festivals */
export function getFestivalStockRecommendations(): { product: string; festival: string; daysUntil: number; multiplier: number }[] {
  const recs: { product: string; festival: string; daysUntil: number; multiplier: number }[] = [];
  const upcoming = getDynamicFestivals().filter((f) => f.daysUntil <= 30);

  for (const f of upcoming) {
    for (const productName of f.products) {
      recs.push({
        product: productName,
        festival: f.name,
        daysUntil: f.daysUntil,
        multiplier: f.demandMultiplier,
      });
    }
  }

  return recs.sort((a, b) => a.daysUntil - b.daysUntil);
}

