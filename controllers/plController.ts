import { connectDB } from '@/lib/db';
import ProfitLoss, { IProfitLoss } from '@/models/ProfitLoss';
import { 
  calculateTotalRevenue, 
  calculateTotalCost, 
  calculateTotalExpenses, 
  calculateNetProfit,
  calculateGrossProfit,
  calculateRevenueByCategory,
  calculateCostByCategory,
  calculateExpensesByPlatform
} from '@/helpers/plUtils';
import { success, error } from '@/helpers/responseHandler';
import { MESSAGES } from '@/constants/messages';
import mongoose from 'mongoose';

/**
 * Generate a new Profit & Loss report
 */
export async function generateProfitLoss(
  period: string, 
  startDate?: Date, 
  endDate?: Date
): Promise<{ success: boolean; message: string; data?: any; error?: string }> {
  try {
    await connectDB();

    // Calculate financial metrics
    const totalRevenue = await calculateTotalRevenue(startDate, endDate);
    const totalCost = await calculateTotalCost(startDate, endDate);
    const totalExpenses = await calculateTotalExpenses(startDate, endDate);
    
    const grossProfit = calculateGrossProfit(totalRevenue, totalCost);
    const netProfit = calculateNetProfit(totalRevenue, totalCost, totalExpenses);
    
    // Calculate category-wise breakdowns
    const revenueByCategory = await calculateRevenueByCategory(startDate, endDate);
    const costByCategory = await calculateCostByCategory(startDate, endDate);
    const expensesByPlatform = await calculateExpensesByPlatform(startDate, endDate);

    // Create the P&L record
    const plData: Omit<IProfitLoss, '_id' | 'createdAt' | 'updatedAt'> = {
      period,
      totalRevenue,
      totalCost,
      totalExpenses,
      netProfit,
      grossProfit,
      revenueByCategory,
      costByCategory,
      expensesByPlatform
    };

    const newPL = new ProfitLoss(plData);
    const savedPL = await newPL.save();

    return {
      success: true,
      message: MESSAGES.PL_GENERATED,
      data: savedPL
    };
  } catch (err: any) {
    console.error('Error generating P&L:', err);
    return {
      success: false,
      message: MESSAGES.INTERNAL_ERROR,
      error: err.message
    };
  }
}

/**
 * Get the latest Profit & Loss report
 */
export async function getProfitLoss(
  period?: string, 
  startDate?: Date, 
  endDate?: Date
): Promise<{ success: boolean; message: string; data?: any; error?: string }> {
  try {
    await connectDB();

    const query: any = {};
    
    if (period) {
      query.period = period;
    }
    
    // If specific dates are provided, return aggregated data for that period
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    let plRecord: IProfitLoss | null;
    
    if (Object.keys(query).length > 0) {
      // Find a specific P&L record
      plRecord = await ProfitLoss.findOne(query).sort({ createdAt: -1 });
    } else {
      // Get the most recent P&L record
      plRecord = await ProfitLoss.findOne().sort({ createdAt: -1 });
    }

    if (!plRecord) {
      // If no record exists for the given criteria, generate a new one
      const periodType = period || 'monthly';
      return await generateProfitLoss(periodType, startDate, endDate);
    }

    return {
      success: true,
      message: MESSAGES.PL_FETCHED,
      data: plRecord
    };
  } catch (err: any) {
    console.error('Error fetching P&L:', err);
    return {
      success: false,
      message: MESSAGES.INTERNAL_ERROR,
      error: err.message
    };
  }
}

/**
 * Get category-wise Profit & Loss breakdown
 */
export async function getCategoryWisePL(
  period?: string, 
  startDate?: Date, 
  endDate?: Date
): Promise<{ success: boolean; message: string; data?: any; error?: string }> {
  try {
    await connectDB();

    const query: any = {};
    
    if (period) {
      query.period = period;
    }
    
    // If specific dates are provided, use them
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    let plRecord: IProfitLoss | null;
    
    if (Object.keys(query).length > 0) {
      plRecord = await ProfitLoss.findOne(query).sort({ createdAt: -1 });
    } else {
      plRecord = await ProfitLoss.findOne().sort({ createdAt: -1 });
    }

    if (!plRecord) {
      // If no record exists for the given criteria, generate a new one
      const periodType = period || 'monthly';
      const generatedResult = await generateProfitLoss(periodType, startDate, endDate);
      
      if (!generatedResult.success) {
        return generatedResult;
      }
      
      plRecord = generatedResult.data;
    }

    // Convert Mongoose maps to plain objects and calculate profit per category
    const categoryWiseData: any = {};
    
    // Revenue by category (convert Mongoose Map to plain object)
    if (plRecord.revenueByCategory) {
      const revenueObj = JSON.parse(JSON.stringify(plRecord.revenueByCategory));
      for (const [category, revenue] of Object.entries(revenueObj)) {
        if (!categoryWiseData[category]) {
          categoryWiseData[category] = { revenue: 0, cost: 0, expenses: 0, profit: 0 };
        }
        categoryWiseData[category].revenue = Number(revenue);
      }
    }
    
    // Cost by category (convert Mongoose Map to plain object)
    if (plRecord.costByCategory) {
      const costObj = JSON.parse(JSON.stringify(plRecord.costByCategory));
      for (const [category, cost] of Object.entries(costObj)) {
        if (!categoryWiseData[category]) {
          categoryWiseData[category] = { revenue: 0, cost: 0, expenses: 0, profit: 0 };
        }
        categoryWiseData[category].cost = Number(cost);
      }
    }
    
    // Expenses by category (convert Mongoose Map to plain object)
    if (plRecord.expensesByCategory) {
      const expensesObj = JSON.parse(JSON.stringify(plRecord.expensesByCategory));
      for (const [platform, expenses] of Object.entries(expensesObj)) {
        if (!categoryWiseData[platform]) {
          categoryWiseData[platform] = { revenue: 0, cost: 0, expenses: 0, profit: 0 };
        }
        categoryWiseData[platform].expenses = Number(expenses);
      }
    }
    
    // Calculate profit per category
    for (const [category, data] of Object.entries(categoryWiseData)) {
      const catData = data as { revenue: number; cost: number; expenses: number; profit: number };
      catData.profit = catData.revenue - catData.cost - catData.expenses;
    }

    return {
      success: true,
      message: MESSAGES.PL_CATEGORY_FETCHED,
      data: categoryWiseData
    };
  } catch (err: any) {
    console.error('Error fetching category-wise P&L:', err);
    return {
      success: false,
      message: MESSAGES.INTERNAL_ERROR,
      error: err.message
    };
  }
}