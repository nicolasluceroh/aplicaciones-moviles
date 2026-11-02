import { supabase } from "../config/supabase";

export const MERCHANT_IMAGE_BUCKET = "merchant-products";
export const MAX_IMAGES = 3;
const MAX_BYTES = 5 * 1024 * 1024;
const base64Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const formats = {
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp",
  "image/heic": "heic", "image/heif": "heif",
};

// Storage para React Native necesita ArrayBuffer/Uint8Array, no Blob ni FormData.
function decodeImage(base64) {
  const source = base64.replace(/\s/g, "").replace(/=+$/, "");
  const bytes = new Uint8Array(Math.floor(source.length * 3 / 4));
  let buffer = 0;
  let bitCount = 0;
  let position = 0;
  for (let i = 0; i < source.length; i++) {
    const code = base64Alphabet.indexOf(source[i]);
    if (code < 0) throw new Error("El archivo de imagen no es válido.");
    buffer = (buffer << 6) | code;
    bitCount += 6;
    if (bitCount >= 8) {
      bitCount -= 8;
      bytes[position++] = (buffer >> bitCount) & 0xff;
    }
  }
  return bytes;
}

export function getMerchantImageUrl(path) {
  if (!path) return null;
  return supabase.storage.from(MERCHANT_IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function uploadMerchantImages(userId, assets) {
  const uploaded = [];
  try {
    for (const asset of assets) {
      if (!asset.base64) throw new Error("No se pudo leer la foto. Volvé a seleccionarla.");
      const mime = (asset.mimeType || "image/jpeg").toLowerCase();
      const extension = formats[mime];
      if (!extension) throw new Error("Usá imágenes JPG, PNG, WEBP o HEIC.");
      // Verificación adicional: el bucket también limita el tamaño del archivo.
      if (Math.floor(asset.base64.length * 3 / 4) > MAX_BYTES) {
        throw new Error("Cada foto debe pesar menos de 5 MB.");
      }
      const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 11)}.${extension}`;
      const { error } = await supabase.storage.from(MERCHANT_IMAGE_BUCKET).upload(
        fileName, decodeImage(asset.base64),
        { contentType: mime, upsert: false, cacheControl: "3600" }
      );
      if (error) throw error;
      uploaded.push(fileName);
    }
    return uploaded;
  } catch (error) {
    if (uploaded.length) await removeMerchantImages(uploaded);
    throw error;
  }
}

export async function removeMerchantImages(paths) {
  if (!paths?.length) return;
  const { error } = await supabase.storage.from(MERCHANT_IMAGE_BUCKET).remove(paths);
  if (error) throw error;
}
