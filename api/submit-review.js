export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const supabaseUrl = process.env.SUPABASE_URL || 'https://afmstriwxdryrqelffxc.supabase.co';
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmbXN0cml3eGRyeXJxZWxmZnhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyNjcwNTgsImV4cCI6MjA5ODg0MzA1OH0.t3sblfMlr_-eB7GAV2mBZFWD00y-k_ygTcAjneBJquo';

    try {
        let body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { name = 'Anonymous', message, tool = 'general', email, rating } = body;

        console.log('Inserting into review table:', { name, tool });

        const response = await fetch(`${supabaseUrl}/rest/v1/review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`,
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                name,
                message,
                tool,
                email: email || null,
                rating: rating ? Number(rating) : null
            })
        });

        if (!response.ok) {
            const errText = await response.text().catch(() => 'unknown');
            console.error('Supabase error:', response.status, errText);
            return res.status(400).json({ error: errText });
        }

        const data = await response.json().catch(() => null);
        return res.status(200).json({ success: true, data });
    } catch (err) {
        console.error('Server error:', err);
        return res.status(500).json({ error: err.message });
    }
}
