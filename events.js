document.addEventListener('DOMContentLoaded', () => {

    const eventsData = [
        {
            id: 'e1',
            title: 'Navigating AI Compliance in Finance',
            type: 'Webinar',
            dateStr: 'Jul 10',
            month: 'Jul',
            day: '10',
            time: '14:00 - 15:30 GMT',
            location: 'Online via Zoom',
            description: 'Join industry experts as they discuss the upcoming regulatory changes surrounding AI implementation in the financial sector.',
            // Using precise dates for calendar links (Assuming 2026 for this context)
            startISO: '2026-07-10T14:00:00Z',
            endISO: '2026-07-10T15:30:00Z'
        },
        {
            id: 'e2',
            title: 'Cyber Governance Masterclass',
            type: 'Workshop',
            dateStr: 'Jul 22',
            month: 'Jul',
            day: '22',
            time: '09:00 - 17:00 GMT',
            location: 'IDR London Campus',
            description: 'A full-day intensive workshop designed for board members and senior executives to understand their personal liabilities in cyber governance.',
            startISO: '2026-07-22T09:00:00Z',
            endISO: '2026-07-22T17:00:00Z'
        },
        {
            id: 'e3',
            title: 'Q3 Incubation Pitch Day',
            type: 'Pitch',
            dateStr: 'Aug 05',
            month: 'Aug',
            day: '05',
            time: '10:00 - 13:00 GMT',
            location: 'Hybrid (London & Online)',
            description: 'Watch the latest cohort of risk-tech startups pitch their innovative solutions to our panel of industry investors.',
            startISO: '2026-08-05T10:00:00Z',
            endISO: '2026-08-05T13:00:00Z'
        }
    ];

    // Calendar Link Generators
    const generateGoogleCalUrl = (event) => {
        const start = event.startISO.replace(/[-:]/g, '').replace(/\.\d{3}/, '');
        const end = event.endISO.replace(/[-:]/g, '').replace(/\.\d{3}/, '');
        const title = encodeURIComponent(event.title);
        const details = encodeURIComponent(event.description);
        const location = encodeURIComponent(event.location);
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
    };

    const generateOutlookCalUrl = (event) => {
        const start = encodeURIComponent(event.startISO);
        const end = encodeURIComponent(event.endISO);
        const title = encodeURIComponent(event.title);
        const details = encodeURIComponent(event.description);
        const location = encodeURIComponent(event.location);
        return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${title}&startdt=${start}&enddt=${end}&body=${details}&location=${location}`;
    };

    const eventsGrid = document.getElementById('events-grid');
    if (eventsGrid) {
        eventsData.forEach(event => {
            const card = document.createElement('div');
            card.className = 'event-card reveal active visible';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            
            card.innerHTML = `
                <div class="event-date-badge">
                    <span class="event-date-month">${event.month}</span>
                    <span class="event-date-day">${event.day}</span>
                </div>
                <div class="event-details">
                    <span class="event-type">${event.type}</span>
                    <h3>${event.title}</h3>
                    <div class="event-meta">
                        <span>🕒 ${event.time}</span>
                        <span>📍 ${event.location}</span>
                    </div>
                    <p>${event.description}</p>
                    <div class="event-actions">
                        <button class="btn btn-primary rsvp-btn" data-id="${event.id}" style="padding: 0.8rem 1.5rem;">RSVP Now</button>
                        
                        <div class="calendar-dropdown">
                            <button class="btn btn-secondary" style="padding: 0.8rem 1.5rem; margin-left: 0;">Add to Calendar 📅</button>
                            <div class="calendar-dropdown-content">
                                <a href="${generateGoogleCalUrl(event)}" target="_blank" rel="noopener noreferrer">Google Calendar</a>
                                <a href="${generateOutlookCalUrl(event)}" target="_blank" rel="noopener noreferrer">Outlook / Office 365</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            eventsGrid.appendChild(card);
        });
    }

    // RSVP Modal Logic
    const rsvpModal = document.getElementById('rsvp-modal');
    
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal-overlay').classList.add('hidden');
        });
    });

    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });

    if (eventsGrid) {
        eventsGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('rsvp-btn')) {
                const eventId = e.target.getAttribute('data-id');
                const event = eventsData.find(ev => ev.id === eventId);
                if (event) {
                    document.getElementById('modal-rsvp-event-title').textContent = event.title;
                    document.getElementById('rsvp-event-id').value = eventId;
                    rsvpModal.classList.remove('hidden');
                }
            }
        });
    }

    const eventRsvpForm = document.getElementById('event-rsvp-form');
    if (eventRsvpForm) {
        eventRsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('rsvp-name').value.trim();
            const email = document.getElementById('rsvp-email').value.trim();

            if (!name || !email) {
                alert('Please fill in all required fields.');
                return;
            }

            const submitBtn = eventRsvpForm.querySelector('button');
            const originalText = submitBtn.textContent;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Processing...</span>';

            setTimeout(() => {
                submitBtn.textContent = 'RSVP Confirmed! ✓';
                submitBtn.style.backgroundColor = '#28a745';
                submitBtn.style.boxShadow = '0 10px 20px rgba(40, 167, 69, 0.3)';
                eventRsvpForm.reset();

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.boxShadow = '';
                    rsvpModal.classList.add('hidden');
                }, 2000);
            }, 1500);
        });
    }
});
