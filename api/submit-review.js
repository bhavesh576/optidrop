// Input sanitization helper
function sanitize(str, maxLen = 500) {
    if (typeof str !== 'string') return '';
    return str.replace(/[<>]/g, '').trim().substring(0, maxLen);
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Rate limiting check (basic - rely on Vercel's built-in rate limiting)
    const contentLength = parseInt(req.headers['content-length'] || '0');
    if (contentLength > 10000) {
        return res.status(413).json({ error: 'Payload too large' });
    }

    const supabaseUrl = 'https://afmstriwxdryrqelffxc.supabase.co';
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmbXN0cml3eGRyeXJxZWxmZnhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyNjcwNTgsImV4cCI6MjA5ODg0MzA1OH0.t3sblfMlr_-eB7GAV2mBZFWD00y-k_ygTcAjneBJquo';

    try {
        let body;
        try {
            body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        } catch (e) {
            return res.status(400).json({ error: 'Invalid JSON' });
        }

        if (!body || typeof body !== 'object') {
            return res.status(400).json({ error: 'Invalid request body' });
        }

        // Sanitize and validate inputs
        const name = sanitize(body.name, 100) || 'Anonymous';
        const message = sanitize(body.message, 2000) || '';
        const tool = sanitize(body.tool, 100) || 'general';

        // Validate rating: must be integer 1-5
        let rating = null;
        if (body.rating !== undefined && body.rating !== null && body.rating !== '') {
            const numRating = Number(body.rating);
            if (!isNaN(numRating) && numRating >= 1 && numRating <= 5) {
                rating = Math.round(numRating);
            }
        }

        // Validate required fields
        if (!message || message.length < 2) {
            return res.status(400).json({ error: 'Message is required (min 2 characters)' });
        }

        const date = new Date().toISOString().split('T')[0];

        const insertData = { name, message, tool, rating, date };

        const response = await fetch(`${supabaseUrl}/rest/v1/review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`,
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(insertData)
        });

        if (!response.ok) {
            const errText = await response.text().catch(() => 'unknown');
            console.error('Supabase error:', response.status, errText);
            return res.status(400).json({ error: 'Failed to save review' });
        }

        const data = await response.json().catch(() => null);
        return res.status(200).json({ success: true, data });
    } catch (err) {
        console.error('Server Error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
