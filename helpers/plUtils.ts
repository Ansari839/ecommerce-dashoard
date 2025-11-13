import Order from '@/models/Order';
import Purchase from '@/models/Purchase';
import MarketingExpense from '@/models/MarketingExpense';
import Product from '@/models/Product';

/**
 * Calculate total revenue from orders within a date range
 */
export async function calculateTotalRevenue(startDate?: Date, endDate?: Date): Promise<number> {
  const query: any = { status: 'completed' }; // Only completed orders contribute to revenue
  
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }
  
  const orders = await Order.find(query);
  return orders.reduce((sum, order) => {
    // Revenue is the sum of (quantity * price) for each item in the order
    const orderTotal = order.items.reduce((orderSum, item) => {
      return orderSum + (item.quantity * item.price);
    }, 0);
    return sum + orderTotal;
  }, 0);
}

/**
 * Calculate total cost from purchases within a date range
 */
export async function calculateTotalCost(startDate?: Date, endDate?: Date): Promise<number> {
  const query: any = {};
  
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }
  
  const purchases = await Purchase.find(query);
  return purchases.reduce((sum, purchase) => {
    // Cost is either the total price or calculated as (quantity * price)
    return sum + (purchase.totalPrice || (purchase.quantity * purchase.price));
  }, 0);
}

/**
 * Calculate total marketing expenses within a date range
 */
export async function calculateTotalExpenses(startDate?: Date, endDate?: Date): Promise<number> {
  const query: any = {};
  
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }
  
  const marketingExpenses = await MarketingExpense.find(query);
  return marketingExpenses.reduce((sum, expense) => {
    return sum + expense.adSpend;
  }, 0);
}

/**
 * Calculate net profit
 */
export function calculateNetProfit(totalRevenue: number, totalCost: number, totalExpenses: number): number {
  return totalRevenue - (totalCost + totalExpenses);
}

/**
 * Calculate gross profit
 */
export function calculateGrossProfit(totalRevenue: number, totalCost: number): number {
  return totalRevenue - totalCost;
}

/**
 * Calculate revenue by product category
 */
export async function calculateRevenueByCategory(startDate?: Date, endDate?: Date): Promise<{[category: string]: number}> {
  const query: any = { status: 'completed' }; // Only completed orders contribute to revenue
  
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }
  
  const orders = await Order.find(query).populate('items.productId');
  const revenueByCategory: {[category: string]: number} = {};
  
  for (const order of orders) {
    for (const item of order.items) {
      // Assuming the product has a category field
      const product = item.productId as any; // Type assertion since it's populated
      const category = product.category || 'Uncategorized';
      
      if (!revenueByCategory[category]) {
        revenueByCategory[category] = 0;
      }
      
      revenueByCategory[category] += item.quantity * item.price;
    }
  }
  
  return revenueByCategory;
}

/**
 * Calculate cost by product category
 */
export async function calculateCostByCategory(startDate?: Date, endDate?: Date): Promise<{[category: string]: number}> {
  const purchases = await Purchase.find({}).populate('productId');
  const costByCategory: {[category: string]: number} = {};
  
  for (const purchase of purchases) {
    const product = purchase.productId as any; // Type assertion since it's populated
    const category = product.category || 'Uncategorized';
    
    if (!costByCategory[category]) {
      costByCategory[category] = 0;
    }
    
    costByCategory[category] += purchase.totalPrice || (purchase.quantity * purchase.price);
  }
  
  return costByCategory;
}

/**
 * Calculate expenses by marketing platform
 */
export async function calculateExpensesByPlatform(startDate?: Date, endDate?: Date): Promise<{[platform: string]: number}> {
  const marketingExpenses = await MarketingExpense.find({});
  const expensesByPlatform: {[platform: string]: number} = {};
  
  for (const expense of marketingExpenses) {
    const platform = expense.platform;
    
    if (!expensesByPlatform[platform]) {
      expensesByPlatform[platform] = 0;
    }
    
    expensesByPlatform[platform] += expense.adSpend;
  }
  
  return expensesByPlatform;
}