export type EventType =
  | 'foray'
  | 'conference'
  | 'workshop'
  | 'festival'
  | 'club_meeting'
  | 'expo'
  | 'other'

export type EventStatus = 'pending' | 'approved' | 'rejected'

export type Profile = {
  id: string
  display_name: string
  organization: string | null
  website_url: string | null
  is_admin: boolean
  created_at: string
}

export type MycoEvent = {
  id: string
  organizer_id: string
  title: string
  slug: string
  description: string
  event_type: EventType
  status: EventStatus

  start_date: string
  end_date: string | null
  timezone: string

  is_online: boolean
  online_url: string | null
  venue_name: string | null
  address: string | null
  city: string | null
  region: string | null
  country: string | null
  country_code: string | null

  website_url: string | null
  contact_email: string | null
  flyer_path: string | null

  created_at: string
  updated_at: string
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Partial<Profile> & { id: string }
        Update: Partial<Profile>
        Relationships: []
      }
      events: {
        Row: MycoEvent
        Insert: Partial<MycoEvent> & {
          title: string
          slug: string
          start_date: string
          organizer_id: string
        }
        Update: Partial<MycoEvent>
        Relationships: [
          {
            foreignKeyName: 'events_organizer_id_fkey'
            columns: ['organizer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}
