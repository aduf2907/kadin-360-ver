import { useState, useEffect } from "react";
import supabase from "../supabase-client";
import { ProjectOpportunity } from "@/types";

export const useProjectOpportunities = () => {
  const [projects, setProjects] = useState<ProjectOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from("project_opportunities")
        .select("*")
        .order("created_at", { ascending: false });

      if (supabaseError) throw supabaseError;

      if (data) {
        const mappedData: ProjectOpportunity[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          source: item.source,
          sectors: item.sectors || [],
          description: item.description,
          value: item.value,
          status: item.status,
          deadline: item.deadline,
          requirements: item.requirements || [],
          eligibility: item.eligibility || [],
          contact: {
            name: item.contact_name,
            email: item.contact_email,
            phone: item.contact_phone,
          },
        }));
        setProjects(mappedData);
      }
    } catch (err: any) {
      console.error("Error fetching projects:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (project: Omit<ProjectOpportunity, "id">) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from("project_opportunities")
        .insert([
          {
            title: project.title,
            source: project.source,
            sectors: project.sectors,
            description: project.description,
            value: project.value,
            status: project.status,
            deadline: project.deadline,
            requirements: project.requirements,
            eligibility: project.eligibility,
            contact_name: project.contact.name,
            contact_email: project.contact.email,
            contact_phone: project.contact.phone,
          },
        ])
        .select();

      if (supabaseError) throw supabaseError;
      await fetchProjects();
      return { success: true };
    } catch (err: any) {
      console.error("Error adding project:", err);
      return { success: false, error: err.message };
    }
  };

  const updateProject = async (
    id: string | number,
    project: Partial<ProjectOpportunity>,
  ) => {
    try {
      const updateData: any = {
        title: project.title,
        source: project.source,
        sectors: project.sectors,
        description: project.description,
        value: project.value,
        status: project.status,
        deadline: project.deadline,
        requirements: project.requirements,
        eligibility: project.eligibility,
      };

      if (project.contact) {
        updateData.contact_name = project.contact.name;
        updateData.contact_email = project.contact.email;
        updateData.contact_phone = project.contact.phone;
      }

      const { error: supabaseError } = await supabase
        .from("project_opportunities")
        .update(updateData)
        .eq("id", id);

      if (supabaseError) throw supabaseError;
      await fetchProjects();
      return { success: true };
    } catch (err: any) {
      console.error("Error updating project:", err);
      return { success: false, error: err.message };
    }
  };

  const deleteProject = async (id: string | number) => {
    try {
      const { error: supabaseError } = await supabase
        .from("project_opportunities")
        .delete()
        .eq("id", id);

      if (supabaseError) throw supabaseError;
      await fetchProjects();
      return { success: true };
    } catch (err: any) {
      console.error("Error deleting project:", err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    addProject,
    updateProject,
    deleteProject,
    refresh: fetchProjects,
  };
};
