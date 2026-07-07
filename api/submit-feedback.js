// Input sanitization helper
function sanitize(str, maxLen = 2000) {
    if (typeof str !== 'string') return '';
    return str.replace(/[<>]/g, '').trim().substring(0, maxLen);
}

function sanitizeEmail(email) {
    if (typeof email !== 'string') return null;
    const cleaned = email.trim().toLowerCase();
    // Basic email validation
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)) {
        return cleaned.substring(0, 254);
    }
    return null;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // Rate limiting check (basic)
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
        const email = sanitizeEmail(body.email);
        const message = sanitize(body.message || body.feedback, 5000) || '';

        // Validate required fields
        if (!message || message.length < 2) {
            return res.status(400).json({ error: 'Message is required (min 2 characters)' });
        }

        const insertData = {
            name,
            email,
            message,
            rating: body.rating ? Math.max(1, Math.min(5, Math.round(Number(body.rating)))) : null
        };

        const response = await fetch(`${supabaseUrl}/rest/v1/feedback`, {
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
            console.error('Supabase feedback error:', response.status, errText);
            return res.status(400).json({ error: 'Failed to save feedback' });
        }

        const data = await response.json().catch(() => null);
        return res.status(200).json({ success: true, data });
    } catch (err) {
        console.error('Server Error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
