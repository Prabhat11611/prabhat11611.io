//-----------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------Navigation----------------------------------------------------------------//
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = navLinks.classList.contains('active') ? 'rotate(45deg) translate(8px, 8px)' : '';
    spans[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
    spans[2].style.transform = navLinks.classList.contains('active') ? 'rotate(-45deg) translate(7px, -7px)' : '';
});
//-----------------------------------------------------------------------------------------------------------------------------//
//-------------------------------------Smooth scrolling for navigation links---------------------------------------------------//
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
});

// Intersection Observer for scroll animations
const animateElements = document.querySelectorAll('.animate-text');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeUp 1s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

animateElements.forEach(element => {
    observer.observe(element);
});
//-----------------------------------------------------------------------------------------------------------------------------//
//--------------------------------------Intersection Observer for animations---------------------------------------------------//
const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // When the element is in view, add the 'visible' class to trigger the animation
            if (entry.target.classList.contains('stagger-container')) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.add('fade-up');
            }
        } else {
            // When the element is out of view, remove the 'visible' class to reset the animation
            if (entry.target.classList.contains('stagger-container')) {
                entry.target.classList.remove('visible');
            }
        }
    });
}, { threshold: 0.1, rootMargin: '0px' });

// Prepare text animations
function prepareTextAnimations() {
    const textContainers = document.querySelectorAll('.about-text p:not(.processed), .role-desc p:not(.processed)');

    textContainers.forEach(container => {
        const text = container.innerHTML;
        const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
        
        const wrapper = document.createElement('div');
        wrapper.classList.add('stagger-container');
        
        sentences.forEach(sentence => {
            const sentenceSpan = document.createElement('span');
            sentenceSpan.classList.add('animate-line');
            sentenceSpan.innerHTML = sentence + ' ';
            wrapper.appendChild(sentenceSpan);
        });

        container.innerHTML = '';
        container.appendChild(wrapper);
        container.classList.add('processed');
        
        // Observe the wrapper for visibility changes
        animationObserver.observe(wrapper);
    });
}

// Add required CSS
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .stagger-container {
        overflow: hidden;
    }

    .stagger-container .animate-line {
        opacity: 0;
        transform: translateY(20px);
        display: inline;
    }

    .stagger-container.visible .animate-line {
        opacity: 1;
        transform: translateY(0);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }

    .stagger-container.visible .animate-line:nth-child(1) { transition-delay: 0.1s; }
    .stagger-container.visible .animate-line:nth-child(2) { transition-delay: 0.2s; }
    .stagger-container.visible .animate-line:nth-child(3) { transition-delay: 0.3s; }
    .stagger-container.visible .animate-line:nth-child(4) { transition-delay: 0.4s; }
    .stagger-container.visible .animate-line:nth-child(5) { transition-delay: 0.5s; }

    .fade-up {
        animation: fadeUp 1.5s ease forwards;
    }

    @keyframes fadeUp {
        from { 
            opacity: 0; 
            transform: translateY(20px); 
        }
        to { 
            opacity: 1; 
            transform: translateY(0); 
        }
    }
`;
document.head.appendChild(animationStyles);

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    prepareTextAnimations();
    document.querySelectorAll('.role-buttons, .skills-list, .resume-buttons').forEach(el => {
        animationObserver.observe(el);
    });
});

//Reapply animations on role button clicks
document.querySelectorAll('.role-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Clear processed class from target role description
        const roleId = button.getAttribute('data-role');
        const roleDesc = document.querySelector(`#${roleId}-desc p`);
        if (roleDesc) {
            roleDesc.classList.remove('processed');
        }
        setTimeout(prepareTextAnimations, 50);
    });
});
//-----------------------------------------------------------------------------------------------------------------------------//
//-----------------------------------------Add animation keyframes dynamically-------------------------------------------------//
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
//-----------------------------------------------------------------------------------------------------------------------------//
//---------------------------------Dynamic emoji change based on button position-----------------------------------------------//
window.addEventListener('load', updateEmojiBasedOnButtonPosition);
window.addEventListener('resize', updateEmojiBasedOnButtonPosition);

function updateEmojiBasedOnButtonPosition() {
    const resumeButton = document.querySelector('.resume-btn');
    const emojiSpan = document.querySelector('#emoji');

    if (!resumeButton || !emojiSpan) return;

    const buttonRect = resumeButton.getBoundingClientRect();
    const textRect = emojiSpan.parentElement.getBoundingClientRect();

    emojiSpan.textContent = buttonRect.top > textRect.bottom ? '👇' : '👉';
}
//-----------------------------------------------------------------------------------------------------------------------------//
//-----------------------------------------------Role buttons functionality----------------------------------------------------//
const roleButtons = document.querySelectorAll('.role-btn');
const roleDescriptions = document.querySelectorAll('.role-desc');

roleButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and descriptions
        roleButtons.forEach(btn => btn.classList.remove('active'));
        roleDescriptions.forEach(desc => desc.classList.remove('active'));

        // Add active class to clicked button and corresponding description
        button.classList.add('active');
        const role = button.getAttribute('data-role');
        document.getElementById(`${role}-desc`).classList.add('active');
    });
});
//-----------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------Experience tabs functionality------------------------------------------------------//
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanels = document.querySelectorAll('.tab-panel');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and panels
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));

        // Add active class to clicked button and corresponding panel
        button.classList.add('active');
        const company = button.getAttribute('data-company');
        document.getElementById(company).classList.add('active');
    });
});
//-----------------------------------------------------------------------------------------------------------------------------//
// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Get the section
    const section = document.querySelector('.opensource');

    // Create intersection observer
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            // Add show class when section is visible
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            } else {
                // Remove show class when section is not visible
                entry.target.classList.remove('show');
            }
        });
    }, {
        threshold: 0.1 // Trigger when at least 10% of the section is visible
    });

    // Start observing the section
    observer.observe(section);
});
//-------------------------------------------Scroll to top functionality-------------------------------------------------------//
const scrollToTop = document.querySelector('.scroll-to-top');
scrollToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
// Show/hide scroll to top button based on scroll position
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollToTop.style.display = 'flex';
    } else {
        scrollToTop.style.display = 'none';
    }
});
//-----------------------------------------------------------------------------------------------------------------------------//
//--------------------------------Intersection Observer for experience section-------------------------------------------------//
const experienceSection = document.querySelector('.experience-container');
const experienceObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            experienceSection.style.animation = 'none'; // Reset animation
            void experienceSection.offsetWidth; // Trigger reflow to restart animation
            experienceSection.style.animation = 'slideIn 0.8s ease forwards';
        }
    });
}, { threshold: 0.1 });

experienceObserver.observe(experienceSection);

// Add slideIn animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(styleSheet);
//-----------------------------------------------------------------------------------------------------------------------------//
//--------------------------------------------Project cards hover effect-------------------------------------------------------//
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Active section highlighting in navigation
const sections = document.querySelectorAll('section');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 60; // Adjust for active highlight
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});
//-----------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------Initialize animations on page load-------------------------------------------------//
window.addEventListener('load', () => {
    document.querySelectorAll('.animate-text').forEach((element, index) => {
        setTimeout(() => {
            element.style.animation = 'fadeUp 1s ease forwards';
        }, index * 200);
    });
});

// Typing animation for hero section
function typeWriter(element, text, speed = 50) {
    let i = 0;
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

const heroText = document.querySelector('.hero h1');
if (heroText) {
    heroText.innerHTML = '';
    setTimeout(() => {
        typeWriter(heroText, 'Prabhat Kumar.');
    }, 1000);
}
//-----------------------------------------------------------------------------------------------------------------------------//
