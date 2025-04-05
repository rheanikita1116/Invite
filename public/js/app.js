function saveSignature() {
    const canvas = document.getElementById("signatureCanvas");
    const signature = canvas.toDataURL();
    document.getElementById("signatureInput").value = signature;
}

function clearCanvas() {
    const canvas = document.getElementById("signatureCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

window.onload = function () {
    const canvas = document.getElementById("signatureCanvas");
    const ctx = canvas.getContext("2d");
    let isDrawing = false;

    // Fix for high-DPI (retina) screens
    function resizeCanvas() {
        const ratio = window.devicePixelRatio || 1;
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        let x, y;
        if (e.touches) {
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }
        return { x, y };
    }

    function startDraw(e) {
        e.preventDefault();
        isDrawing = true;
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    }

    function draw(e) {
        e.preventDefault();
        if (!isDrawing) return;
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    }

    function endDraw() {
        isDrawing = false;
    }

    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", endDraw);
    canvas.addEventListener("mouseleave", endDraw);

    canvas.addEventListener("touchstart", startDraw, { passive: false });
    canvas.addEventListener("touchmove", draw, { passive: false });
    canvas.addEventListener("touchend", endDraw);
};

async function downloadInvitation() {
    const element = document.querySelector('.invitation-card');
    // Get username from the rendered page
    const userNameElement = document.querySelector('.user-name');
    const userName = userNameElement ? userNameElement.textContent.trim() : 'user';
    
    // Create a simple wrapper for PDF
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      background-color: #ffffff;
      padding: 100px 40px 60px 40px;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    `;
    
    const clone = element.cloneNode(true);
    
    // Make the invitation card wider for PDF
    clone.style.cssText = `
      background: rgba(255, 180, 210, 0.95);
      border-radius: 20px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      padding: 20px 30px;
      text-align: center;
      width: 100%;
      max-width: 800px;
      position: relative;
      overflow: hidden;
      margin: 0 auto 20px auto;
      backdrop-filter: blur(5px);
    `;
    
    // Adjust the event details to be more compact
    const eventDetails = clone.querySelector('.event-details');
    if (eventDetails) {
      eventDetails.style.marginTop = '10px';
      eventDetails.style.marginBottom = '10px';
      eventDetails.style.padding = '10px';
    }
    
    // Reduce spacing between elements
    const paragraphs = clone.querySelectorAll('p');
    paragraphs.forEach(p => {
      p.style.marginBottom = '8px';
    });
    
    // Ensure signature background is solid
    const signature = clone.querySelector('.signature');
    if (signature) {
      signature.style.background = '#ffffff';
      signature.style.marginTop = '15px';
    }
    
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    const opt = {
      margin: 0,
      filename: `vigyaanrang-invitation-${userName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: true
      },
      jsPDF: { 
        unit: 'in', 
        format: [8.5, 11], // Standard letter size in portrait orientation
        orientation: 'portrait' 
      },
      pagebreak: { mode: ['avoid-all'] }
    };

    try {
      const btn = document.querySelector('.download-btn');
      btn.textContent = 'Preparing...';
      btn.disabled = true;
      
      await html2pdf().set(opt).from(wrapper).save();
      
      document.body.removeChild(wrapper);
      btn.textContent = 'Download Invitation';
      btn.disabled = false;
    } catch (error) {
      console.error('Error generating PDF:', error);
      document.body.removeChild(wrapper);
      btn.textContent = 'Download Invitation';
      btn.disabled = false;
    }
}