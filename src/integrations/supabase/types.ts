export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      diagnostic_tokens: {
        Row: {
          created_at: string
          created_by: string | null
          email: string
          expires_at: string | null
          id: number
          nombre: string | null
          submission_id: string | null
          token: string
          used: boolean | null
          used_at: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email: string
          expires_at?: string | null
          id?: never
          nombre?: string | null
          submission_id?: string | null
          token: string
          used?: boolean | null
          used_at?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string
          expires_at?: string | null
          id?: never
          nombre?: string | null
          submission_id?: string | null
          token?: string
          used?: boolean | null
          used_at?: string | null
        }
        Relationships: []
      }
      diagnostico_submissions: {
        Row: {
          anio_graduacion: string
          anios_experiencia: string
          apoyo_familiar: string
          areas_trabajo: string
          bundesland_envio: string | null
          bundesland_preferido: string | null
          ciudad_preferida: string | null
          clasificacion: string
          created_at: string
          cual_certificado: string | null
          cual_especialidad: string | null
          cuando_viajar: string
          dinero_ahorrado: string
          dispuesto_ciudades_pequenas: string
          dispuesto_especialidades: Json | null
          documentos: Json
          donde_contactos: string | null
          edad: string
          email: string | null
          envio_documentos: string
          especialidad_interes: string | null
          estado_civil: string
          estudia_actualmente: string
          estudio_aleman_medico: string
          ha_aplicado_hospitales: string
          ha_tenido_entrevistas: string
          horas_por_semana: string | null
          id: number
          motivacion: string
          nacionalidad: string
          nivel_aleman: string
          nivel_aleman_pareja: string | null
          nombre_completo: string
          pais_origen: string
          pareja_habla_aleman: string | null
          pareja_profesion: string | null
          presento_fsp: string
          presento_kenntnis: string
          puede_abrir_sperrkonto: string
          puede_dedicar_1a2_horas: string
          puede_estudiar_intensivo: string
          realizo_internado: string
          recibio_respuesta: string | null
          score_documentos: number
          score_estrategia: number
          score_finanzas: number
          score_homologacion: number
          score_idioma: number
          score_total: number
          solicitaron_examen: string | null
          submission_id: string
          tiene_approbation: string
          tiene_berufserlaubnis: string
          tiene_certificado: string
          tiene_contactos_alemania: string
          tiene_especialidad: string
          tiene_hijos: string
          tipo_visa: string
          token_id: string | null
          universidad: string
          updated_at: string
          viaja_con_pareja: string
          viaja_mascota: string
          viaja_solo: string
        }
        Insert: {
          anio_graduacion: string
          anios_experiencia: string
          apoyo_familiar: string
          areas_trabajo: string
          bundesland_envio?: string | null
          bundesland_preferido?: string | null
          ciudad_preferida?: string | null
          clasificacion?: string
          created_at?: string
          cual_certificado?: string | null
          cual_especialidad?: string | null
          cuando_viajar: string
          dinero_ahorrado: string
          dispuesto_ciudades_pequenas: string
          dispuesto_especialidades?: Json | null
          documentos?: Json
          donde_contactos?: string | null
          edad: string
          email?: string | null
          envio_documentos: string
          especialidad_interes?: string | null
          estado_civil: string
          estudia_actualmente: string
          estudio_aleman_medico: string
          ha_aplicado_hospitales: string
          ha_tenido_entrevistas: string
          horas_por_semana?: string | null
          id?: never
          motivacion: string
          nacionalidad: string
          nivel_aleman: string
          nivel_aleman_pareja?: string | null
          nombre_completo: string
          pais_origen: string
          pareja_habla_aleman?: string | null
          pareja_profesion?: string | null
          presento_fsp: string
          presento_kenntnis: string
          puede_abrir_sperrkonto: string
          puede_dedicar_1a2_horas: string
          puede_estudiar_intensivo: string
          realizo_internado: string
          recibio_respuesta?: string | null
          score_documentos?: number
          score_estrategia?: number
          score_finanzas?: number
          score_homologacion?: number
          score_idioma?: number
          score_total?: number
          solicitaron_examen?: string | null
          submission_id?: string
          tiene_approbation: string
          tiene_berufserlaubnis: string
          tiene_certificado: string
          tiene_contactos_alemania: string
          tiene_especialidad: string
          tiene_hijos: string
          tipo_visa: string
          token_id?: string | null
          universidad: string
          updated_at?: string
          viaja_con_pareja: string
          viaja_mascota: string
          viaja_solo: string
        }
        Update: {
          anio_graduacion?: string
          anios_experiencia?: string
          apoyo_familiar?: string
          areas_trabajo?: string
          bundesland_envio?: string | null
          bundesland_preferido?: string | null
          ciudad_preferida?: string | null
          clasificacion?: string
          created_at?: string
          cual_certificado?: string | null
          cual_especialidad?: string | null
          cuando_viajar?: string
          dinero_ahorrado?: string
          dispuesto_ciudades_pequenas?: string
          dispuesto_especialidades?: Json | null
          documentos?: Json
          donde_contactos?: string | null
          edad?: string
          email?: string | null
          envio_documentos?: string
          especialidad_interes?: string | null
          estado_civil?: string
          estudia_actualmente?: string
          estudio_aleman_medico?: string
          ha_aplicado_hospitales?: string
          ha_tenido_entrevistas?: string
          horas_por_semana?: string | null
          id?: never
          motivacion?: string
          nacionalidad?: string
          nivel_aleman?: string
          nivel_aleman_pareja?: string | null
          nombre_completo?: string
          pais_origen?: string
          pareja_habla_aleman?: string | null
          pareja_profesion?: string | null
          presento_fsp?: string
          presento_kenntnis?: string
          puede_abrir_sperrkonto?: string
          puede_dedicar_1a2_horas?: string
          puede_estudiar_intensivo?: string
          realizo_internado?: string
          recibio_respuesta?: string | null
          score_documentos?: number
          score_estrategia?: number
          score_finanzas?: number
          score_homologacion?: number
          score_idioma?: number
          score_total?: number
          solicitaron_examen?: string | null
          submission_id?: string
          tiene_approbation?: string
          tiene_berufserlaubnis?: string
          tiene_certificado?: string
          tiene_contactos_alemania?: string
          tiene_especialidad?: string
          tiene_hijos?: string
          tipo_visa?: string
          token_id?: string | null
          universidad?: string
          updated_at?: string
          viaja_con_pareja?: string
          viaja_mascota?: string
          viaja_solo?: string
        }
        Relationships: []
      }
      onboarding_responses: {
        Row: {
          anabin_status: string | null
          budget: string | null
          city: string | null
          country: string | null
          created_at: string
          current_stage: string | null
          family_status: string | null
          german_level: string | null
          id: string
          in_germany: string | null
          waitlist_id: string | null
        }
        Insert: {
          anabin_status?: string | null
          budget?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          current_stage?: string | null
          family_status?: string | null
          german_level?: string | null
          id?: string
          in_germany?: string | null
          waitlist_id?: string | null
        }
        Update: {
          anabin_status?: string | null
          budget?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          current_stage?: string | null
          family_status?: string | null
          german_level?: string | null
          id?: string
          in_germany?: string | null
          waitlist_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_responses_waitlist_id_fkey"
            columns: ["waitlist_id"]
            isOneToOne: false
            referencedRelation: "waitlist"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_cents: number | null
          created_at: string
          currency: string | null
          email: string
          id: number
          nombre: string | null
          payment_id: string
          product: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          amount_cents?: number | null
          created_at?: string
          currency?: string | null
          email: string
          id?: never
          nombre?: string | null
          payment_id?: string
          product?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          amount_cents?: number | null
          created_at?: string
          currency?: string | null
          email?: string
          id?: never
          nombre?: string | null
          payment_id?: string
          product?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_waitlist_count: { Args: never; Returns: number }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
