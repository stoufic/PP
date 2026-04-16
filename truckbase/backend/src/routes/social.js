const express = require('express');
const { auth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Social post templates for food trucks
const TEMPLATES = {
  location: {
    instagram: "🚨 We're here! 🚨\n\n📍 [LOCATION]\n⏰ Until [TIME]\n\nCome grab some delicious [CUISINE]! Tag us in your photos 📸\n\n#FoodTruck #StreetFood #[CITY]Eats",
    facebook: "🚛 We're at [LOCATION] right now!\n\nStop by for amazing [CUISINE] until [TIME]. See you there!\n\n📍 [ADDRESS]",
    twitter: "🚨 Live now! 🚨\n\n📍 [LOCATION]\n⏰ Until [TIME]\n\n#FoodTruck #[CITY]"
  },
  event: {
    instagram: "🎉 See you at [EVENT NAME]! 🎉\n\n📅 [DATE]\n📍 [LOCATION]\n⏰ [TIME]\n\nCan't wait to serve you! 🙌\n\n#[EVENT] #FoodTruckLife",
    facebook: "Excited to be at [EVENT NAME]!\n\n📅 [DATE]\n📍 [LOCATION]\n⏰ [TIME]\n\nCome say hi and grab some food!",
    twitter: "Heading to [EVENT NAME]! 🚛\n\n📅 [DATE]\n📍 [LOCATION]\n\nSee you there!"
  },
  daily: {
    instagram: "Good morning! ☀️\n\nWe're open and ready to serve! Come get your [SIGNATURE_DISH] fix 😋\n\n📍 [LOCATION]\n⏰ [HOURS]\n\n#FoodTruckLife #Breakfast",
    facebook: "We're open! ☀️\n\nCome grab breakfast/lunch/dinner at [LOCATION]. Our [SIGNATURE_DISH] is calling your name!\n\n⏰ Open until [TIME]",
    twitter: "We're OPEN! 🚛\n\n📍 [LOCATION]\n⏰ Until [TIME]\n\nCome hungry!"
  }
};

// Get all posts
router.get('/posts', auth, async (req, res) => {
  try {
    const user = await req.prisma.user.findUnique({
      where: { id: req.user.id },
      select: { truckId: true }
    });

    if (!user?.truckId) {
      return res.status(404).json({ error: 'No truck found.' });
    }

    const posts = await req.prisma.socialPost.findMany({
      where: { truckId: user.truckId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Failed to get posts.' });
  }
});

// Generate post from template
router.post('/generate', auth, async (req, res) => {
  try {
    const { templateType, platform, variables } = req.body;
    
    const template = TEMPLATES[templateType]?.[platform];
    if (!template) {
      return res.status(400).json({ error: 'Template not found.' });
    }

    // Replace variables
    let content = template;
    Object.keys(variables).forEach(key => {
      content = content.replace(new RegExp(`\\[${key}\\]`, 'g'), variables[key]);
    });

    res.json({ content });
  } catch (error) {
    console.error('Generate post error:', error);
    res.status(500).json({ error: 'Failed to generate post.' });
  }
});

// Create post
router.post('/posts', auth, [
  body('platform').notEmpty(),
  body('content').trim().notEmpty()
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

    const { platform, content, imageUrl, scheduledFor } = req.body;

    const post = await req.prisma.socialPost.create({
      data: {
        truckId: user.truckId,
        platform,
        content,
        imageUrl,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        status: scheduledFor ? 'SCHEDULED' : 'DRAFT'
      }
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post.' });
  }
});

// Mark post as posted
router.patch('/posts/:id/posted', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await req.prisma.user.findUnique({
      where: { id: req.user.id },
      select: { truckId: true }
    });

    if (!user?.truckId) {
      return res.status(404).json({ error: 'No truck found.' });
    }

    const post = await req.prisma.socialPost.findFirst({
      where: { id, truckId: user.truckId }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    const updated = await req.prisma.socialPost.update({
      where: { id },
      data: {
        status: 'POSTED',
        postedAt: new Date()
      }
    });

    res.json(updated);
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Failed to update post.' });
  }
});

module.exports = router;
