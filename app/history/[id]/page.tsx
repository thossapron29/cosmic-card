"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ScreenShell } from "@/components/screen-shell";
import { CardContent } from "@/components/card-content";
import { PrimaryButton } from "@/components/primary-button";
import { getAnonymousId } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export default function HistoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = getAnonymousId();
    if (!userId || !id) {
      setError("User or record not found");
      setLoading(false);
      return;
    }

    async function fetchDetail() {
      try {
        // Fetch history and find by card.id
        const res = await fetch(`/api/history?userId=${userId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        
        const found = data.history?.find((h: any) => h.card?.id === id);
        if (found) {
          setRecord(found);
        } else {
          setError("Record not found");
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [id]);

  return (
    <ScreenShell>
      <div className="flex flex-col w-full z-10 h-full">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => router.push("/history")}
            className="p-2 -ml-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="ml-2">
            <p className="text-white/40 text-xs tracking-widest uppercase">Revealed</p>
            {record && (
              <p className="text-cosmic-accent text-sm tracking-widest uppercase mt-1">
                {new Date(record.revealed_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric'})}
              </p>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2 }}>
              <div className="w-8 h-8 border-t-2 border-cosmic-accent rounded-full animate-spin" />
            </motion.div>
          </div>
        ) : error || !record?.card ? (
          <div className="text-center py-20 space-y-6">
            <p className="text-red-400">{error || "Card not found"}</p>
            <PrimaryButton variant="secondary" onClick={() => router.push("/history")}>
              Back to History
            </PrimaryButton>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center grow justify-center"
          >
            <CardContent card={record.card} />

             <div className="mt-12 flex flex-col w-full space-y-4 max-w-xs">
              <PrimaryButton onClick={() => router.push(`/share/${record.card.id}`)}>
                Share Card
              </PrimaryButton>
            </div>
          </motion.div>
        )}
      </div>
    </ScreenShell>
  );
}
