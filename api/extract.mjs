/* ===========================================================================
   CBE BUILDER — BACKEND (Serverless Function untuk Vercel)
   ---------------------------------------------------------------------------
   Tugas file ini:
   - Menerima 1 PDF + 1 prompt dari aplikasi (frontend / index.html).
   - Memanggil Anthropic API memakai API key yang DISIMPAN DI SISI SERVER.
   - Mengembalikan teks hasil ekstraksi ke aplikasi.

   API key TIDAK ditulis di dalam file ini. API key diambil dari "Environment
   Variable" bernama ANTHROPIC_API_KEY yang Anda atur di dashboard Vercel.
   Dengan begitu API key tidak pernah ikut terkirim ke browser pengguna.

   File ini TIDAK memerlukan instalasi paket apa pun (memakai 'fetch' bawaan
   Node.js 18+ yang sudah tersedia otomatis di Vercel).
   =========================================================================== */

// Batas waktu eksekusi fungsi (detik). 60 = batas aman paket gratis Vercel.
export const config = { maxDuration: 60 };

export default async function handler(req, res) {

  // Hanya menerima metode POST.
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Metode tidak diizinkan. Gunakan POST.' });
    return;
  }

  // Ambil API key dari Environment Variable Vercel.
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: 'Server belum dikonfigurasi: Environment Variable ' +
             'ANTHROPIC_API_KEY belum diatur di Vercel. ' +
             'Lihat LANGKAH 4 pada PANDUAN-DEPLOY.md.'
    });
    return;
  }

  // Ambil isi permintaan (Vercel otomatis mem-parse JSON; sediakan cadangan).
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = null; }
  }
  if (!body || !body.pdfData || !body.prompt) {
    res.status(400).json({
      error: 'Permintaan tidak lengkap (pdfData atau prompt tidak ada).'
    });
    return;
  }

  try {
    // Panggil Anthropic API.
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        // Model AI. Untuk biaya lebih murah, baris ini boleh diganti menjadi
        // 'claude-haiku-4-5-20251001' (lebih hemat, sedikit kurang teliti).
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: body.pdfData
              }
            },
            { type: 'text', text: body.prompt }
          ]
        }]
      })
    });

    // Bila Anthropic menolak (mis. API key salah / saldo habis).
    if (!anthropicRes.ok) {
      let detail = '';
      try { detail = await anthropicRes.text(); } catch (e) {}
      res.status(anthropicRes.status).json({
        error: 'Anthropic API menolak permintaan (kode ' + anthropicRes.status +
               '). Periksa kembali API key dan saldo akun Anthropic Anda.',
        detail: detail.slice(0, 600)
      });
      return;
    }

    // Berhasil — ambil teks jawaban dan kirim ke aplikasi.
    const data = await anthropicRes.json();
    const text = (data.content || [])
      .filter(function (b) { return b.type === 'text'; })
      .map(function (b) { return b.text; })
      .join('\n');

    res.status(200).json({ text: text });

  } catch (err) {
    res.status(500).json({
      error: 'Kesalahan server saat memanggil AI: ' +
             (err && err.message ? err.message : String(err))
    });
  }
}
