import { useState, useEffect } from "react";
import supabase from "../supabase-client";
import { ProgramEvaluation } from "@/types";

export const useEvaluations = () => {
  const [evaluations, setEvaluations] = useState<ProgramEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvaluations = async () => {
    try {
      setLoading(true);
      const { data, error: dbError } = await supabase
        .from("program_evaluations")
        .select(
          `
                    *,
                    evaluator:evaluator_id (name),
                    report:report_id (program_name, title)
                `,
        )
        .order("created_at", { ascending: false });

      if (dbError) throw dbError;

      const formattedData =
        data?.map((item) => ({
          ...item,
          evaluator_name: item.evaluator?.name,
          program_name: item.report?.program_name,
          report_title: item.report?.title,
        })) || [];

      setEvaluations(formattedData);
    } catch (err: any) {
      console.error("Error fetching evaluations:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitEvaluation = async (
    evaluationData: Partial<ProgramEvaluation>,
  ) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error: dbError } = await supabase
        .from("program_evaluations")
        .insert([
          {
            ...evaluationData,
            evaluator_id: user.id,
          },
        ])
        .select();

      if (dbError) throw dbError;

      fetchEvaluations();
      return { success: true };
    } catch (err: any) {
      console.error("Error submitting evaluation:", err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchEvaluations();
  }, []);

  return {
    evaluations,
    loading,
    error,
    submitEvaluation,
    refresh: fetchEvaluations,
  };
};
