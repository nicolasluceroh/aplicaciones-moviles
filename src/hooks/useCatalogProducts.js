import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "../config/supabase";
import { getMerchantImageUrl } from "../utils/merchantImages";

// La vista centraliza el JOIN entre publicaciones y necesidades y respeta el
// RLS de las tablas subyacentes mediante security_invoker.
export function useCatalogProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(useCallback(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const { data, error: queryError } = await supabase
        .from("v_catalogo_productos_disponibles")
        .select("product_id, product_name, description, price, category, merchant_name, need_id, need_name, foundation_id, need_pending, stock, image_paths, created_at")
        .order("created_at", { ascending: false });

      if (!active) return;
      if (queryError) {
        setError("No se pudieron cargar los productos. Intentá nuevamente.");
        setProducts([]);
      } else {
        setError(null);
        setProducts((data || []).map((p) => {
          const stock = Number(p.stock || 0);
          const needPending = Number(p.need_pending || 0);
          return {
            id: `merchant:${p.product_id}`,
            name: p.product_name,
            description: p.description,
            price: Number(p.price),
            category: p.category,
            merchantName: p.merchant_name || "Comercio",
            images: (p.image_paths || []).map(getMerchantImageUrl),
            image: getMerchantImageUrl(p.image_paths?.[0]),
            foundationId: p.foundation_id,
            needId: p.need_id,
            needName: p.need_name,
            merchantProductId: p.product_id,
            stock,
            needPending,
            availableQuantity: Math.max(0, Math.min(stock, needPending)),
          };
        }));
      }
      setLoading(false);
    }
    load();
    return () => { active = false; };
  }, []));

  return { products, loading, error };
}
