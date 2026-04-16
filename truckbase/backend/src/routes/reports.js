const express = require('express');
const { auth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get dashboard stats
router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await req.prisma.user.findUnique({
      where: { id: req.user.id },
      select: { truckId: true }
    });

    if (!user?.truckId) {
      return res.status(404).json({ error: 'No truck found.' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's schedule
    const todaySchedule = await req.prisma.schedule.findMany({
      where: {
        truckId: user.truckId,
        date: {
          gte: today,
          lt: tomorrow
        }
      },
      include: {
        location: { select: { name: true, address: true } }
      }
    });

    // Get expiring permits (next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringPermits = await req.prisma.permit.count({
      where: {
        truckId: user.truckId,
        expiryDate: {
          lte: thirtyDaysFromNow
        },
        status: 'ACTIVE'
      }
    });

    // Get low stock inventory
    const lowStockItems = await req.prisma.inventoryItem.findMany({
      where: {
        truckId: user.truckId,
        quantity: {
          lte: req.prisma.inventoryItem.fields.minQuantity
        }
      },
      select: { name: true, quantity: true, minQuantity: true }
    });

    // Get upcoming events
    const upcomingEvents = await req.prisma.event.findMany({
      where: {
        truckId: user.truckId,
        startDate: { gte: new Date() },
        status: 'SCHEDULED'
      },
      take: 5,
      orderBy: { startDate: 'asc' }
    });

    // Revenue stats (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyReports = await req.prisma.dailyReport.findMany({
      where: {
        truckId: user.truckId,
        date: { gte: sevenDaysAgo }
      },
      orderBy: { date: 'asc' }
    });

    const totalRevenue = weeklyReports.reduce((sum, r) => sum + r.revenue, 0);
    const avgDaily = weeklyReports.length > 0 ? totalRevenue / weeklyReports.length : 0;

    res.json({
      schedule: {
        today: todaySchedule
      },
      alerts: {
        expiringPermits,
        lowStockItems
      },
      events: {
        upcoming: upcomingEvents
      },
      revenue: {
        weekly: totalRevenue,
        dailyAverage: avgDaily,
        reports: weeklyReports
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard.' });
  }
});

// Create daily report
router.post('/daily', auth, [
  body('date').isISO8601(),
  body('revenue').isFloat({ min: 0 }),
  body('orders').isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await req.prisma.user.findUnique({
      where: { id: req.user.id },
      select: { truckId: true }
    });

    if (!user?.truckId) {
      return res.status(404).json({ error: 'No truck found.' });
    }

    const { date, revenue, orders, expenses, location, notes } = req.body;

    const report = await req.prisma.dailyReport.upsert({
      where: {
        truckId_date: {
          truckId: user.truckId,
          date: new Date(date)
        }
      },
      update: {
        revenue,
        orders,
        expenses: expenses || 0,
        location,
        notes
      },
      create: {
        truckId: user.truckId,
        date: new Date(date),
        revenue,
        orders,
        expenses: expenses || 0,
        location,
        notes
      }
    });

    res.json(report);
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ error: 'Failed to create report.' });
  }
});

module.exports = router;
