document.addEventListener('DOMContentLoaded', () => {
    const btnNext = document.getElementById('btn-next');
    const btnPrev = document.getElementById('btn-prev');
    const btnSubmit = document.getElementById('btn-submit');
    const stepActions = document.getElementById('step-actions');
    const progressContainer = document.getElementById('progress-container');
    const progressFill = document.getElementById('progress-fill');
    const currentStepNum = document.getElementById('current-step-num');
    
    // There are 4 actual question steps (step-1 to step-4)
    const totalQuestions = 4;
    let currentStep = 0; // 0 is Intro, 1-4 are questions, 5 is results

    const showStep = (stepIndex) => {
        // Hide all steps
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
        });

        if (stepIndex === 0) {
            document.getElementById('step-intro').classList.add('active');
            stepActions.style.display = 'none';
            progressContainer.style.display = 'none';
        } else if (stepIndex > 0 && stepIndex <= totalQuestions) {
            document.getElementById(`step-${stepIndex}`).classList.add('active');
            stepActions.style.display = 'flex';
            progressContainer.style.display = 'block';
            
            // Update progress
            const progress = ((stepIndex - 1) / totalQuestions) * 100;
            progressFill.style.width = `${progress}%`;
            currentStepNum.textContent = stepIndex;

            // Handle Buttons
            if (stepIndex === 1) {
                btnPrev.style.visibility = 'hidden';
            } else {
                btnPrev.style.visibility = 'visible';
            }

            if (stepIndex === totalQuestions) {
                btnNext.style.display = 'none';
                btnSubmit.style.display = 'block';
            } else {
                btnNext.style.display = 'block';
                btnSubmit.style.display = 'none';
            }
        } else if (stepIndex > totalQuestions) {
            calculateResults();
        }
    };

    const validateStep = () => {
        if (currentStep > 0 && currentStep <= totalQuestions) {
            const selected = document.querySelector(`input[name="q${currentStep}"]:checked`);
            if (!selected) {
                alert('Please select an option to continue.');
                return false;
            }
        }
        return true;
    };

    // Intro Start Button
    document.querySelector('#step-intro .btn-next').addEventListener('click', () => {
        currentStep = 1;
        showStep(currentStep);
    });

    btnNext.addEventListener('click', () => {
        if (validateStep()) {
            currentStep++;
            showStep(currentStep);
        }
    });

    btnPrev.addEventListener('click', () => {
        currentStep--;
        showStep(currentStep);
    });

    btnSubmit.addEventListener('click', () => {
        if (validateStep()) {
            currentStep++;
            showStep(currentStep);
        }
    });

    const calculateResults = () => {
        // Hide actions and progress
        stepActions.style.display = 'none';
        progressContainer.style.display = 'none';
        
        document.getElementById('step-results').classList.add('active');
        
        // Calculate score
        let totalScore = 0;
        for (let i = 1; i <= totalQuestions; i++) {
            const val = parseInt(document.querySelector(`input[name="q${i}"]:checked`).value);
            totalScore += val;
        }

        // Max possible score is 40
        const scoreCircle = document.getElementById('score-circle');
        const scoreText = document.getElementById('score-text');
        const riskTier = document.getElementById('risk-tier');
        const riskDesc = document.getElementById('risk-description');

        // Animate Score Counter
        let currentCount = 0;
        const duration = 1500;
        const interval = 30;
        const stepValue = totalScore / (duration / interval);

        const counter = setInterval(() => {
            currentCount += stepValue;
            if (currentCount >= totalScore) {
                clearInterval(counter);
                currentCount = totalScore;
                
                // Set styling based on score
                if (totalScore >= 30) {
                    scoreCircle.classList.add('score-low');
                    riskTier.textContent = 'Low Risk (Resilient)';
                    riskTier.style.color = '#28a745';
                    riskDesc.textContent = 'Your organization demonstrates strong digital resilience and proactive governance. To maintain this posture against emerging threats, consider a mature review of your vendor risks.';
                } else if (totalScore >= 15) {
                    scoreCircle.classList.add('score-medium');
                    riskTier.textContent = 'Moderate Risk (Developing)';
                    riskTier.style.color = '#ffc107';
                    riskDesc.textContent = 'You have foundational security measures in place, but lack continuous monitoring or dedicated leadership in certain areas. This leaves potential blind spots in your defense.';
                } else {
                    scoreCircle.classList.add('score-high');
                    riskTier.textContent = 'High Risk (Vulnerable)';
                    riskTier.style.color = '#dc3545';
                    riskDesc.textContent = 'Your digital infrastructure shows significant vulnerabilities. A lack of dedicated governance and proactive testing makes your organization highly susceptible to cyber incidents.';
                }
            }
            scoreText.textContent = Math.round(currentCount);
        }, interval);
    };
});
