import type { LangCode } from './languages';

export type TranslationKey =
  | 'appName' | 'tagline' | 'dashboard' | 'inventory' | 'finance' | 'marketing'
  | 'customers' | 'suppliers' | 'weather' | 'festivals' | 'predictive' | 'advisor'
  | 'whatsapp' | 'health' | 'gamification' | 'settings' | 'search' | 'language'
  | 'todayRevenue' | 'todayProfit' | 'todaySales' | 'lowStock' | 'activeCustomers'
  | 'businessHealth' | 'inventoryScore' | 'financeScore' | 'salesScore' | 'profitScore'
  | 'customerScore' | 'marketingScore' | 'demandScore' | 'accuracyScore' | 'overall'
  | 'quickActions' | 'askAdvisor' | 'voiceAssistant' | 'send' | 'listening' | 'speakNow'
  | 'weatherTomorrow' | 'expectedSales' | 'recommendation' | 'profitSaved' | 'restockNow'
  | 'deadStock' | 'trending' | 'reorder' | 'stockHealth' | 'demandForecast' | 'revenuePrediction'
  | 'topProducts' | 'lowStockAlerts' | 'cashFlow' | 'expenses' | 'revenue' | 'profit'
  | 'weeklyReport' | 'monthlyReport' | 'dailyReport' | 'financialForecast' | 'smartSuggestion'
  | 'campaigns' | 'posters' | 'festivalOffers' | 'captions' | 'generateCampaign' | 'whatsappMsg'
  | 'segments' | 'premium' | 'frequent' | 'inactive' | 'returning' | 'loyalty' | 'retention'
  | 'bestSuppliers' | 'cheapest' | 'costOptimization' | 'procurement' | 'compare'
  | 'weatherEngine' | 'festivalIntel' | 'localEvents' | 'seasonal' | 'predictiveAnalytics'
  | 'aiRecommendation' | 'demandForecastDashboard' | 'seasonalTrends' | 'businessAdvisor'
  | 'growthScore' | 'achievements' | 'badges' | 'profitMaster' | 'growthChampion'
  | 'inventoryExpert' | 'salesLeader' | 'marketingGenius' | 'businessInnovator'
  | 'autonomousWorkflow' | 'updateInventory' | 'fetchWeather' | 'analyzeSales' | 'predictProfits'
  | 'recommendProducts' | 'generateOffers' | 'createPromotions' | 'suggestPurchases'
  | 'displayInsights' | 'askAnything' | 'typeQuestion' | 'insights' | 'recommendations'
  | 'viewAll' | 'export' | 'download' | 'close' | 'save' | 'cancel' | 'confirm' | 'apply'
  | 'allLanguages' | 'selectLanguage' | 'languageSync' | 'multilingualAI' | 'voiceAI'
  | 'speechToText' | 'textToSpeech' | 'naturalLanguage' | 'contextAware'
  | 'goodMorning' | 'goodAfternoon' | 'goodEvening' | 'welcomeBack' | 'shopName'
  | 'restockUrgent' | 'outOfStock' | 'inStock' | 'overstock' | 'healthy'
  | 'critical' | 'warning' | 'excellent' | 'needsAttention' | 'optimized'
  | 'today' | 'tomorrow' | 'thisWeek' | 'thisMonth' | 'nextWeek' | 'nextMonth'
  | 'units' | 'revenueToday' | 'profitToday' | 'salesToday' | 'customersToday'
  | 'avgOrderValue' | 'conversionRate' | 'repeatRate' | 'newCustomers'
  | 'weatherRainy' | 'weatherSunny' | 'weatherHot' | 'weatherCloudy' | 'weatherCold' | 'weatherStorm'
  | 'increaseStock' | 'reduceStock' | 'doNotPurchase' | 'expectedIncrease' | 'expectedDecrease'
  | 'projectedProfit' | 'profitAnalysis' | 'salesAnalysis' | 'customerAnalysis'
  | 'supplierAnalysis' | 'marketingAnalysis' | 'inventoryAnalysis' | 'weatherAnalysis'
  | 'festivalAnalysis' | 'demandAnalysis' | 'trendAnalysis' | 'weeklySales' | 'monthlySales'
  | 'dailySales' | 'hourlySales' | 'categoryBreakdown' | 'paymentMethods' | 'topCustomers'
  | 'recentTransactions' | 'stockMovement' | 'reorderSuggestions' | 'deadStockDetection'
  | 'productTrends' | 'profitOptimization' | 'expenseTracking' | 'cashFlowAnalysis'
  | 'customerSegmentation' | 'loyaltyAnalysis' | 'behaviorAnalysis' | 'personalizedOffers'
  | 'supplierRecommendations' | 'priceComparisons' | 'smartPurchasing' | 'procurementAnalytics'
  | 'postersGenerated' | 'campaignsGenerated' | 'messagesGenerated' | 'offersGenerated'
  | 'festivalGreeting' | 'promoMessage' | 'socialCaption' | 'productAd' | 'customerEngagement'
  | 'retentionCampaign' | 'loyaltyReward' | 'personalizedRecommendation' | 'customerProfile'
  | 'purchaseHistory' | 'visitFrequency' | 'avgSpend' | 'lastVisit' | 'totalSpent'
  | 'supplierName' | 'rating' | 'deliveryTime' | 'minOrder' | 'productList' | 'contactSupplier'
  | 'weatherForecast' | 'temperature' | 'humidity' | 'windSpeed' | 'precipitation' | 'uvIndex'
  | 'festivalName' | 'festivalDate' | 'recommendedProducts' | 'expectedDemand' | 'festiveOffers'
  | 'eventImpact' | 'stockRecommendation' | 'revenueForecast' | 'profitForecast'
  | 'demandPrediction' | 'accuracyValue' | 'confidenceLevel' | 'historicalData' | 'aiConfidence'
  | 'askQuestion' | 'popularQuestions' | 'whatToStock' | 'whatNotSelling' | 'whatToAvoid'
  | 'maxProfitProducts' | 'expectedMonthlyRevenue' | 'discontinueProducts' | 'increaseProfits'
  | 'festivalStock' | 'weatherAffect' | 'businessInsights' | 'smartRecommendations'
  | 'predictiveModel' | 'seasonalPatterns' | 'growthTrajectory' | 'achievementUnlocked'
  | 'levelUp' | 'pointsEarned' | 'nextLevel' | 'currentLevel' | 'leaderboard'
  | 'generateReport' | 'reportType' | 'downloadPdf' | 'shareReport' | 'scheduleReport'
  | 'autonomousMode' | 'autoUpdate' | 'autoGenerate' | 'autoAnalyze' | 'autoPredict'
  | 'contextAware' | 'businessOS' | 'aiPartner' | 'yourAiEmployee' | 'workingAutomatically'
  | 'growthRate' | 'stock'
  | 'reports' | 'notifications' | 'profile' | 'shopSettings' | 'merchantName'
  | 'phoneNumber' | 'gstNumber' | 'shopCategory' | 'businessType' | 'shopAddress'
  | 'city' | 'state' | 'onboarding' | 'completeSetup' | 'businessName' | 'storeType'
  | 'preferredLanguage' | 'productsSetup' | 'suppliersSetup' | 'customersSetup'
  | 'categoriesSetup' | 'finishSetup' | 'step' | 'of' | 'googleLogin' | 'otpLogin'
  | 'forgotPassword' | 'resetPassword' | 'sendOtp' | 'verifyOtp' | 'enterOtp'
  | 'rememberMe' | 'multiDeviceSession' | 'passwordReset' | 'sessionManagement'
  | 'dailyReport' | 'weeklyReport' | 'monthlyReport' | 'profitReport' | 'forecastReport'
  | 'inventoryReport' | 'customerReport' | 'exportPdf' | 'exportExcel' | 'exportCsv'
  | 'scheduleReport' | 'shareReport' | 'reportGenerated' | 'noNotifications'
  | 'markAllRead' | 'notificationSettings' | 'voiceInput' | 'voiceOutput'
  | 'startRecording' | 'stopRecording' | 'playResponse' | 'voiceLanguage'
  | 'shopInformation' | 'saveChanges' | 'changesSaved' | 'profileUpdated'
  | 'onboardingComplete' | 'welcomeOnboarding' | 'setupYourShop' | 'basicInfo'
  | 'shopDetails' | 'languageSetup' | 'productSetup' | 'allSet' | 'getStarted'
  | 'aiRecommendations' | 'smartInsights' | 'actionableAdvice' | 'priorityHigh'
  | 'priorityMedium' | 'priorityLow' | 'implement' | 'dismiss' | 'viewDetails'
  | 'autonomousActions' | 'autoOptimized' | 'autoOrdered' | 'autoGenerated'
  | 'autoAnalyzed' | 'autoPredicted' | 'autoRecommended' | 'posBilling';

export type TranslationDict = Partial<Record<TranslationKey, string>>;

import { en } from './locales/en';
import { hi } from './locales/hi';
import { te } from './locales/te';
import { ta } from './locales/ta';
import { kn } from './locales/kn';
import { ml } from './locales/ml';
import { mr } from './locales/mr';
import { bn } from './locales/bn';
import { gu } from './locales/gu';
import { pa } from './locales/pa';
import { ur } from './locales/ur';
import { or } from './locales/or';

export const translations: Record<LangCode, TranslationDict> = {
  en, hi, te, ta, kn, ml, mr, bn, gu, pa, ur, or,
};

export function t(lang: LangCode, key: TranslationKey): string {
  const dict = translations[lang] || translations.en;
  return dict[key] || translations.en[key] || key;
}
