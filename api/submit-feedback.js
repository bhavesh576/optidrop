export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const supabaseUrl = 'https://afmstriwxdryrqelffxc.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmbXN0cml3eGRyeXJxZWxmZnhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyNjcwNTgsImV4cCI6MjA5ODg0MzA1OH0.t3sblfMlr_-eB7GAV2mBZFWD00y-k_ygTcAjneBJquo';

    try {
        let body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        console.log('Received feedback body:', JSON.stringify(body));

        const insertData = {
            name: body.name || 'Anonymous',
            email: body.email || null,
            message: body.message || body.feedback || '',
            rating: body.rating ? Number(body.rating) : null
        };
        console.log('Final insertData:', JSON.stringify(insertData));

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
            return res.status(400).json({ error: errText, status: response.status });
        }

        const data = await response.json().catch(() => null);
        console.log('Feedback insert success:', JSON.stringify(data));
        return res.status(200).json({ success: true, data });
    } catch (err) {
        console.error('Server Error:', err);
        return res.status(500).json({ error: err.message });
    }
}
