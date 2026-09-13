import { unsubscribeSubscriber } from '@/lib/email-lifecycle';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    let isSuccess = false;
    if (token) {
        const res = await unsubscribeSubscriber(token);
        isSuccess = res.success;
    }

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribed — LaunchXact</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #080c14;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .card {
      background-color: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 16px;
      padding: 40px 32px;
      max-width: 480px;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
    }
    .icon {
      font-size: 42px;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 22px;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 12px;
    }
    p {
      color: #94a3b8;
      font-size: 14.5px;
      line-height: 1.6;
      margin: 0 0 24px;
    }
    .btn {
      display: inline-block;
      background: #6366f1;
      color: #ffffff;
      text-decoration: none;
      padding: 10px 22px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">✅</div>
    <h1>${isSuccess ? 'You Have Been Unsubscribed' : 'Unsubscribe Confirmed'}</h1>
    <p>
      ${isSuccess
        ? 'You will no longer receive automated viability lifecycle emails from LaunchXact regarding your audited SaaS idea.'
        : 'Your email preference has been updated. You will not receive any further lifecycle communications.'}
    </p>
    <a href="https://launchxact.com" class="btn">Return to LaunchXact Home →</a>
  </div>
</body>
</html>`;

    return new Response(html, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
}
