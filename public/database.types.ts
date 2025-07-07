export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      campaigns: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      campaign_chapters: {
        Row: {
          id: number
          campaign_id: number
          chapter_number: number
          created_at: string
          content: string | null
        }
        Insert: {
          id?: number
          campaign_id: number
          chapter_number: number
          created_at?: string
          content?: string | null
        }
        Update: {
          id?: number
          campaign_id?: number
          chapter_number?: number
          created_at?: string
          content?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_chapters_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          }
        ]
      }
      desvantagens: {
        Row: {
          cost: string | null
          description: string | null
          id: number
          name: string
        }
        Insert: {
          cost?: string | null
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          cost?: string | null
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      monstros: {
        Row: {
          archetype: string | null
          campaign_id: number
          concept: string | null
          Habilidade: number | null
          id: number
          image: string | null
          name: string | null
          Poder: number | null
          pontos: string | null
          Pontos_Acao: number | null
          Pontos_Mana: number | null
          Pontos_Vida: number | null
          Resistencia: number | null
        }
        Insert: {
          archetype?: string | null
          campaign_id: number
          concept?: string | null
          Habilidade?: number | null
          id?: number
          image?: string | null
          name?: string | null
          Poder?: number | null
          pontos?: string | null
          Pontos_Acao?: number | null
          Pontos_Mana?: number | null
          Pontos_Vida?: number | null
          Resistencia?: number | null
        }
        Update: {
          archetype?: string | null
          campaign_id?: number
          concept?: string | null
          Habilidade?: number | null
          id?: number
          image?: string | null
          name?: string | null
          Poder?: number | null
          pontos?: string | null
          Pontos_Acao?: number | null
          Pontos_Mana?: number | null
          Pontos_Vida?: number | null
          Resistencia?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "monstros_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      monstros_desvantagens: {
        Row: {
          desvantagem_id: number
          monstro_id: number
        }
        Insert: {
          desvantagem_id: number
          monstro_id: number
        }
        Update: {
          desvantagem_id?: number
          monstro_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "monstros_desvantagens_desvantagem_id_fkey"
            columns: ["desvantagem_id"]
            isOneToOne: false
            referencedRelation: "desvantagens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monstros_desvantagens_monstro_id_fkey"
            columns: ["monstro_id"]
            isOneToOne: false
            referencedRelation: "monstros"
            referencedColumns: ["id"]
          },
        ]
      }
      monstros_pericias: {
        Row: {
          monstro_id: number
          pericia_id: number
        }
        Insert: {
          monstro_id: number
          pericia_id: number
        }
        Update: {
          monstro_id?: number
          pericia_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "monstros_pericias_monstro_id_fkey"
            columns: ["monstro_id"]
            isOneToOne: false
            referencedRelation: "monstros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monstros_pericias_pericia_id_fkey"
            columns: ["pericia_id"]
            isOneToOne: false
            referencedRelation: "pericias"
            referencedColumns: ["id"]
          },
        ]
      }
      monstros_tecnicas: {
        Row: {
          monstro_id: number
          tecnica_id: number
        }
        Insert: {
          monstro_id: number
          tecnica_id: number
        }
        Update: {
          monstro_id?: number
          tecnica_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "monstros_tecnicas_monstro_id_fkey"
            columns: ["monstro_id"]
            isOneToOne: false
            referencedRelation: "monstros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monstros_tecnicas_tecnica_id_fkey"
            columns: ["tecnica_id"]
            isOneToOne: false
            referencedRelation: "tecnicas"
            referencedColumns: ["id"]
          },
        ]
      }
      monstros_vantagens: {
        Row: {
          monstro_id: number
          vantagem_id: number
        }
        Insert: {
          monstro_id: number
          vantagem_id: number
        }
        Update: {
          monstro_id?: number
          vantagem_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "monstros_vantagens_monstro_id_fkey"
            columns: ["monstro_id"]
            isOneToOne: false
            referencedRelation: "monstros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monstros_vantagens_vantagem_id_fkey"
            columns: ["vantagem_id"]
            isOneToOne: false
            referencedRelation: "vantagens"
            referencedColumns: ["id"]
          },
        ]
      }
      npcs: {
        Row: {
          archetype: string | null
          campaign_id: number
          concept: string | null
          Habilidade: number | null
          id: number
          image: string | null
          name: string | null
          Poder: number | null
          pontos: string | null
          Pontos_Acao: number | null
          Pontos_Mana: number | null
          Pontos_Vida: number | null
          Resistencia: number | null
        }
        Insert: {
          archetype?: string | null
          campaign_id: number
          concept?: string | null
          Habilidade?: number | null
          id?: number
          image?: string | null
          name?: string | null
          Poder?: number | null
          pontos?: string | null
          Pontos_Acao?: number | null
          Pontos_Mana?: number | null
          Pontos_Vida?: number | null
          Resistencia?: number | null
        }
        Update: {
          archetype?: string | null
          campaign_id?: number
          concept?: string | null
          Habilidade?: number | null
          id?: number
          image?: string | null
          name?: string | null
          Poder?: number | null
          pontos?: string | null
          Pontos_Acao?: number | null
          Pontos_Mana?: number | null
          Pontos_Vida?: number | null
          Resistencia?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "npcs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      npcs_desvantagens: {
        Row: {
          desvantagem_id: number
          npc_id: number
        }
        Insert: {
          desvantagem_id: number
          npc_id: number
        }
        Update: {
          desvantagem_id?: number
          npc_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "npcs_desvantagens_desvantagem_id_fkey"
            columns: ["desvantagem_id"]
            isOneToOne: false
            referencedRelation: "desvantagens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "npcs_desvantagens_npc_id_fkey"
            columns: ["npc_id"]
            isOneToOne: false
            referencedRelation: "npcs"
            referencedColumns: ["id"]
          },
        ]
      }
      npcs_pericias: {
        Row: {
          npc_id: number
          pericia_id: number
        }
        Insert: {
          npc_id: number
          pericia_id: number
        }
        Update: {
          npc_id?: number
          pericia_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "npcs_pericias_npc_id_fkey"
            columns: ["npc_id"]
            isOneToOne: false
            referencedRelation: "npcs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "npcs_pericias_pericia_id_fkey"
            columns: ["pericia_id"]
            isOneToOne: false
            referencedRelation: "pericias"
            referencedColumns: ["id"]
          },
        ]
      }
      npcs_tecnicas: {
        Row: {
          npc_id: number
          tecnica_id: number
        }
        Insert: {
          npc_id: number
          tecnica_id: number
        }
        Update: {
          npc_id?: number
          tecnica_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "npcs_tecnicas_npc_id_fkey"
            columns: ["npc_id"]
            isOneToOne: false
            referencedRelation: "npcs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "npcs_tecnicas_tecnica_id_fkey"
            columns: ["tecnica_id"]
            isOneToOne: false
            referencedRelation: "tecnicas"
            referencedColumns: ["id"]
          },
        ]
      }
      npcs_vantagens: {
        Row: {
          npc_id: number
          vantagem_id: number
        }
        Insert: {
          npc_id: number
          vantagem_id: number
        }
        Update: {
          npc_id?: number
          vantagem_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "npcs_vantagens_npc_id_fkey"
            columns: ["npc_id"]
            isOneToOne: false
            referencedRelation: "npcs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "npcs_vantagens_vantagem_id_fkey"
            columns: ["vantagem_id"]
            isOneToOne: false
            referencedRelation: "vantagens"
            referencedColumns: ["id"]
          },
        ]
      }
      pericias: {
        Row: {
          description: string | null
          id: number
          name: string
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      personagens: {
        Row: {
          archetype: string | null
          campaign_id: number
          concept: string | null
          Habilidade: number | null
          id: number
          image: string | null
          name: string | null
          Poder: number | null
          pontos: string | null
          Pontos_Acao: number | null
          Pontos_Mana: number | null
          Pontos_Vida: number | null
          Resistencia: number | null
        }
        Insert: {
          archetype?: string | null
          campaign_id: number
          concept?: string | null
          Habilidade?: number | null
          id?: number
          image?: string | null
          name?: string | null
          Poder?: number | null
          pontos?: string | null
          Pontos_Acao?: number | null
          Pontos_Mana?: number | null
          Pontos_Vida?: number | null
          Resistencia?: number | null
        }
        Update: {
          archetype?: string | null
          campaign_id?: number
          concept?: string | null
          Habilidade?: number | null
          id?: number
          image?: string | null
          name?: string | null
          Poder?: number | null
          pontos?: string | null
          Pontos_Acao?: number | null
          Pontos_Mana?: number | null
          Pontos_Vida?: number | null
          Resistencia?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "personagens_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      personagens_desvantagens: {
        Row: {
          desvantagem_id: number
          personagem_id: number
        }
        Insert: {
          desvantagem_id: number
          personagem_id: number
        }
        Update: {
          desvantagem_id?: number
          personagem_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "personagens_desvantagens_desvantagem_id_fkey"
            columns: ["desvantagem_id"]
            isOneToOne: false
            referencedRelation: "desvantagens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personagens_desvantagens_personagem_id_fkey"
            columns: ["personagem_id"]
            isOneToOne: false
            referencedRelation: "personagens"
            referencedColumns: ["id"]
          },
        ]
      }
      personagens_pericias: {
        Row: {
          pericia_id: number
          personagem_id: number
        }
        Insert: {
          pericia_id: number
          personagem_id: number
        }
        Update: {
          pericia_id?: number
          personagem_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "personagens_pericias_pericia_id_fkey"
            columns: ["pericia_id"]
            isOneToOne: false
            referencedRelation: "pericias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personagens_pericias_personagem_id_fkey"
            columns: ["personagem_id"]
            isOneToOne: false
            referencedRelation: "personagens"
            referencedColumns: ["id"]
          },
        ]
      }
      personagens_tecnicas: {
        Row: {
          personagem_id: number
          tecnica_id: number
        }
        Insert: {
          personagem_id: number
          tecnica_id: number
        }
        Update: {
          personagem_id?: number
          tecnica_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "personagens_tecnicas_personagem_id_fkey"
            columns: ["personagem_id"]
            isOneToOne: false
            referencedRelation: "personagens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personagens_tecnicas_tecnica_id_fkey"
            columns: ["tecnica_id"]
            isOneToOne: false
            referencedRelation: "tecnicas"
            referencedColumns: ["id"]
          },
        ]
      }
      personagens_vantagens: {
        Row: {
          personagem_id: number
          vantagem_id: number
        }
        Insert: {
          personagem_id: number
          vantagem_id: number
        }
        Update: {
          personagem_id?: number
          vantagem_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "personagens_vantagens_personagem_id_fkey"
            columns: ["personagem_id"]
            isOneToOne: false
            referencedRelation: "personagens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personagens_vantagens_vantagem_id_fkey"
            columns: ["vantagem_id"]
            isOneToOne: false
            referencedRelation: "vantagens"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          username?: string | null
        }
        Relationships: []
      }
      session_encontros_desafios: {
        Row: {
          description: string | null
          id: number
          mecanica: string | null
          session_id: number
          title: string
        }
        Insert: {
          description?: string | null
          id?: number
          mecanica?: string | null
          session_id: number
          title: string
        }
        Update: {
          description?: string | null
          id?: number
          mecanica?: string | null
          session_id?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_encontros_desafios_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_ganchos_personagens: {
        Row: {
          description: string
          id: number
          personagem_name: string | null
          session_id: number
        }
        Insert: {
          description: string
          id?: number
          personagem_name?: string | null
          session_id: number
        }
        Update: {
          description?: string
          id?: number
          personagem_name?: string | null
          session_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "session_ganchos_personagens_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_locais_caracteristicas: {
        Row: {
          description: string
          id: number
          local_id: number
        }
        Insert: {
          description: string
          id?: number
          local_id: number
        }
        Update: {
          description?: string
          id?: number
          local_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "session_locais_caracteristicas_local_id_fkey"
            columns: ["local_id"]
            isOneToOne: false
            referencedRelation: "session_locais_interessantes"
            referencedColumns: ["id"]
          },
        ]
      }
      session_locais_interessantes: {
        Row: {
          id: number
          name: string
          session_id: number
        }
        Insert: {
          id?: number
          name: string
          session_id: number
        }
        Update: {
          id?: number
          name?: string
          session_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "session_locais_interessantes_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_npcs_importantes: {
        Row: {
          npc_id: number
          session_id: number
        }
        Insert: {
          npc_id: number
          session_id: number
        }
        Update: {
          npc_id?: number
          session_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "session_npcs_importantes_npc_id_fkey"
            columns: ["npc_id"]
            isOneToOne: false
            referencedRelation: "npcs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_npcs_importantes_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_objetivos: {
        Row: {
          description: string
          id: number
          session_id: number
          type: string
        }
        Insert: {
          description: string
          id?: number
          session_id: number
          type: string
        }
        Update: {
          description?: string
          id?: number
          session_id?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_objetivos_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_segredos_rumores: {
        Row: {
          description: string
          id: number
          session_id: number
        }
        Insert: {
          description: string
          id?: number
          session_id: number
        }
        Update: {
          description?: string
          id?: number
          session_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "session_segredos_rumores_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_tesouros_recompensas: {
        Row: {
          description_mecanica: string | null
          id: number
          name: string
          session_id: number
        }
        Insert: {
          description_mecanica?: string | null
          id?: number
          name: string
          session_id: number
        }
        Update: {
          description_mecanica?: string | null
          id?: number
          name?: string
          session_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "session_tesouros_recompensas_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          campaign_id: number
          comeco_forte: string | null
          created_at: string | null
          description: string | null
          gancho_proxima_aventura: string | null
          id: number
          title: string
        }
        Insert: {
          campaign_id: number
          comeco_forte?: string | null
          created_at?: string | null
          description?: string | null
          gancho_proxima_aventura?: string | null
          id?: number
          title: string
        }
        Update: {
          campaign_id?: number
          comeco_forte?: string | null
          created_at?: string | null
          description?: string | null
          gancho_proxima_aventura?: string | null
          id?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      tecnicas: {
        Row: {
          cost: string | null
          description: string | null
          duration: string | null
          id: number
          name: string
          requirements: string | null
        }
        Insert: {
          cost?: string | null
          description?: string | null
          duration?: string | null
          id?: number
          name: string
          requirements?: string | null
        }
        Update: {
          cost?: string | null
          description?: string | null
          duration?: string | null
          id?: number
          name?: string
          requirements?: string | null
        }
        Relationships: []
      }
      vantagens: {
        Row: {
          cost: string | null
          description: string | null
          id: number
          name: string
          requirements: string | null
        }
        Insert: {
          cost?: string | null
          description?: string | null
          id?: number
          name: string
          requirements?: string | null
        }
        Update: {
          cost?: string | null
          description?: string | null
          id?: number
          name?: string
          requirements?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
