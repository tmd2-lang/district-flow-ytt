const instructorData = {
  adrianne: {
    name: "Adrianne Du'sauzay",
    title: "E-RYT 200, District Flow Instructor",
    image: "assets/images/Adrianne.jpg",
    bio: `
      <p>Adrianne first started practicing yoga in her small apartment after her undergraduate studies and loved how it made her feel. She continued to practice during her Masters of Science in Exercise Science program at George Washington University. During grad school, she became a Certified Personal Trainer, working with private clients and companies to support their wellness programs.</p>
      
      <p>Her personal practice helped her stay grounded, and after several years, she decided to study the discipline formally, becoming a 200-hr certified yoga teacher in 2015. This led to her new life as a full-time yoga professional—teaching classes, managing studios, and facilitating Yoga Teacher Training programs for private clients and CorePower Yoga.</p>
      
      <p>As an E-RYT 200 yoga teacher, Adrianne has taught well over 1,000 yoga classes and led countless training programs. She loves teaching Power Vinyasa, Hot Power Fusion, Yoga Sculpt, and truly enjoys sharing the power of breathwork. She is committed to inspiring curiosity to explore your authentic self through practice, and is excited to be a part of your yoga journey.</p>
    `
  },
  alyssa: {
    name: "Dr. Allyssa Soto",
    title: "Ph.D., 500-RYT, 85-RPYT",
    image: "assets/images/alyssa.jpg",
    bio: `
      <p>Dr. Allyssa has been teaching yoga since 2018 and holds 500-hour and 85-hour YTT and Prenatal YTT certifications from India. She brings ancient yoga wisdom and Eastern philosophy into her classes.</p>
      
      <p>She specializes in yoga for women's hormonal health and is passionate about empowering women through wellness. She regularly hosts international retreats that offer women an opportunity to connect and rejuvenate.</p>
      
      <p>Allyssa has a PhD in the Philosophy of Education and specializes in women's health education. Having completed prenatal/postnatal Ayurvedic training in India, she seamlessly combines scientific research with Eastern Medicine in her teachings.</p>
    `
  },
  chris: {
    name: "Chris Sherman",
    title: "District Flow Instructor",
    image: "assets/images/chris.jpg",
    bio: `
      <p>Chris (they/them) started doing yoga as a form of accessible movement while coping with injury and chronic pain. Yoga helped them find functional mobility and healing in their body, and they were amazed at how it also brought positive changes to their mind.</p>
      
      <p>Wanting to share what they had learned and experienced, Chris completed their 200-hour Yoga Teacher Training in 2016 at Yoga District. They followed it with certifications in Mat Pilates (2019), Pre/Postnatal Yoga (2020), and Group Fitness (2020), alongside specialized trainings on yoga for autism, TBI, and trauma.</p>
    `
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("instructor-modal");
  const modalImage = document.getElementById("modal-image");
  const modalName = document.getElementById("modal-name");
  const modalTitle = document.getElementById("modal-title");
  const modalBio = document.getElementById("modal-bio");
  const closeBtn = document.querySelector(".modal-close");
  const overlay = document.querySelector(".modal-overlay");

  if (!modal) return;

  const cards = document.querySelectorAll(".teacher-card[data-instructor]");

  function openModal(instructorId) {
    const data = instructorData[instructorId];
    if (!data) return;

    modalImage.style.backgroundImage = \`url('\${data.image}')\`;
    modalName.textContent = data.name;
    modalTitle.textContent = data.title;
    modalBio.innerHTML = data.bio;

    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // Prevent background scrolling
    
    // Slight delay to allow display:block to render before triggering opacity transition
    setTimeout(() => {
      modal.classList.add("is-open");
    }, 10);
  }

  function closeModal() {
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
    
    // Wait for transition to finish before hiding completely
    setTimeout(() => {
      modal.setAttribute("aria-hidden", "true");
    }, 400); // Matches CSS transition duration
  }

  cards.forEach(card => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-instructor");
      openModal(id);
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (overlay) overlay.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
});
