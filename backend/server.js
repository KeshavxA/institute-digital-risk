const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Setup
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Create table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS registrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            role TEXT,
            motivation TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// Nodemailer Setup (Using Ethereal for testing)
let transporter;
nodemailer.createTestAccount((err, account) => {
    if (err) {
        console.error('Failed to create a testing account. ' + err.message);
        return;
    }
    
    // Create a SMTP transporter object
    transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
            user: account.user,
            pass: account.pass
        }
    });
    console.log('Test email account generated. Ready to send emails.');
});

// Routes
app.post('/api/register', (req, res) => {
    const { name, email, role, motivation } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required.' });
    }

    // Insert into DB
    const stmt = db.prepare(`INSERT INTO registrations (name, email, role, motivation) VALUES (?, ?, ?, ?)`);
    stmt.run([name, email, role, motivation], function(err) {
        if (err) {
            console.error('Error inserting into database:', err);
            return res.status(500).json({ error: 'Database error.' });
        }

        console.log(`Registration saved with ID: ${this.lastID}`);

        // Send Email
        if (transporter) {
            const mailOptions = {
                from: '"Institute of Digital Risk" <no-reply@institutemock.com>',
                to: email,
                subject: 'Welcome to the Institute of Digital Risk!',
                text: `Hi ${name},\n\nThank you for registering your interest. We have received your application for the role of ${role || 'Member'}.\n\nBest,\nIDR Team`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0B0B0B; color: #FFFFFF; padding: 20px; border-radius: 8px;">
                        <h2 style="color: #FF6B00;">Welcome to IDR!</h2>
                        <p>Hi ${name},</p>
                        <p>Thank you for registering your interest with the Institute of Digital Risk.</p>
                        <p>We have successfully received your application for the role of <strong>${role || 'Member'}</strong>.</p>
                        <p>Our team will review your motivation: <em>"${motivation || 'N/A'}"</em> and get back to you shortly.</p>
                        <br/>
                        <p style="color: #A0A0A0; font-size: 12px;">This is an automated message. Please do not reply.</p>
                    </div>
                `
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    // Still return success to the user since DB insertion worked
                } else {
                    console.log('Message sent: %s', info.messageId);
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                }
            });
        }

        res.status(201).json({ message: 'Registration successful!' });
    });
    stmt.finalize();
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
