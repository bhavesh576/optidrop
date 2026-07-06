export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const supabaseUrl = 'https://ujbldzjuzmvhgqkxyslz.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmbXN0cml3eGRyeXJxZWxmZnhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyNjcwNTgsImV4cCI6MjA5ODg0MzA1OH0.t3sblfMlr_-eB7GAV2mBZFWD00y-k_ygTcAjneBJquo';

    // Parse body — Vercel may or may not auto-parse JSON
    let body = req.body;
    if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) { body = {}; }
    }
    if (!body || typeof body !== 'object') {
        return res.status(400).json({ error: 'Invalid request body' });
    }

    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                name: body.name || 'Anonymous',
                message: body.message || '',
                tool: body.tool || '',
                date: body.date || new Date().toLocaleDateString()
            })
        });

        if (!response.ok) {
            const errText = await response.text().catch(() => 'unknown');
            console.error('Supabase error:', response.status, errText);
            return res.status(502).json({ error: 'Database error', detail: errText });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Function error:', error.message);
        return res.status(500).json({ error: 'Server error', detail: error.message });
    }
}
