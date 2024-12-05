export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      files: {
        Row: {
          created_at: string
          file_id: string
          fund_id: string | null
          name: string
          path: string
          size: number
          type: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          file_id?: string
          fund_id?: string | null
          name: string
          path: string
          size: number
          type: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          file_id?: string
          fund_id?: string | null
          name?: string
          path?: string
          size?: number
          type?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "files_fund_id_fkey"
            columns: ["fund_id"]
            isOneToOne: false
            referencedRelation: "funds"
            referencedColumns: ["fund_id"]
          },
        ]
      }
      fund_users: {
        Row: {
          created_at: string
          fund_id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          fund_id: string
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          fund_id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fund_users_fund_id_fkey"
            columns: ["fund_id"]
            isOneToOne: false
            referencedRelation: "funds"
            referencedColumns: ["fund_id"]
          },
        ]
      }
      funds: {
        Row: {
          created_at: string
          fund_id: string
          fund_size: number | null
          name: string
          organization_id: string
          status: string | null
          updated_at: string
          vintage_year: number
        }
        Insert: {
          created_at?: string
          fund_id?: string
          fund_size?: number | null
          name: string
          organization_id: string
          status?: string | null
          updated_at?: string
          vintage_year: number
        }
        Update: {
          created_at?: string
          fund_id?: string
          fund_size?: number | null
          name?: string
          organization_id?: string
          status?: string | null
          updated_at?: string
          vintage_year?: number
        }
        Relationships: [
          {
            foreignKeyName: "funds_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      organization_users: {
        Row: {
          created_at: string
          organization_id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          organization_id: string
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          organization_id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          metadata: Json | null
          name: string
          organization_id: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          metadata?: Json | null
          name: string
          organization_id?: string
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          metadata?: Json | null
          name?: string
          organization_id?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      portfolio_companies: {
        Row: {
          company_id: string
          created_at: string
          founding_date: string | null
          industry: string | null
          metadata: Json | null
          name: string
          status: string | null
          updated_at: string
        }
        Insert: {
          company_id?: string
          created_at?: string
          founding_date?: string | null
          industry?: string | null
          metadata?: Json | null
          name: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          founding_date?: string | null
          industry?: string | null
          metadata?: Json | null
          name?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
