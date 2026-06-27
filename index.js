document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    const registrationForm = document.getElementById('registration-form');

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');

            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    if (registrationForm) {
        registrationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            const submitBtn = registrationForm.querySelector('button');
            const originalText = submitBtn.textContent;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Processing...</span>';

            try {
                const response = await fetch('http://localhost:3000/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        role: 'Member', // Defaulting for this form
                        motivation: message
                    })
                });

                if (response.ok) {
                    submitBtn.textContent = 'Interest Registered! ✓';
                    submitBtn.style.backgroundColor = '#28a745';
                    submitBtn.style.boxShadow = '0 10px 20px rgba(40, 167, 69, 0.3)';
                    registrationForm.reset();
                } else {
                    const errorData = await response.json();
                    alert('Registration failed: ' + (errorData.error || 'Unknown error'));
                    submitBtn.textContent = originalText;
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('Failed to connect to the server. Please try again later.');
                submitBtn.textContent = originalText;
            } finally {
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.boxShadow = '';
                }, 4000);
            }
        });
    }

    const courseData = [
        {
            id: 'c1',
            title: 'Digital Risk Foundations',
            tags: ['Beginner', '4 Weeks', 'Online'],
            price: '£499',
            description: 'Learn the fundamentals of identifying and mitigating digital risks in modern organizations.',
            syllabus: '<h4>Week 1: Introduction</h4><ul><li>What is Digital Risk?</li><li>The Risk Landscape</li></ul><h4>Week 2: Threat Vectors</h4><ul><li>Identifying Vulnerabilities</li><li>Cyber Threats overview</li></ul><h4>Week 3: Frameworks</h4><ul><li>Risk Assessment Methodologies</li></ul><h4>Week 4: Practical Application</h4><ul><li>Case Studies</li><li>Final Assessment</li></ul>'
        },
        {
            id: 'c2',
            title: 'Advanced Cyber Governance',
            tags: ['Advanced', '8 Weeks', 'Hybrid'],
            price: '£1,299',
            description: 'Master the strategies needed to govern enterprise-level cyber security frameworks and compliance.',
            syllabus: '<h4>Module 1: Governance Frameworks</h4><ul><li>NIST & ISO Standards</li><li>Board-level Reporting</li></ul><h4>Module 2: Compliance</h4><ul><li>GDPR & Data Privacy</li><li>Regulatory Environments</li></ul><h4>Module 3: Incident Response</h4><ul><li>Building Resilient Strategies</li></ul>'
        },
        {
            id: 'c3',
            title: 'AI & Tech Risk Management',
            tags: ['Intermediate', '6 Weeks', 'Online'],
            price: '£899',
            description: 'Navigate the complex risks associated with implementing AI and emerging technologies safely.',
            syllabus: '<h4>Part 1: The AI Landscape</h4><ul><li>Understanding AI Systems</li><li>Bias and Ethics</li></ul><h4>Part 2: Tech Risk Assessment</h4><ul><li>Auditing Algorithms</li><li>Vendor Risk Management</li></ul><h4>Part 3: Future Proofing</h4><ul><li>Securing Emerging Tech</li></ul>'
        }
    ];

    const courseGrid = document.getElementById('course-grid');
    if (courseGrid) {
        courseData.forEach(course => {
            const card = document.createElement('div');
            card.className = 'card course-card reveal';
            
            const tagsHtml = course.tags.map(tag => `<span class="course-tag">${tag}</span>`).join('');
            
            card.innerHTML = `
                <div class="course-tags">${tagsHtml}</div>
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <div class="course-price">${course.price}</div>
                <div class="course-actions">
                    <button class="btn btn-secondary btn-block view-syllabus-btn" style="margin: 0; border-color: rgba(255,107,0,0.5);" data-id="${course.id}">View Syllabus</button>
                    <button class="btn btn-primary btn-block enroll-btn" data-id="${course.id}">Enroll Now</button>
                </div>
            `;
            courseGrid.appendChild(card);
        });
    }

    const syllabusModal = document.getElementById('syllabus-modal');
    const enrollmentModal = document.getElementById('enrollment-modal');
    
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

    if (courseGrid) {
        courseGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('view-syllabus-btn')) {
                const courseId = e.target.getAttribute('data-id');
                const course = courseData.find(c => c.id === courseId);
                if (course) {
                    document.getElementById('modal-syllabus-content').innerHTML = course.syllabus;
                    syllabusModal.classList.remove('hidden');
                }
            }
            
            if (e.target.classList.contains('enroll-btn')) {
                const courseId = e.target.getAttribute('data-id');
                const course = courseData.find(c => c.id === courseId);
                if (course) {
                    document.getElementById('modal-enroll-course-title').textContent = course.title;
                    document.getElementById('enroll-course-id').value = courseId;
                    enrollmentModal.classList.remove('hidden');
                }
            }
        });
    }

    const courseEnrollmentForm = document.getElementById('course-enrollment-form');
    if (courseEnrollmentForm) {
        courseEnrollmentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('enroll-name').value.trim();
            const email = document.getElementById('enroll-email').value.trim();

            if (!name || !email) {
                alert('Please fill in all required fields.');
                return;
            }

            const submitBtn = courseEnrollmentForm.querySelector('button');
            const originalText = submitBtn.textContent;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Processing...</span>';

            setTimeout(() => {
                submitBtn.textContent = 'Enrollment Successful! ✓';
                submitBtn.style.backgroundColor = '#28a745';
                submitBtn.style.boxShadow = '0 10px 20px rgba(40, 167, 69, 0.3)';
                courseEnrollmentForm.reset();

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.boxShadow = '';
                    enrollmentModal.classList.add('hidden');
                }, 2000);
            }, 1800);
        });
    }

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section, .card, .about-text, .about-image').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
});
