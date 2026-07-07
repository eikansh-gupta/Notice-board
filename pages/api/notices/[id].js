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
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const notice = await prisma.notice.findUnique({ where: { id } });
      if (!notice) {
        return res.status(404).json({ error: 'Notice not found' });
      }
      return res.status(200).json(notice);
    } catch (error) {
      console.error('GET /api/notices/[id] error:', error);
      return res.status(500).json({ error: 'Failed to fetch notice' });
    }
  }

  if (req.method === 'PUT') {
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
      const existing = await prisma.notice.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ error: 'Notice not found' });
      }

      const updated = await prisma.notice.update({
        where: { id },
        data: {
          title: title.trim(),
          body: body.trim(),
          category,
          priority,
          publishDate: new Date(publishDate),
          image: image ? image.trim() : null,
        },
      });
      return res.status(200).json(updated);
    } catch (error) {
      console.error('PUT /api/notices/[id] error:', error);
      return res.status(500).json({ error: 'Failed to update notice' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const existing = await prisma.notice.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ error: 'Notice not found' });
      }

      await prisma.notice.delete({ where: { id } });
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('DELETE /api/notices/[id] error:', error);
      return res.status(500).json({ error: 'Failed to delete notice' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}