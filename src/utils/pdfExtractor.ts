import * as pdfjsLib from 'pdfjs-dist';

// Configurar o worker usando CDN para compatibilidade simples com Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function extractImagesFromPDF(file: File): Promise<string[]> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;
    const base64Images: string[] = [];

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const ops = await page.getOperatorList();
      
      for (let j = 0; j < ops.fnArray.length; j++) {
        if (ops.fnArray[j] === pdfjsLib.OPS.paintImageXObject || ops.fnArray[j] === pdfjsLib.OPS.paintJpegXObject) {
          const imgName = ops.argsArray[j][0];
          
          try {
            const img = await page.objs.get(imgName);
            
            if (img && img.width && img.height && img.data) {
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              
              if (ctx) {
                let imgDataArray: Uint8ClampedArray;
                
                // ImageData do navegador exige RGBA (4 bytes por pixel).
                // Se for RGB (3 bytes por pixel), precisamos converter.
                if (img.data.length === img.width * img.height * 3) {
                  imgDataArray = new Uint8ClampedArray(img.width * img.height * 4);
                  for (let p = 0, q = 0; p < img.data.length; p += 3, q += 4) {
                    imgDataArray[q] = img.data[p];       // R
                    imgDataArray[q + 1] = img.data[p + 1]; // G
                    imgDataArray[q + 2] = img.data[p + 2]; // B
                    imgDataArray[q + 3] = 255;             // A
                  }
                } else {
                  // Assume que já está no formato correto ou copia
                  imgDataArray = new Uint8ClampedArray(img.data);
                }

                const imageData = new ImageData(imgDataArray, img.width, img.height);
                ctx.putImageData(imageData, 0, 0);
                
                // Converte para Data URL e adiciona à lista
                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                base64Images.push(dataUrl);
              }
            }
          } catch (err) {
            console.warn(`Aviso: Falha ao extrair uma imagem na página ${i}`, err);
          }
        }
      }
    }
    
    return base64Images;
  } catch (error) {
    console.error("Erro geral na extração de imagens do PDF:", error);
    throw error;
  }
}

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + "\n";
    }

    return fullText;
  } catch (error) {
    console.error("Erro na extração de texto do PDF:", error);
    return "Falha ao extrair texto do documento.";
  }
}
