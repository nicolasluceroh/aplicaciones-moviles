import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "../config/supabase";
import { getMerchantImageUrl } from "../utils/merchantImages";

// El catálogo muestra únicamente productos que publicaron los comercios.
// Las necesidades se consultan desde foundation_needs por separado.
export function useCatalogProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(useCallback(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const { data, error: queryError } = await supabase
        .from("merchant_products")
        .select("id, name, description, price, category, merchant_name, need_id, image_paths, foundation_needs!inner(foundation_id, name, pending)")
        .eq("is_active", true)
        .gt("foundation_needs.pending", 0)
        .order("created_at", { ascending: false });

      if (!active) return;
      if (queryError) {
        setError("No se pudieron cargar los productos. Intentá nuevamente.");
        setProducts([]);
      } else {
        setError(null);
        setProducts((data || []).map((p) => ({
          id: `merchant:${p.id}`,
          name: p.name,
          description: p.description,
          price: Number(p.price),
          category: p.category,
          merchantName: p.merchant_name || "Comercio",
          images: (p.image_paths || []).map(getMerchantImageUrl),
          image: getMerchantImageUrl(p.image_paths?.[0]),
          foundationId: p.foundation_needs?.foundation_id,
          needId: p.need_id,
          needName: p.foundation_needs?.name,
          merchantProductId: p.id,
        })));
      }
      setLoading(false);
    }
    load();
    return () => { active = false; };
  }, []));

  return { products, loading, error };
}
