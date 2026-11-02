import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { products as localProducts } from "../data/products";
import { supabase } from "../config/supabase";

// Los productos locales siguen disponibles. Las ofertas de comercios se cargan
// desde Supabase al volver a Inicio/Catálogo (incluidos los cambios de fundaciones).
export function useCatalogProducts() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      async function load() {
        setLoading(true);
        const { data, error: queryError } = await supabase
          .from("merchant_products")
          .select("id, name, description, price, category, emoji, need_id, foundation_needs!inner(foundation_id, name, pending)")
          .eq("is_active", true)
          .gt("foundation_needs.pending", 0)
          .order("created_at", { ascending: false });

        if (!active) return;
        if (queryError) {
          setError("No se pudieron cargar los productos de comercios.");
          setOffers([]);
        } else {
          setError(null);
          setOffers((data || []).map((p) => ({
            id: `merchant:${p.id}`,
            name: p.name,
            description: p.description,
            price: Number(p.price),
            category: p.category,
            emoji: p.emoji || "🎁",
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
    }, [])
  );

  return { products: [...offers, ...localProducts], loading, error };
}
