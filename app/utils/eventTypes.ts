export type EventType =
  | 'foray'
  | 'conference'
  | 'workshop'
  | 'festival'
  | 'club_meeting'
  | 'expo'
  | 'other'

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  foray: 'Foray',
  conference: 'Conference',
  workshop: 'Workshop',
  festival: 'Festival',
  club_meeting: 'Club Meeting',
  expo: 'Expo',
  other: 'Other'
}

export const EVENT_TYPE_OPTIONS = Object.entries(EVENT_TYPE_LABELS).map(
  ([value, label]) => ({ value: value as EventType, label })
)

export const EVENT_TYPE_BADGE_CLASSES: Record<EventType, string> = {
  foray: 'bg-moss-100 text-moss-800',
  conference: 'bg-sky-100 text-sky-800',
  workshop: 'bg-amber-100 text-amber-800',
  festival: 'bg-fuchsia-100 text-fuchsia-800',
  club_meeting: 'bg-teal-100 text-teal-800',
  expo: 'bg-indigo-100 text-indigo-800',
  other: 'bg-stone-200 text-stone-700'
}

export const EVENT_TYPE_ICON_BG: Record<EventType, string> = {
  foray: 'bg-moss-600',
  conference: 'bg-sky-600',
  workshop: 'bg-amber-600',
  festival: 'bg-fuchsia-600',
  club_meeting: 'bg-teal-600',
  expo: 'bg-indigo-600',
  other: 'bg-stone-600'
}
