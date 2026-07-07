import prisma from '../../../lib/prisma';

const VALID_CATEGORIES = ['Exam', 'Event', 'General'];
const VALID_PRIORITIES = ['Normal', 'Urgent'];

function validateNoticeInput(data) {
  const errors = {};

  if (!data.title || !data.title.trim()) {
    errors.title = 'Title is required';
  }

  if (!data.body || !data.body.trim()) {
    errors.body = 'Body is required';
  }

  if (!data.category || !VALID_CATEGORIES.includes(data.category)) {
    errors.category = `Category must be one of: ${VALID_CATEGORIES.join(', ')}`;
  }

  if (!data.priority || !VALID_PRIORITIES.includes(data.priority)) {
    errors.priority = `Priority must be one of: ${VALID_PRIORITIES.join(', ')}`;
  }

  if (!data.publishDate || isNaN(new Date(data.publishDate).getTime())) {
    errors.publishDate = 'A valid publish date is required';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const notices = await prisma.notice.findMany({
        orderBy: [
          { priority: 'desc' },     // "Urgent" > "Normal" alphabetically -> Urgent first
          { publishDate: 'desc' },  // newest first within same priority
        ],
      });
      return res.status(200).json(notices);
    } catch (error) {
      console.error('GET /api/notices error:', error);
      return res.status(500).json({ error: 'Failed to fetch notices' });
    }
  }

  if (req.method === 'POST') {
    const { title, body, category, priority, publishDate, image } = req.body;

    const { valid, errors } = validateNoticeInput({
      title,
      body,
      category,
      priority,
      publishDate,
    });

    if (!valid) {
      return res.status(400).json({ error: 'Validation failed', fields: errors });
    }

    try {
      const notice = await prisma.notice.create({
        data: {
          title: title.trim(),
          body: body.trim(),
          category,
          priority,
          publishDate: new Date(publishDate),
          image: image ? image.trim() : null,
        },
      });
      return res.status(201).json(notice);
    } catch (error) {
      console.error('POST /api/notices error:', error);
      return res.status(500).json({ error: 'Failed to create notice' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}