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

    function resizeCanvas() {
        const ratio = window.devicePixelRatio || 1;
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);
    }

    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        return { 
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
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

    resizeCanvas();
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#333';

    window.addEventListener("resize", resizeCanvas);
    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", endDraw);
    canvas.addEventListener("touchstart", (e) => startDraw(e.touches[0]));
    canvas.addEventListener("touchmove", (e) => draw(e.touches[0]));
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
      padding: 20px 40px 60px 40px;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    `;
    
    const clone = element.cloneNode(true);
    
    // Ensure signature background is solid
    const signature = clone.querySelector('.signature');
    if (signature) {
      signature.style.background = '#ffffff';
    }
    
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    const opt = {
      margin: 0.5,
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
        format: 'letter', 
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