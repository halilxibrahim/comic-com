import { IMAGE_CONSTRAINTS } from './constants';

/**
 * Dosya boyutunu kontrol et
 */
export function validateFileSize(file) {
  if (file.size > IMAGE_CONSTRAINTS.maxFileSize) {
    throw new Error(`Dosya boyutu ${IMAGE_CONSTRAINTS.maxFileSize / 1024 / 1024}MB'dan küçük olmalıdır`);
  }
  return true;
}

/**
 * Dosya tipini kontrol et
 */
export function validateFileType(file) {
  if (!IMAGE_CONSTRAINTS.allowedTypes.includes(file.type)) {
    throw new Error('Sadece JPEG, PNG ve WebP formatları desteklenmektedir');
  }
  return true;
}

/**
 * Görüntüyü yeniden boyutlandır
 */
export function resizeImage(file, maxWidth = 1024, maxHeight = 1024, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Orijinal boyutları al
      let { width, height } = img;

      // Oranı koru ve yeniden boyutlandır
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      // Canvas boyutunu ayarla
      canvas.width = width;
      canvas.height = height;

      // Görüntüyü çiz
      ctx.drawImage(img, 0, 0, width, height);

      // Base64 string olarak dışa aktar
      const resizedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(resizedDataUrl);
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Base64 görüntüden blob oluştur
 */
export function dataURLtoBlob(dataURL) {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
}

/**
 * Görüntüyü indirmek için kullan
 */
export function downloadImage(dataURL, filename = 'styled-photo.jpg') {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Kameradan görüntü yakala
 */
export async function captureFromCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { 
        facingMode: 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    });

    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      video.onloadedmetadata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        
        // Stream'i durdur
        stream.getTracks().forEach(track => track.stop());
        
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        resolve(imageData);
      };

      video.onerror = reject;
    });
  } catch (error) {
    throw new Error('Kameraya erişim sağlanamadı: ' + error.message);
  }
}
