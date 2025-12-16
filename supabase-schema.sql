-- Wölfleder CRM - Supabase Database Schema
-- Führen Sie dieses Script im Supabase SQL Editor aus

-- Customers Tabelle
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basisdaten
  firma TEXT,
  vorname TEXT NOT NULL,
  nachname TEXT NOT NULL,
  email TEXT,
  telefon TEXT NOT NULL,
  adresse TEXT,
  plz TEXT,
  ort TEXT,

  -- Auftragsinformationen
  auftragstyp TEXT NOT NULL CHECK (auftragstyp IN ('tor', 'stallbau', 'produkte')),
  prioritaet TEXT NOT NULL CHECK (prioritaet IN ('hoch', 'mittel', 'niedrig')),
  status TEXT NOT NULL,

  -- Beschreibung
  beschreibung TEXT NOT NULL,
  anforderungen TEXT,
  notizen TEXT,

  -- Workflow (als JSONB Array)
  workflow_schritte JSONB DEFAULT '[]'::jsonb,

  -- Termine (als JSONB Array)
  termine JSONB DEFAULT '[]'::jsonb,

  -- Dokumente (als JSONB Array)
  dokumente JSONB DEFAULT '[]'::jsonb,

  -- Aktivitäten (als JSONB Array)
  aktivitaeten JSONB DEFAULT '[]'::jsonb,

  -- Erinnerungen (als JSONB Array)
  erinnerungen JSONB DEFAULT '[]'::jsonb,

  -- Aufgaben (als JSONB Array)
  aufgaben JSONB DEFAULT '[]'::jsonb,

  -- Kontakt
  erst_kontakt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  letzt_kontakt TIMESTAMPTZ,
  kontaktiert BOOLEAN DEFAULT FALSE,

  -- Archivierung
  archiviert BOOLEAN DEFAULT FALSE,
  archivierungsgrund TEXT,
  archiviert_am TIMESTAMPTZ,

  -- Timestamps
  erstellt_am TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  aktualisiert_am TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index für bessere Performance
CREATE INDEX IF NOT EXISTS idx_customers_auftragstyp ON customers(auftragstyp);
CREATE INDEX IF NOT EXISTS idx_customers_prioritaet ON customers(prioritaet);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_archiviert ON customers(archiviert);
CREATE INDEX IF NOT EXISTS idx_customers_nachname ON customers(nachname);

-- Funktion für automatisches Update von aktualisiert_am
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.aktualisiert_am = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger für automatisches Update
CREATE TRIGGER update_customers_modtime
BEFORE UPDATE ON customers
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Row Level Security (RLS) aktivieren
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Policy: Jeder kann alle Kunden lesen und bearbeiten (für den Anfang)
-- WICHTIG: Später sollten Sie hier eine richtige Authentifizierung einbauen!
CREATE POLICY "Enable all access for everyone" ON customers
FOR ALL
USING (true)
WITH CHECK (true);

-- Reminders Tabelle (separate Tabelle für bessere Performance bei Abfragen)
CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kunden_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  typ TEXT NOT NULL CHECK (typ IN ('nachfassen', 'termin', 'allgemein')),
  beschreibung TEXT NOT NULL,
  faellig_am TIMESTAMPTZ NOT NULL,
  erledigt BOOLEAN DEFAULT FALSE,
  erstellt_am TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reminders_kunden_id ON reminders(kunden_id);
CREATE INDEX IF NOT EXISTS idx_reminders_faellig_am ON reminders(faellig_am);
CREATE INDEX IF NOT EXISTS idx_reminders_erledigt ON reminders(erledigt);

ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for everyone" ON reminders
FOR ALL
USING (true)
WITH CHECK (true);
