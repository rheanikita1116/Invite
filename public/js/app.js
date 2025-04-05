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
    if (!canvas) return; // Skip if not on signature page
    
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = '#7b5e3c'; // Set signature color to match theme
    ctx.lineWidth = 2;
    let isDrawing = false;

    function resizeCanvas() {
        const ratio = window.devicePixelRatio || 1;
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);
        ctx.strokeStyle = '#7b5e3c';
        ctx.lineWidth = 2;
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
    const downloadBtn = document.querySelector('button');
    const originalBtnText = downloadBtn.textContent;
    
    // Get username from the hidden div
    const userNameElement = document.querySelector('.user-name');
    const userName = userNameElement ? userNameElement.textContent.trim() : 'guest';
    
    // Create a wrapper for PDF
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
        background-color: #ffffff;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 11in;
        height: 8.5in;
    `;
    
    const clone = element.cloneNode(true);
    clone.style.cssText = `
        background: #fff;
        border-radius: 20px;
        box-shadow: 0 10px 25px rgba(183, 140, 75, 0.15);
        padding: 60px;
        text-align: center;
        width: 90%;
        max-width: 1000px;
        position: relative;
        overflow: hidden;
        margin: 0 auto;
        border: 2px solid #d4b183;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 7.5in;
    `;
    
    // Adjust content spacing
    const title = clone.querySelector('h2');
    if (title) {
        title.style.marginBottom = '40px';
    }

    const message = clone.querySelector('.message');
    if (message) {
        message.style.marginBottom = '40px';
        message.style.fontSize = '24px';
        message.style.lineHeight = '1.6';
    }

    const date = clone.querySelector('.date');
    if (date) {
        date.style.marginBottom = '20px';
        date.style.fontSize = '22px';
    }

    const venue = clone.querySelector('.venue');
    if (venue) {
        venue.style.marginBottom = '40px';
        venue.style.fontSize = '22px';
    }

    const closing = clone.querySelector('.closing');
    if (closing) {
        closing.style.marginBottom = '30px';
        closing.style.fontSize = '20px';
    }

    const signatureLabel = clone.querySelector('.signature-label');
    if (signatureLabel) {
        signatureLabel.style.marginBottom = '20px';
        signatureLabel.style.fontSize = '20px';
    }
    
    // Hide the user-name div in the PDF
    const hiddenName = clone.querySelector('.user-name');
    if (hiddenName) {
        hiddenName.remove();
    }
    
    // Ensure signature background is solid
    const signature = clone.querySelector('.signature');
    if (signature) {
        signature.style.background = '#ffffff';
        signature.style.marginTop = '15px';
        signature.style.border = '1px solid #d4b183';
        signature.style.borderRadius = '8px';
        signature.style.padding = '10px';
        signature.style.width = '200px';
        signature.style.margin = '0 auto';
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
            useCORS: true
        },
        jsPDF: { 
            unit: 'in', 
            format: 'letter',
            orientation: 'landscape'
        }
    };

    try {
        downloadBtn.textContent = 'Preparing...';
        downloadBtn.disabled = true;
        
        await html2pdf().set(opt).from(wrapper).save();
        
        downloadBtn.textContent = originalBtnText;
        downloadBtn.disabled = false;
    } catch (error) {
        console.error('Error generating PDF:', error);
        downloadBtn.textContent = originalBtnText;
        downloadBtn.disabled = false;
    } finally {
        document.body.removeChild(wrapper);
    }
}