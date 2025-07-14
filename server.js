const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Example in-memory database (replace with real DB)
let pendingUsers = [];

app.post('/register', async (req, res) => {
  const { name, phone, email, password } = req.body;

  // Here you would process payment (integration needed)
  // For demo, assume payment is done.

  // Save user as pending approval
  pendingUsers.push({ name, phone, email, password, approved: false });

  // Send email to admin for approval
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'admin@gmail.com', // admin Gmail
      pass: 'your-app-password' // Use Gmail App Password
    }
  });

  const mailOptions = {
    from: 'admin@gmail.com',
    to: 'admin@gmail.com',
    subject: 'New Customer Registration Pending Approval',
    text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nApprove at: http://yourdomain.com/admin`
  };

  await transporter.sendMail(mailOptions);

  res.send('Registration complete! Waiting for admin approval.');
});

// Admin approval endpoint (for demonstration)
app.get('/admin', (req, res) => {
  let html = '<h2>Pending Approvals</h2>';
  pendingUsers.forEach((user, idx) => {
    if (!user.approved) {
      html += `<div>
        <p>${user.name} - ${user.phone} - ${user.email}</p>
        <form action="/approve" method="POST">
          <input type="hidden" name="idx" value="${idx}">
          <button type="submit">Approve</button>
        </form>
      </div>`;
    }
  });
  res.send(html);
});

app.post('/approve', bodyParser.urlencoded({ extended: true }), (req, res) => {
  const idx = req.body.idx;
  pendingUsers[idx].approved = true;
  // Send email to user notifying approval (optional)
  res.send('User approved!');
});

app.listen(3000, () => console.log('Server running on port 3000'));