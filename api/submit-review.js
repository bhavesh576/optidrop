export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const supabaseUrl = 'https://afmstriwxdryrqelffxc.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmbXN0cml3eGRyeXJxZWxmZnhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyNjcwNTgsImV4cCI6MjA5ODg0MzA1OH0.t3sblfMlr_-eB7GAV2mBZFWD00y-k_ygTcAjneBJquo';

    try {
        let body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        console.log('STEP 1 - Received body:', JSON.stringify(body));
        console.log('STEP 1 - body.rating type:', typeof body.rating, 'value:', body.rating);

        const name = body.name || 'Anonymous';
        const message = body.message || '';
        const tool = body.tool || 'general';
        const email = body.email || null;
        // Validate rating: must be integer 1-5
        let rating = null;
        if (body.rating !== undefined && body.rating !== null && body.rating !== '') {
            rating = Math.max(1, Math.min(5, Math.round(Number(body.rating))));
        }
        const date = new Date().toISOString().split('T')[0];

        console.log('STEP 2 - Parsed rating:', rating, 'type:', typeof rating, 'raw body.rating:', body.rating);

        // Only include columns that exist in the review table
        const insertData = { name, message, tool, rating, date };
        console.log('STEP 3 - insertData:', JSON.stringify(insertData));

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

        console.log('STEP 4 - Supabase response status:', response.status);

        if (!response.ok) {
            const errText = await response.text().catch(() => 'unknown');
            console.error('STEP 4 ERROR - Supabase error:', response.status, errText);
            return res.status(400).json({ error: errText, status: response.status });
        }

        const data = await response.json().catch(() => null);
        console.log('STEP 5 - Insert response data:', JSON.stringify(data));

        // Verify: read back the row we just inserted
        if (data && data[0] && data[0].id) {
            const verifyResp = await fetch(`${supabaseUrl}/rest/v1/review?id=eq.${data[0].id}&select=id,name,rating,tool,date,created_at`, {
                headers: { 'apikey': supabaseAnonKey, 'Authorization': `Bearer ${supabaseAnonKey}` }
            });
            const verifyData = await verifyResp.json().catch(() => null);
            console.log('STEP 6 - VERIFY read-back:', JSON.stringify(verifyData));
        }

        return res.status(200).json({ success: true, data });
    } catch (err) {
        console.error('Server Error:', err);
        return res.status(500).json({ error: err.message });
    }
}
