const prisma = require('../config/database');

// @desc    Get dashboard overview
// @route   GET /api/dashboard/overview
// @access  Private
const getOverview = async (req, res, next) => {
  try {
    const truckId = req.user.truckId;
    
    if (!truckId) {
      return res.status(400).json({ error: 'No truck associated with this account' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's schedule
    const todaysSchedule = await prisma.schedule.findMany({
      where: {
        truckId,
        date: {
          gte: today,
          lt: tomorrow
        }
      },
      include: { location: true }
    });

    // Get inventory alerts (items below minimum quantity)
    const inventoryAlerts = await prisma.inventoryItem.findMany({
      where: {
        truckId,
        quantity: { lte: prisma.inventoryItem.fields.minQuantity }
      }
    });

    // Get permits expiring soon (within 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringPermits = await prisma.permit.findMany({
      where: {
        truckId,
        status: 'ACTIVE',
        expiryDate: {
          lte: thirtyDaysFromNow
        }
      }
    });

    // Get upcoming events
    const upcomingEvents = await prisma.event.findMany({
      where: {
        truckId,
        startDate: { gte: today },
        status: { not: 'CANCELLED' }
      },
      orderBy: { startDate: 'asc' },
      take: 5
    });

    // Get revenue stats for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyReports = await prisma.dailyReport.findMany({
      where: {
        truckId,
        date: { gte: sevenDaysAgo }
      },
      orderBy: { date: 'asc' }
    });

    const totalRevenue = dailyReports.reduce((sum, report) => sum + report.revenue, 0);
    const avgDailyRevenue = dailyReports.length > 0 ? totalRevenue / dailyReports.length : 0;

    res.json({
      success: true,
      data: {
        todaysSchedule,
        inventoryAlerts: inventoryAlerts.length,
        inventoryAlertItems: inventoryAlerts,
        expiringPermits: expiringPermits.length,
        expiringPermitItems: expiringPermits,
        upcomingEvents,
        revenueStats: {
          totalRevenue,
          avgDailyRevenue,
          daysTracked: dailyReports.length
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get analytics data
// @route   GET /api/dashboard/analytics
// @access  Private
const getAnalytics = async (req, res, next) => {
  try {
    const truckId = req.user.truckId;
    
    if (!truckId) {
      return res.status(400).json({ error: 'No truck associated with this account' });
    }

    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const reports = await prisma.dailyReport.findMany({
      where: {
        truckId,
        date: { gte: startDate }
      },
      orderBy: { date: 'asc' }
    });

    const topLocations = await prisma.location.findMany({
      where: { truckId, isActive: true },
      orderBy: { visitCount: 'desc' },
      take: 5
    });

    const inventoryValue = await prisma.inventoryItem.aggregate({
      where: { truckId },
      _sum: { costPerUnit: true },
      _count: true
    });

    res.json({
      success: true,
      data: {
        revenueData: reports.map(r => ({
          date: r.date,
          revenue: r.revenue,
          orders: r.orders,
          expenses: r.expenses
        })),
        topLocations,
        inventoryValue: inventoryValue._sum.costPerUnit || 0,
        inventoryCount: inventoryValue._count
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getOverview, getAnalytics };
