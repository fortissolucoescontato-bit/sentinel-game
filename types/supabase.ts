export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: number
                    clerk_id: string
                    username: string
                    email: string
                    credits: number
                    tier: 'free' | 'pro' | 'elite'
                    style_points: number
                    unlocked_themes: string[]
                    current_theme: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: number
                    clerk_id: string
                    username: string
                    email: string
                    credits?: number
                    tier?: 'free' | 'pro' | 'elite'
                    style_points?: number
                    unlocked_themes?: string[]
                    current_theme?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: number
                    clerk_id?: string
                    username?: string
                    email?: string
                    credits?: number
                    tier?: 'free' | 'pro' | 'elite'
                    style_points?: number
                    unlocked_themes?: string[]
                    current_theme?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            safes: {
                Row: {
                    id: number
                    user_id: number
                    secret_word: string
                    system_prompt: string
                    defense_level: number
                    theme: string
                    mode: 'classic' | 'injection'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: number
                    user_id: number
                    secret_word: string
                    system_prompt: string
                    defense_level?: number
                    theme?: string
                    mode?: 'classic' | 'injection'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: number
                    user_id?: number
                    secret_word?: string
                    system_prompt?: string
                    defense_level?: number
                    theme?: string
                    mode?: 'classic' | 'injection'
                    created_at?: string
                    updated_at?: string
                }
            }
            logs: {
                Row: {
                    id: number
                    attacker_id: number
                    defender_id: number
                    safe_id: number
                    input_prompt: string
                    ai_response: string
                    success: boolean
                    credits_spent: number
                    style_score: number
                    created_at: string
                }
                Insert: {
                    id?: number
                    attacker_id: number
                    defender_id: number
                    safe_id: number
                    input_prompt: string
                    ai_response: string
                    success: boolean
                    credits_spent: number
                    style_score: number
                    created_at?: string
                }
                Update: {
                    id?: number
                    attacker_id?: number
                    defender_id?: number
                    safe_id?: number
                    input_prompt?: string
                    ai_response?: string
                    success?: boolean
                    credits_spent?: number
                    style_score?: number
                    created_at?: string
                }
            }
            unlocked_safes: {
                Row: {
                    user_id: number
                    safe_id: number
                    unlocked_at: string
                }
                Insert: {
                    user_id: number
                    safe_id: number
                    unlocked_at?: string
                }
                Update: {
                    user_id?: number
                    safe_id?: number
                    unlocked_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            get_attack_history: {
                Args: {
                    p_user_id: number
                    p_limit: number
                }
                Returns: any[]
            }
            get_available_safes: {
                Args: {
                    p_user_id: number
                }
                Returns: any[]
            }
            get_user_rank: {
                Args: {
                    p_user_id: number
                }
                Returns: number
            }
            create_safe_transaction: {
                Args: {
                    p_user_id: number
                    p_secret_word: string
                    p_system_prompt: string
                    p_cost: number
                    p_mode?: string
                }
                Returns: number
            }
        }
        Enums: {
            [_ in never]: never
        }
    }
}
