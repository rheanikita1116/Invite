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
    ctx.strokeStyle = '#7b5e3c';
    ctx.lineWidth = 2;
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    function setCanvasSize() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        ctx.strokeStyle = '#7b5e3c';
        ctx.lineWidth = 2;
    }

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        if (e.touches && e.touches[0]) {
            return {
                x: (e.touches[0].clientX - rect.left) * scaleX,
                y: (e.touches[0].clientY - rect.top) * scaleY
            };
        }
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    function startDraw(e) {
        e.preventDefault();
        isDrawing = true;
        const pos = getPos(e);
        lastX = pos.x;
        lastY = pos.y;
    }

    function draw(e) {
        if (!isDrawing) return;
        e.preventDefault();
        
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        
        lastX = pos.x;
        lastY = pos.y;
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
    
    const userNameElement = document.querySelector('.user-name');
    const userName = userNameElement ? userNameElement.textContent.trim() : 'guest';

    try {
        downloadBtn.textContent = 'Preparing...';
        downloadBtn.disabled = true;

        // Create PDF
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: 'letter'
        });

        // Convert to canvas
        const canvas = await html2canvas(element, {
            scale: 1.2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff'
        });

        // Calculate dimensions
        const imgWidth = 792; // 11 inches in pixels
        const imgHeight = 612; // 8.5 inches in pixels
        const aspectRatio = canvas.height / canvas.width;
        
        // Scale down to fit better
        let pdfWidth = imgWidth * 0.5; // Reduced scaling
        let pdfHeight = pdfWidth * aspectRatio;
        
        if (pdfHeight > imgHeight * 0.5) {
            pdfHeight = imgHeight * 0.5;
            pdfWidth = pdfHeight / aspectRatio;
        }
        
        // Calculate centering
        const x = (imgWidth - pdfWidth) / 2;
        const y = (imgHeight - pdfHeight) / 2;

        // Add image to PDF
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        pdf.addImage(imgData, 'JPEG', 100, 80, pdfWidth, pdfHeight);
        
        // Save PDF
        pdf.save(`vigyaanrang-invitation-${userName}.pdf`);
        
        downloadBtn.textContent = originalBtnText;
        downloadBtn.disabled = false;
    } catch (error) {
        console.error('Error generating PDF:', error);
        downloadBtn.textContent = originalBtnText;
        downloadBtn.disabled = false;
    }
}